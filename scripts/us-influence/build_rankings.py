"""Derive separately labelled rankings; never an all-channel influence total.

python build_rankings.py --raw /path/to/downloaded/corpus
Industry originals and hashes: ranking-sources.json. Main evidence: public/us-influence/data.
"""
import argparse, csv, hashlib, json, re, unicodedata
from collections import defaultdict
from pathlib import Path
import openpyxl, xlrd

ROOT = Path(__file__).resolve().parent
DATA = ROOT.parents[1] / 'public/us-influence/data'
OUT = ROOT.parents[1] / 'public/us-influence/statistics'
OUT.mkdir(exist_ok=True)
arg = argparse.ArgumentParser()
arg.add_argument('--raw', type=Path, default=ROOT/'raw')
raw = arg.parse_args().raw
read = lambda p: json.loads(p.read_text(encoding='utf-8'))
write = lambda p, x: p.write_text(json.dumps(x, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
countries = read(DATA/'countries.json')
sources = read(DATA/'sources.json')
norm = lambda x: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', str(x)).encode('ascii','ignore').decode().lower())
names = {norm(n): c['id'] for c in countries for n in [c['name'], c['id'], *c['aliases']]}
names.update({'allcountries':'extra-allcountries','korea':'KR'})
groups = defaultdict(lambda: {'amount':0, 'count':0, 'unknown':0, 'duplicates':0, 'sources':set(), 'recipients':defaultdict(float)})
think, domestic = [], []
for c in countries:
    for r in read(DATA/(c['id']+'.json')):
        if r['category']=='domestic': domestic.append(r)
        if r['category']=='thinktank' and r['review']=='primary-reviewed': think.append(r)
        if not r.get('year') or not 2006 <= r['year'] <= 2025: continue
        ms = []
        if r['measure'] in ['university-gift','university-contract']:
            ms.append(r['measure'])
            if not r.get('possibleDuplicate'): ms.append(r['measure']+'-distinct')
        if r['measure']=='fara-receipts' and not r.get('duplicateOf'):
            ms.append('fara-'+r['category'])
        if r['category']=='investment': ms.append(r['measure'])
        for m in ms:
            g = groups[(m,c['id'],r['year'])]
            g['count']+=1; g['sources'].add(r['source'])
            g['duplicates']+=bool(r.get('possibleDuplicate'))
            if r['amount'] is None: g['unknown']+=1
            else:
                g['amount']+=r['amount']
                if r.get('recipient'):g['recipients'][r['recipient']]+=r['amount']
series = defaultdict(list)
for (m,c,y), g in groups.items():
    series[m].append({'country':c,'year':y,'amount':round(g['amount'],2) if g['count']>g['unknown'] else None,
      'count':g['count'],'unknown':g['unknown'],'possibleDuplicates':g['duplicates'],
      'sources':sorted(g['sources']),
      'recipients':sorted([{'name':n,'amount':round(v,2)} for n,v in g['recipients'].items()],key=lambda x:-x['amount'])})

sectors = [
 {'id':'manufacturing','column':2,'de':'Verarbeitendes Gewerbe','en':'Manufacturing'},
 {'id':'wholesale','column':11,'de':'Großhandel','en':'Wholesale trade'},
 {'id':'retail','column':12,'de':'Einzelhandel','en':'Retail trade'},
 {'id':'information','column':13,'de':'Information','en':'Information'},
 {'id':'banking','column':14,'de':'Einlageninstitute / Banken','en':'Depository institutions'},
 {'id':'finance','column':15,'de':'Sonstige Finanzdienste & Versicherungen','en':'Other finance & insurance'},
 {'id':'realestate','column':16,'de':'Immobilien & Vermietung','en':'Real estate & rental / leasing'},
 {'id':'professional','column':17,'de':'Freiberufliche, wissenschaftliche & technische Dienste','en':'Professional, scientific & technical services'},
 {'id':'other','column':18,'de':'Weitere Branchen','en':'Other industries'}]
industry, checks = [], []
extra = read(ROOT/'ranking-sources.json')
for s in extra:
    p=raw/s['file']
    assert hashlib.sha256(p.read_bytes()).hexdigest()==s['sha256'], p
    if p.suffix=='.xls':
        w=xlrd.open_workbook(p)
        sheets=[(sh.name,[sh.row_values(i) for i in range(sh.nrows)]) for sh in w.sheets()]
    else:
        w=openpyxl.load_workbook(p,read_only=True,data_only=True)
        sheets=[(sh.title,list(sh.values)) for sh in w]
    for title, values in sheets:
        if not title.isdigit() or not 2006 <= int(title) <= 2025:continue
        for rn, row in enumerate(values,1):
            if not row or not row[0]:continue
            label=str(row[0]).strip(); key=names.get(norm(label))
            # Unknown regional/source labels are not silently assigned to a country.
            if key is None:
                if len(row)>1 and isinstance(row[1],(int,float)):checks.append({'unmapped':label,'year':title})
                continue
            if len(row)<19:continue
            if not isinstance(row[1],(int,float)) and str(row[1]).strip() not in ['(D)','(*)','D','*']:continue
            for sec in sectors:
                col=sec['column']; v=row[col]
                num=v*1_000_000 if isinstance(v,(int,float)) else None
                industry.append({'country':key,'origin':label,'year':int(title),'sector':sec['id'],
                  'amount':num,'sourceValue':v,'source':s['id'],
                  'locator':f'{title}!{openpyxl.utils.get_column_letter(col+1)}{rn}'})
sources += extra
write(OUT/'sources.json',extra)
out={'asOf':'2026-10-26','version':1,'series':dict(series),'sectors':sectors,'industry':industry,
     'thinktank':think,'domestic':domestic,'sources':sources,
     'notes':{'fara':'Gross indexed receipts; identical repeated records excluded; subcontract and period overlaps NOT consolidated; source classification, not audited political spending.',
              'universities':'Reported gifts by receipt year; contracts in full by start year; includes overseas-campus contracts; 2025 partial.',
              'ranking':'Descending disclosed amounts only, tied values share competition rank. No rank assigned to missing or suppressed cells. Regions and US excluded from foreign-country ranking.',
              'industry':'Selected countries, historical-cost UBO stocks; USD million converted to USD. D and * remain unknown; nine top-level industries only.'}}
write(OUT/'rankings.json',out)
with (OUT/'industry-cells.csv').open('w',encoding='utf-8-sig',newline='') as f:
    cw=csv.DictWriter(f,fieldnames=list(industry[0]));cw.writeheader();cw.writerows(industry)
with (OUT/'annual-aggregates.csv').open('w',encoding='utf-8-sig',newline='') as f:
    cw=csv.writer(f);cw.writerow(['measure','country','year','amount_usd','record_count','unknown_amount_count','possible_duplicate_count','source_ids'])
    for m,rr in series.items():
        for r in rr:cw.writerow([m,r['country'],r['year'],r['amount'],r['count'],r['unknown'],r['possibleDuplicates'],'|'.join(r['sources'])])

# Regression facts from primary BEA cells. No assumption that suppressed countries are zero.
eligible={c['id'] for c in countries if c['kind']!='source-category' and c['id']!='US'}
ranking=sorted([r for r in series['fdi-ubo-stock'] if r['year']==2025 and r['country'] in eligible and r['amount'] is not None],key=lambda r:-r['amount'])
assert [r['country'] for r in ranking[:3]]==['JP','CA','DE']
assert next(r['amount'] for r in ranking if r['country']=='IL')==22206000000
assert 1+sum(r['amount']>22206000000 for r in ranking)==29
assert next(r['amount'] for r in industry if r['country']=='IL' and r['year']==2025 and r['sector']=='manufacturing')==11047000000
assert len({(r['country'],r['year'],r['sector']) for r in industry})==len(industry)
audit={'asOf':out['asOf'],'aggregateRows':sum(map(len,series.values())),'industryCells':len(industry),
       'industrySuppressedOrUnavailable':sum(r['amount'] is None for r in industry),'unmappedIndustryLabels':checks,
       'primaryThinktankRecords':len(think),'domesticRecords':len(domestic),
       'checks':['Original industry file hashes match','Unique country/year/industry cells','BEA 2025 top three match','Israel 2025 UBO amount and disclosed rank match','Israel 2025 manufacturing matches source cell'],
       'failures':[]}
write(OUT/'audit.json',audit)
print(json.dumps(audit,ensure_ascii=False))
