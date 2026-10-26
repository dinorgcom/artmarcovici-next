"""Check public aggregates against their complete detail ledger and original XML samples."""
import argparse,collections,gzip,hashlib,json,random,re,sqlite3,zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
p=argparse.ArgumentParser();p.add_argument('--raw',type=Path,required=True);args=p.parse_args()
OUT=Path(__file__).resolve().parents[2]/'public/us-influence/lda'
read=lambda p:json.loads(gzip.decompress(p.read_bytes()) if p.suffix=='.gz' else p.read_text(encoding='utf-8'))
summary=read(OUT/'summary.json.gz');src={s['id']:s for s in summary['sources']}
country=collections.defaultdict(lambda:[0,0,0]);org=collections.defaultdict(lambda:[0,0,0]);links=collections.defaultdict(set);ids=set();sample=[];aipac=[];errors=[]
rng=random.Random(20261026);seen=0
for path in sorted((OUT/'details').glob('*.json.gz')):
 for d in read(path):
  assert d['id'] not in ids,('Duplicate public ID',d['id']);ids.add(d['id']);seen+=1
  assert hashlib.sha256(d['id'].encode()).hexdigest().startswith(path.name[:2])
  assert d['source'] in src
  if d['countryEvidence']:assert d['countryEvidence']['date']<=d['event'],('Future attribution',d['id'])
  assert d['amount'] is None or isinstance(d['amount'],(float,int))
  value=d['amount']
  if d['country'] and d['country']!='US':
   g=country[(d['reportingScope'],d['country'],d['year'],d['method'])];g[0]+=value or 0;g[1]+=1;g[2]+=value is None
  if d['reportingScope']=='self':
   g=org[(d['pair'],d['country'],d['year'],d['method'])];g[0]+=value or 0;g[1]+=1;g[2]+=value is None
  for c in d['linkedCountries']:links[(c,d['year'])].add(d['pair'])
  if 'americanisraelpublicaffairscommittee'==re.sub('[^a-z]','',d['client'].lower()):
   assert d['reportingScope']=='self' or d['registrant']!=d['client']
   if d['reportingScope']=='self':assert d['country']=='US';aipac.append(d)
  if len(sample)<500:sample.append(d)
  else:
   k=rng.randrange(seen)
   if k<500:sample[k]=d
for r in summary['countries']:
 v=country[(r['scope'],r['country'],r['year'],r['method'])]
 assert v[1]==r['reports'] and v[2]==r['unknown']
 assert (r['amount'] is None and v[1]==v[2]) or (r['amount'] is not None and abs(r['amount']-v[0])<.02)
for r in summary['organizations']:
 v=org[(r['org'],r['country'],r['year'],r['method'])]
 assert v[1]==r['reports'] and v[2]==r['unknown']
 assert (r['amount'] is None and v[1]==v[2]) or (r['amount'] is not None and abs(r['amount']-v[0])<.02)
for r in summary['relations']:assert r['mandates']==len(links[(r['country'],r['year'])])
assert len(ids)==summary['meta']['publicDetailReports']
assert len(ids)==sum(len(read(p)) for p in (OUT/'years').glob('*.json.gz'))
rawchecked=0;originchecked=0;opened={}
for d in sample+[r for r in aipac if r['year'] in [2024,2025]]:
 if d['archive'] not in opened:opened[d['archive']]=zipfile.ZipFile(args.raw/d['archive'])
 raw=opened[d['archive']].read(d['member'])
 if d.get('xmlCharacterRepair'):continue
 e=ET.fromstring(raw);field=lambda n:' '.join((e.findtext(n) or '').split())
 for k,xml in [('incomeRaw','income'),('expensesRaw','expenses'),('method','expensesMethod'),('client','clientName')]:assert d[k]==field(xml),(d['id'],k)
 assert int(field('reportYear'))==d['year'];rawchecked+=1
 if d['countryEvidence']:
  ce=d['countryEvidence'];archive=src[ce['source']]['file']
  if archive not in opened:opened[archive]=zipfile.ZipFile(args.raw/archive)
  original=ET.fromstring(opened[archive].read(ce['member']))
  paths=['country'] if d['countryBasis']=='registrant-self' else ['prinClientCountry','updates/prinClientCountry'] if d['countryBasis']=='client-principal' else ['clientCountry','updates/clientCountry']
  assert ce['raw'] in [' '.join((original.findtext(path) or '').split()) for path in paths],('Country evidence',d['id'])
  originchecked+=1
for z in opened.values():z.close()
four=sorted((r for r in aipac if r['year']==2024),key=lambda r:r['period'])
assert [r['amount'] for r in four]==[837889,786536,789890,909953]
assert sum(r['amount'] for r in four)==3324268
db=sqlite3.connect(args.raw/'ledger.sqlite')
assert db.execute('SELECT COUNT(*) FROM selected').fetchone()[0]==summary['meta']['selectedReports']
assert not db.execute('SELECT pair,year,period,COUNT(*) FROM selected GROUP BY pair,year,period HAVING COUNT(*)>1 LIMIT 1').fetchone()
latest=0
for d in sample:
 row=db.execute('SELECT id FROM docs WHERE kind=2 AND pair=? AND year=? AND period=? ORDER BY stamp DESC,CAST(id AS INTEGER) DESC LIMIT 1',(d['pair'],d['year'],d['period'])).fetchone()
 assert row[0]==d['id'];latest+=1
expected=sum(s['entries'] for s in src.values() if s['file'].startswith('LD-'))
actual=db.execute('SELECT SUM(records+errors) FROM files').fetchone()[0]
assert expected==actual,(expected,actual)
assert summary['meta']['registrations']+sum(y['rawReports'] for y in summary['meta']['years'])==summary['meta']['rawDocuments']
result={'status':'passed','detailReportsReaggregated':len(ids),'countryMethodYearGroups':len(country),'organizationMethodYearGroups':len(org),'foreignCountryYearRelations':len(links),'originalXmlChecks':rawchecked,'originalCountryEvidenceChecks':originchecked,'latestVersionChecks':latest,'archiveEntriesReconciled':actual,'aipac2024':{'quarters':[r['amount'] for r in four],'sum':3324268,'country':'US','excludedFromForeignCountryTotals':True},'limitations':'Checks validate extraction, arithmetic and recorded provenance; they do not certify the truth or completeness of disclosures.'}
(OUT/'verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(result))
