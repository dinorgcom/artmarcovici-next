"""ForeignAssistance.gov 2006–2025: separate obligations/disbursements.

Download the files linked by https://foreignassistance.gov/data using a normal
browser if the server rejects scripted requests. Pass --raw to their directory.
No credentials, mirrors or estimated missing amounts are used.
"""
import argparse, hashlib, json, csv, zipfile, re
from pathlib import Path
from collections import defaultdict, Counter
import pandas as pd

ROOT=Path(__file__).resolve().parent
OUT=ROOT.parents[1]/'public/us-aid/data'; OUT.mkdir(parents=True,exist_ok=True)
arg=argparse.ArgumentParser();arg.add_argument('--raw',type=Path,required=True);raw=arg.parse_args().raw
def write(p,x):p.write_text(json.dumps(x,ensure_ascii=False,separators=(',',':'),allow_nan=False),encoding='utf-8')
files=['us_foreign_aid_complete.csv','us_foreign_aid_country.csv','us_foreign_aid_usg_sector.csv','us_foreign_aid_funding.csv']
sources=[]
for n in files:
 p=raw/n
 with p.open('rb') as f:sha=hashlib.file_digest(f,'sha256').hexdigest()
 sources.append({'id':n[:-4],'file':n,'url':'https://foreignassistance.gov/static/'+n,'bytes':p.stat().st_size,'sha256':sha,'retrieved':'2026-10-26','sourceUpdated':'2026-09-30','kind':'government-data'})
print('Source hashes recorded',flush=True)
cols=['Country Code','Country Name','Foreign Assistance Objective Name','Transaction Type Name','Fiscal Year','Current Dollar Amount',
      'US Category Name','US Sector Name','Funding Account ID','Funding Account Name','Managing Agency Name','Implementing Partner Name',
      'Aid Type Group Name','aid_type_name','Activity ID','Activity Name','Transaction Date']
base=['Country Code','Fiscal Year','Transaction Type Name','Foreign Assistance Objective Name']
groups={t:defaultdict(lambda:[0.0,0,0]) for t in ['annual','sector','account']}
extra={'annual':[],'sector':['US Category Name','US Sector Name'],'account':['Funding Account ID','Funding Account Name']}
names={}; best={}; input_rows=0; selected=0; negatives=0; nulls=0; objectives=Counter(); transaction_types=Counter(); aidtypes=Counter()
for df in pd.read_csv(raw/files[0],usecols=cols,dtype=str,chunksize=120000,keep_default_na=False):
 input_rows+=len(df)
 transaction_types.update(df['Transaction Type Name'].value_counts().to_dict())
 df=df[df['Fiscal Year'].isin([str(x) for x in range(2006,2026)]) & df['Transaction Type Name'].isin(['Obligations','Disbursements'])].copy()
 if df.empty:continue
 selected+=len(df); names.update(dict(zip(df['Country Code'],df['Country Name'])))
 df['Current Dollar Amount']=pd.to_numeric(df['Current Dollar Amount'],errors='coerce')
 negatives+=int((df['Current Dollar Amount']<0).sum());nulls+=int(df['Current Dollar Amount'].isna().sum())
 objectives.update(df['Foreign Assistance Objective Name'].value_counts().to_dict());aidtypes.update(df['aid_type_name'].value_counts().to_dict())
 for mode,ex in extra.items():
  grouped=df.groupby(base+ex,dropna=False)['Current Dollar Amount'].agg(['sum','size','count'])
  for key,row in grouped.iterrows():
   g=groups[mode][key];g[0]+=row['sum'];g[1]+=int(row['size']);g[2]+=int(row['size']-row['count'])
 valid=df[df['Current Dollar Amount'].notna()]
 for idx in valid.groupby(base)['Current Dollar Amount'].idxmax():
  row=valid.loc[idx].to_dict();key=tuple(row[x] for x in base)
  if key not in best or row['Current Dollar Amount']>best[key]['Current Dollar Amount']:
   row['sourceRecord']=int(idx)+2;best[key]=row
 if input_rows%600000==0:print(f'Processed {input_rows:,}; selected {selected:,}',flush=True)
print(f'Parsed {input_rows:,} original records',flush=True)

catalog=json.loads((ROOT.parents[1]/'public/us-influence/data/countries.json').read_text(encoding='utf-8'))
iso={c['iso3']:c for c in catalog if c.get('iso3')}
countries=[]
for code,n in sorted(names.items()):
 c=iso.get(code)
 countries.append({'id':code,'name':n,'iso2':c['id'] if c else ('XK' if code in ['XKX','CS-KM'] else None),
  'kind':c['kind'] if c else ('additional-jurisdiction' if code in ['XKX','CS-KM'] else 'source-category')})
seen={c['id'] for c in countries}
for c in catalog:
 if c['kind'] in ['un-member','un-observer'] and c['iso3'] not in seen:
  countries.append({'id':c['iso3'],'name':c['name'],'iso2':c['id'],'kind':c['kind']})

def records(mode):
 out=[]
 for key,(v,n,missing) in sorted(groups[mode].items()):
  c,y,t,o,*e=key
  r={'country':c,'year':int(y),'transaction':t,'objective':o or 'Unspecified','amount':round(v,2) if n>missing else None,'count':n,'unknown':missing}
  if mode=='sector':r.update(category=e[0] or None,sector=e[1] or None)
  if mode=='account':r.update(accountId=e[0] or None,account=e[1] or None)
  out.append(r)
 return out
annual=records('annual'); sectors=records('sector'); accounts=records('account')

# Independent check against separately published country summary, not our own grouping code.
expected={}
summary=pd.read_csv(raw/files[1],dtype=str,keep_default_na=False)
for _,r in summary.iterrows():
 if r['Fiscal Year'] in [str(y) for y in range(2006,2026)] and r['Transaction Type Name'] in ['Obligations','Disbursements']:
  k=(r['Country Code'],int(r['Fiscal Year']),r['Transaction Type Name']);expected[k]=expected.get(k,0)+float(r['current_amount'])
actual=defaultdict(float)
for r in annual:
 if r['amount'] is not None:actual[(r['country'],r['year'],r['transaction'])]+=r['amount']
differences=[]
for k in sorted(expected.keys()|actual.keys()):
 a=actual.get(k);e=expected.get(k)
 if a is None or e is None or abs(a-e)>1.01:differences.append({'country':k[0],'year':k[1],'transaction':k[2],'complete':a,'summary':e,'difference':round(a-e,2) if a is not None and e is not None else None})

evidence=[]
for key,r in sorted(best.items()):
 evidence.append({'country':r['Country Code'],'year':int(r['Fiscal Year']),'transaction':r['Transaction Type Name'],'objective':r['Foreign Assistance Objective Name'],
  'amount':r['Current Dollar Amount'],'agency':r['Managing Agency Name'] or None,'implementer':r['Implementing Partner Name'] or None,
  'activity':r['Activity Name'] or None,'activityId':r['Activity ID'] or None,'account':r['Funding Account Name'] or None,
  'date':r['Transaction Date'] or None,'aidType':r['aid_type_name'] or None,'source':'us_foreign_aid_complete',
  'locator':'CSV logical record '+str(r['sourceRecord'])+' (header = record 1)',
  'selection':'Largest single original numeric record in this country / fiscal year / objective / transaction group; NOT full activity budget'})
meta={'asOf':'2026-10-26','sourceUpdated':'2026-09-30','targetYears':[2006,2025],'inputRows':input_rows,'selectedRows':selected,
      'negativeRows':negatives,'unknownAmountRows':nulls,'objectives':dict(objectives),'transactionTypesInOriginal':dict(transaction_types),
      'aidTypeNames':dict(aidtypes),'countries':len(countries),'annualRows':len(annual),'sourceVersionReconciled':len(differences)==0,
      'complete':False,'notes':['Nominal USD only. Fiscal years, not calendar years.','Economic and military use the official Foreign Assistance Objective field.',
      'Obligations and disbursements never added. Net corrections and negative entries retained.',
      'Beneficiary country does not mean a payment to that government. Implementing partners may be in the USA or elsewhere.',
      'Grants and loans cannot be comprehensively separated using these fields; no universal grants total is asserted.',
      'Aid is not all US spending connected with a country. Commercial arms sales, all war costs and every supplemental authorization are not claimed as covered.',
      'Source records are disclosures, not independently verified bank payments. Recent years remain subject to revisions.']}
write(OUT/'summary.json',{'meta':meta,'sources':sources,'countries':countries,'annual':annual})
for c in countries:
 code=c['id'];write(OUT/(code+'.json'),{'sectors':[r for r in sectors if r['country']==code],'accounts':[r for r in accounts if r['country']==code],'examples':[r for r in evidence if r['country']==code]})
write(OUT/'audit.json',{'sourceHashesRecordedAtBuild':True,'independentCountrySummaryComparisons':len(expected),'differences':differences,'toleranceUSD':1.01,'failures':['Country summary differences require review'] if differences else [],'selectedRows':selected,'negativeRowsRetained':negatives,'unknownAmountRows':nulls})
for fn,rr in [('country-year-objective.csv',annual),('country-year-sector.csv',sectors),('country-year-account.csv',accounts),('original-record-examples.csv',evidence)]:
 with (OUT/fn).open('w',encoding='utf-8-sig',newline='') as f:
  cw=csv.DictWriter(f,fieldnames=list(rr[0]));cw.writeheader()
  cw.writerows({k:("'"+v if isinstance(v,str) and re.match(r'^[=+@\-\t\r]',v) else v) for k,v in row.items()} for row in rr)
with zipfile.ZipFile(OUT/'aid-data.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in OUT.glob('*.csv'):z.write(p,p.name)
 for p in [OUT/'summary.json',OUT/'audit.json']:z.write(p,p.name)
write(ROOT/'source-manifest.json',sources)
print(json.dumps({'meta':{k:v for k,v in meta.items() if k not in ['aidTypeNames','notes']},'summaryDifferences':len(differences),'firstDifferences':differences[:10]},ensure_ascii=False),flush=True)
