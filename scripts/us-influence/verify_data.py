from pathlib import Path
from collections import Counter,defaultdict
from functools import lru_cache
import json,re,csv,hashlib,zipfile,math,pymupdf,openpyxl
ROOT=Path(__file__).parent;DATA=ROOT.parents[1]/'public/us-influence/data';RAW=ROOT/'raw'
read=lambda p:json.loads(p.read_text(encoding='utf-8-sig'))
cc=read(DATA/'countries.json');ss=read(DATA/'sources.json');meta=read(DATA/'meta.json');sources={s['id']:s for s in ss}
rr=[r for c in cc for r in read(DATA/(c['id']+'.json'))];ids={r['id'] for r in rr};fail=[]
def check(name,condition):
 if not condition:fail.append(name)
check('unique record IDs',len(ids)==len(rr));check('counts agree',len(rr)==meta['records']);check('UN membership',Counter(c['kind'] for c in cc)['un-member']==193);check('UN observers',sum(c['kind']=='un-observer' for c in cc)==2)
for r in rr:
 check('source reference '+r['id'],r['source'] in sources)
 check('year range '+r['id'],r.get('year') is None or 2006<=r['year']<=2025)
 check('finite amount '+r['id'],r['amount'] is None or isinstance(r['amount'],(int,float)) and math.isfinite(r['amount']))
 check('no invented cash proof '+r['id'],r['cashVerified']==False)
 if r.get('amountMin') is not None:check('band '+r['id'],r['amount'] is None and (r['amountMax'] is None or r['amountMax']>=r['amountMin']))
 if r.get('duplicateOf'):check('duplicate reference '+r['id'],r['duplicateOf'] in ids)
 if r['category']=='domestic':check('domestic country '+r['id'],r['country']=='US')
 if r.get('status')=='suppressed-or-range':check('BEA suppressed null '+r['id'],r['amount'] is None)
for s in ss:check('source hash '+s['id'],hashlib.sha256((RAW/s['file']).read_bytes()).hexdigest()==s['sha256'])
print('schema and hashes',len(fail),flush=True)
# Every Section 117 amount, institution and origin compared with its original spreadsheet row.
ed={int(r['id'][4:]):r for r in rr if r['id'].startswith('ed-r')};w=openpyxl.load_workbook(RAW/'section117-2025-02-28.xlsx',read_only=True,data_only=True)
for rn,row in enumerate(w.active.values,1):
 if rn in ed:
  r=ed[rn];check('ED row '+str(rn),r['amount']==row[6] and r['recipient']==row[1] and r['origin']==row[5])
print('ED source row comparisons',len(ed),len(fail),flush=True)
# Compare all FARA numbers and date strings to the linked PDF amount page.
@lru_cache(maxsize=40)
def pdfdoc(file):return pymupdf.open(RAW/file)
@lru_cache(maxsize=15000)
def pdftext(file,page):return pdfdoc(file)[page-1].get_text(sort=True)
fs=[r for r in rr if r['measure']=='fara-receipts' and r['amount'] is not None]
for r in fs:
 t=re.sub(r'\s+',' ',pdftext(sources[r['source']]['file'],r['amountPage']));needle=f"{r['amount']:,.2f}"
 check('FARA amount page '+r['id'],needle in t)
 check('FARA six month period '+r['id'],r['periodEnd'] is not None and 'six' in t.lower())
print('FARA source page amount comparisons',len(fs),len(fail),flush=True)
# Recompute chart inputs independently; no missing value is promoted to zero.
metrics=defaultdict(lambda:defaultdict(lambda:defaultdict(lambda:{'amount':0,'count':0})))
for r in rr:
 y=r.get('year');m=r['measure'];k=r['country']
 if y is None:continue
 keys=[]
 if m.startswith('university-'):keys=[m]+([] if r.get('possibleDuplicate') else [m+'-distinct'])
 if m.startswith('fdi-') and r['amount'] is not None:keys=[m]
 if m=='fara-receipts' and r['amount'] is not None and not r.get('duplicateOf'):keys=['fara-records']
 for key in keys:
  v=metrics[k][key][str(y)];v['count']+=1;v['amount']+=0 if key=='fara-records' else (r['amount'] or 0)
for c in cc:
 for m,years in c['metrics'].items():
  for y,v in years.items():
   actual=metrics[c['id']][m][y];check('chart '+c['id']+'/'+m+'/'+y,v['count']==actual['count'] and math.isclose(v['amount'],actual['amount'],rel_tol=1e-10,abs_tol=.01))
# Country/category coverage is explicit even where no record exists.
cats=['lobby','lda','university','thinktank','media','representation','investment','domestic'];bycountry=defaultdict(list)
for r in rr:bycountry[r['country']].append(r)
summary=[];annual=[]
for c in cc:
 for cat in cats:
  subset=[r for r in bycountry[c['id']] if r['category']==cat and r['review']!='secondary-unverified'];secondary=[r for r in bycountry[c['id']] if r['category']==cat and r['review']=='secondary-unverified']
  years=sorted(set(r['year'] for r in subset if r['year'] is not None))
  status='not-applicable-domestic-comparator' if cat=='domestic' and c['id']!='US' else 'partial-indexed-evidence' if subset else 'unknown-no-indexed-primary-evidence'
  summary.append({'country':c['id'],'name':c['name'],'kind':c['kind'],'category':cat,'status':status,'primaryRows':len(subset),'amountOrBandRows':sum(r['amount'] is not None or r.get('amountMin') is not None for r in subset),'secondaryRows':len(secondary),'years':';'.join(map(str,years)),'undatedRows':sum(r['year'] is None for r in subset),'sourceIds':';'.join(sorted(set(r['source'] for r in subset))),'complete2006_2025':False,'paymentTotal':None})
  for y in list(range(2006,2026))+[None]:
   yr=[r for r in subset if r['year']==y];annual.append({'country':c['id'],'name':c['name'],'category':cat,'year':y,'indexedRows':len(yr),'amountOrBandRows':sum(r['amount'] is not None or r.get('amountMin') is not None for r in yr),'status':'partial-indexed-evidence' if yr else 'unknown-no-indexed-evidence','paymentTotal':None})
for name,items in [('coverage-country-category.csv',summary),('coverage-country-category-year.csv',annual)]:
 with (DATA/name).open('w',encoding='utf-8-sig',newline='') as f:
  writer=csv.DictWriter(f,fieldnames=list(items[0]));writer.writeheader();writer.writerows(items)
audit={'runDate':'2026-10-26','records':len(rr),'sourcesHashed':len(ss),'edRowsComparedToOriginal':len(ed),'faraAmountPageComparisons':len(fs),'chartInputsRecomputed':True,'coverageCountryCategoryRows':len(summary),'coverageCountryCategoryYearRows':len(annual),'failures':fail,'limitations':['Automated consistency checks are not independent verification of actual payments.','FARA originals and amended filings are not exhaustively manually reconciled.','Donor lists are a selected subset; secondary tracker remains unverified.','LDA not ingested.','ED 2025 incomplete.','No consolidated spending total.']}
(DATA/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8');(ROOT/'parsed/audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
# Regenerate the self-contained archive, including methods and coverage.
with zipfile.ZipFile(DATA/'evidence.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for name in ['countries.json','sources.json','meta.json','audit.json','coverage-country-category.csv','coverage-country-category-year.csv']:z.write(DATA/name,name)
 z.write(DATA.parent/'methodology.md','methodology.md')
 with z.open('evidence.jsonl','w') as f:
  for r in rr:f.write((json.dumps(r,ensure_ascii=False)+'\n').encode())
print(json.dumps(audit,ensure_ascii=False),flush=True)
if fail:raise SystemExit(1)
