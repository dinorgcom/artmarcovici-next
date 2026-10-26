"""Check published ranking cells against the original workbooks and the evidence ledger."""
import argparse, json, math
from pathlib import Path
from collections import defaultdict
import openpyxl, xlrd

ROOT=Path(__file__).resolve().parent; PUBLIC=ROOT.parents[1]/'public/us-influence'
arg=argparse.ArgumentParser();arg.add_argument('--raw',type=Path,required=True);raw=arg.parse_args().raw
read=lambda p:json.loads(p.read_text(encoding='utf-8'))
d=read(PUBLIC/'statistics/rankings.json');books={};cells=0;numeric=0
for s in read(ROOT/'ranking-sources.json'):
 p=raw/s['file'];books[s['id']]=xlrd.open_workbook(p) if p.suffix=='.xls' else openpyxl.load_workbook(p,data_only=True)
for r in d['industry']:
 sheet,cell=r['locator'].split('!');row,col=openpyxl.utils.cell.coordinate_to_tuple(cell);w=books[r['source']]
 v=w.sheet_by_name(sheet).cell_value(row-1,col-1) if hasattr(w,'sheet_by_name') else w[sheet][cell].value
 expected=v*1e6 if isinstance(v,(int,float)) else None
 assert r['amount']==expected,(r,v)
 assert str(r['sourceValue'] or '')==str(v or ''),(r,v)
 cells+=1;numeric+=expected is not None

catalog=read(PUBLIC/'data/countries.json');evidence={c['id']:read(PUBLIC/('data/'+c['id']+'.json')) for c in catalog}
expected=defaultdict(lambda:[0,0,0])
for c,rr in evidence.items():
 for r in rr:
  if r.get('year') is None or not 2006<=r['year']<=2025:continue
  ms=[]
  if r['category']=='investment':ms=[r['measure']]
  if r['measure'] in ['university-gift','university-contract']:
   ms=[r['measure']]+([] if r.get('possibleDuplicate') else [r['measure']+'-distinct'])
  if r['measure']=='fara-receipts' and not r.get('duplicateOf'):ms=['fara-'+r['category']]
  for m in ms:
   a=expected[(m,c,r['year'])];a[1]+=1
   if r['amount'] is None:a[2]+=1
   else:a[0]+=r['amount']
checked=0
for m,rr in d['series'].items():
 for r in rr:
  amount,count,missing=expected.pop((m,r['country'],r['year']))
  assert r['count']==count and r['unknown']==missing
  assert (r['amount'] is None and count==missing) or (r['amount'] is not None and math.isclose(r['amount'],amount,rel_tol=0,abs_tol=.011))
  checked+=1
assert not expected
report={'industryCellsCheckedAgainstOriginal':cells,'numericIndustryCells':numeric,'aggregateRowsReconciledToEvidence':checked,'failures':[]}
(PUBLIC/'statistics/verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
audit=read(PUBLIC/'statistics/audit.json');audit['fullVerification']=report
(PUBLIC/'statistics/audit.json').write_text(json.dumps(audit,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps(report))
