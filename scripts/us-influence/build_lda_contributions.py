"""Index LD-203 contributions separately; never add them to LD-2 or FEC totals."""
import argparse,collections,csv,datetime as dt,hashlib,io,json,re,sqlite3,unicodedata,zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
p=argparse.ArgumentParser();p.add_argument('--raw',type=Path,required=True);args=p.parse_args()
OUT=Path(__file__).resolve().parents[2]/'public/us-influence/lda';OUT.mkdir(exist_ok=True)
db=sqlite3.connect(args.raw/'contributions.sqlite');db.execute('PRAGMA journal_mode=WAL')
db.executescript('CREATE TABLE IF NOT EXISTS files(name TEXT PRIMARY KEY);CREATE TABLE IF NOT EXISTS docs(id TEXT PRIMARY KEY,filer TEXT,year INTEGER,period TEXT,stamp TEXT,payload TEXT);CREATE TABLE IF NOT EXISTS errors(archive TEXT,member TEXT,error TEXT);')
norm=lambda s:re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).encode('ascii','ignore').decode().lower())
text=lambda e,k:' '.join((e.findtext(k) or '').split())
def date(s):
 for f in ['%m/%d/%Y %I:%M:%S %p','%m/%d/%Y','%Y-%m-%d']:
  try:return dt.datetime.strptime(s,f).isoformat()
  except ValueError:pass
 return ''
done={x[0] for x in db.execute('SELECT name FROM files')}
for p in sorted(args.raw.glob('LC-*.zip')):
 if p.name in done:continue
 batch=[];n=0
 with zipfile.ZipFile(p) as z:
  for member in z.namelist():
   try:
    e=ET.fromstring(z.read(member));y=int(text(e,'reportYear'));period='H1' if text(e,'reportType').startswith('M') else 'H2'
    person=' '.join(filter(None,[text(e,'lobbyistFirstName'),text(e,'lobbyistMiddleName'),text(e,'lobbyistLastName'),text(e,'lobbyistSuffix')]))
    org=text(e,'organizationName');filer=text(e,'houseRegID')+'|'+text(e,'filerType')+'|'+norm(person or org)
    d={'id':Path(member).stem,'archive':p.name,'member':member,'year':y,'period':period,'filerType':text(e,'filerType'),'organization':org,'lobbyist':person,'houseId':text(e,'houseRegID'),'senateId':text(e,'senateRegID'),'amendment':text(e,'amendment'),'signed':text(e,'signedDate'),'noContributions':text(e,'noContributions'),'rows':[{k:text(c,k) for k in ['type','contributorName','payeeName','recipientName','amount','date']} for c in e.findall('contributions/contribution')]}
    batch.append((d['id'],filer,y,period,date(d['signed']),json.dumps(d,ensure_ascii=False,separators=(',',':'))));n+=1
    if len(batch)>=1000:db.executemany('INSERT OR REPLACE INTO docs VALUES(?,?,?,?,?,?)',batch);batch=[]
   except Exception as exc:db.execute('INSERT INTO errors VALUES(?,?,?)',(p.name,member,str(exc)))
 if batch:db.executemany('INSERT OR REPLACE INTO docs VALUES(?,?,?,?,?,?)',batch)
 db.execute('INSERT INTO files VALUES(?)',(p.name,));db.commit();print(json.dumps({'archive':p.name,'reports':n}),flush=True)
db.executescript('DROP TABLE IF EXISTS selected;CREATE TABLE selected AS SELECT * FROM (SELECT *,ROW_NUMBER() OVER(PARTITION BY filer,year,period ORDER BY stamp DESC,CAST(id AS INTEGER) DESC) AS rn FROM docs) WHERE rn=1;')
cols=['report_id','organization','lobbyist','filer_type','year','period','contribution_type','contributor','payee','recipient','amount_raw','date_raw','source_zip','xml_member']
counts=collections.Counter();types=collections.Counter();yearcounts=collections.Counter()
csvpath=args.raw/'ld203-contributions.csv'
with csvpath.open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.writer(f);w.writerow(cols)
 for (payload,) in db.execute('SELECT payload FROM selected ORDER BY year,period,id'):
  r=json.loads(payload);counts['selectedReports']+=1;yearcounts[r['year']]+=1
  for a in r['rows']:
   if not any(a.values()):counts['emptyPlaceholderRowsExcluded']+=1;continue
   w.writerow([r['id'],r['organization'],r['lobbyist'],r['filerType'],r['year'],r['period'],a['type'],a['contributorName'],a['payeeName'],a['recipientName'],a['amount'],a['date'],'https://disclosurespreview.house.gov/data/LC/'+r['archive'][3:],r['member']]);counts['contributionRows']+=1;types[a['type']]+=1
audit={'retrieved':'2026-10-26','rawReports':db.execute('SELECT COUNT(*) FROM docs').fetchone()[0],**dict(counts),'types':dict(types),'reportsByYear':dict(yearcounts),'errors':[dict(zip(['archive','member','error'],r)) for r in db.execute('SELECT * FROM errors')],'method':'Last signed report per House registrant ID, filer type, normalized full lobbyist/organization name, year and half-year. Name-based person linkage can miss spelling changes; no cross-filer deduplication.','warning':'These contribution disclosures can overlap FEC and other filers. No additive spending total or foreign-country attribution. Amounts remain original strings; missing is not zero.'}
(OUT/'contributions-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
with zipfile.ZipFile(OUT/'ld203-contributions.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 z.write(csvpath,'ld203-contributions.csv');z.writestr('methodology.json',json.dumps(audit,ensure_ascii=False,indent=2))
print(json.dumps(audit,ensure_ascii=False),flush=True)
db.commit();db.close()
