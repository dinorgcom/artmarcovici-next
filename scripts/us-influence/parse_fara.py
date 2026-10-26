from pathlib import Path
import pymupdf, re, json, datetime, collections, hashlib
ROOT=Path(__file__).parent; RAW=ROOT/'raw'; OUT=ROOT/'parsed'; OUT.mkdir(exist_ok=True)
manifest={m['file']:m for m in json.loads((ROOT/'manifest.json').read_text())}
allrows=[];audit=[]
money=re.compile(r'\$\s*([\d,]+\.\d{2})\s+for\s+(?:the\s+)?six[ -]month\s+period\s+ending\s+([A-Z][a-z]+\s+\d{1,2},\s*\d{4})',re.I)
def compact(x):return re.sub(r'\s+',' ',x).strip()
for f in sorted(RAW.glob('fara-*.pdf')):
 cache=OUT/(f.stem+'.json')
 if cache.exists() and False:
  rows=json.loads(cache.read_text(encoding='utf-8'));allrows.extend(rows);print(f.name,len(rows),'cached',flush=True);continue
 doc=pymupdf.open(f);page_lines=[];report_year=int(f.stem.split('-')[1]);half=int(f.stem.split('-')[2]);country=None;country_entries=[];fulltext=[]
 for pnum,p in enumerate(doc):
  tx=p.get_text(sort=True)
  # Only the country-by-country section has a numbered Page n of m footer.
  if not re.search(r'Page\s+\d+\s*(?:of|Qf|0f)\s*\d+',tx,re.I):continue
  lines=[x.rstrip() for x in tx.strip().splitlines()]
  if not lines:continue
  c=lines[0].strip()
  if len(c)>85 or c!=c.upper() or c.startswith(('APPENDIX','TABLE','THE ')):continue
  if c!=country:
   country=c
  cleaned=[]
  for ln in lines[1:]:
   if 'Printed as of:' in ln or re.search(r'Page\s+\d+\s*(?:of|Qf|0f)\s*\d+',ln,re.I) or ln.strip()==c:continue
   cleaned.append(ln)
  country_entries.append((c,pnum+1,'\n'.join(cleaned)))
 # Concatenate same-country pages so entries split across page boundaries survive.
 groups=[]
 for c,pn,t in country_entries:
  if not groups or groups[-1][0]!=c:groups.append([c,[]])
  groups[-1][1].append((pn,t))
 rows=[];recognized_money=0;unparsed_money=0
 for c,pages in groups:
  text='';positions=[]
  for pn,tx in pages:positions.append((len(text),pn));text+=tx+'\n'
  def pageat(pos):return next((pn for at,pn in reversed(positions) if at<=pos),pages[0][0])
  entries=list(re.finditer(r'^(.+?)[^\S\n]{3,}#(\d{1,4})\b([^\n]*)$',text,re.M))
  for ei,e in enumerate(entries):
   end=entries[ei+1].start() if ei+1<len(entries) else len(text)
   entry=text[e.end():end];recipient=compact(e[1]);reg=e[2]
   natures=list(re.finditer(r'Nature of Services:\s*([^\n]+)',entry))
   for ni,n in enumerate(natures):
    prev=natures[ni-1].end() if ni else 0
    lead=entry[prev:n.start()]
    explicit=list(re.finditer(r'Foreign Principal:\s*([\s\S]+)',lead))
    if explicit:principal=compact(re.sub(r'[^\S\n]{4,}\d{1,3}\s*$', '', explicit[-1][1]));principalmode='explicit'
    else:
     codes=list(re.finditer(r'^([^\n]+?)\s{4,}\d{1,3}\s*$',lead,re.M))
     if codes:principal=compact(codes[-1][1]+' '+lead[codes[-1].end():]);principalmode='legacy-code'
     elif report_year in [2018,2019,2020]:
      cleanlead=re.sub(r'(?m)^\s*\((?:0|t)\)?\s*$', '', lead, flags=re.I)
      principal=compact(re.split(r'\n\s*\n',cleanlead.strip())[-1]);principalmode='unlabelled-principal'
     else:continue
    if len(principal)>700:continue
    principal=re.sub(r'\s*\(t\)\s*$','',principal,flags=re.I)
    block_end=natures[ni+1].start() if ni+1<len(natures) else len(entry)
    block=entry[n.end():block_end]
    # Stop at the next principal, not at the next nature-of-services line.
    block=re.split(r'Foreign Principal:|\n[^\n]+\s{4,}\d{1,3}\s*\n',block)[0]
    amt=list(money.finditer(block))
    for mi,m in enumerate(amt or [None]):
     val=float(m[1].replace(',','')) if m else None
     dt=None
     if m:
      try:dt=datetime.datetime.strptime(compact(m[2]),'%B %d, %Y').date().isoformat()
      except ValueError:pass
     if dt and not 2006<=int(dt[:4])<=2025:continue
     rowid=f'{f.stem}-p{pageat(e.start())}-r{reg}-{ei}-{ni}-{mi}'
     finance=compact(m[0]) if m else ('None Reported' if 'None Reported' in block else 'See source; period or amount not parsed')
     rows.append({'id':rowid,'origin':c,'recipient':recipient,'principal':principal,'registration':reg,'services':compact(n[1]),'amount':val,'periodEnd':dt,'periodMonths':6 if dt else None,'reportYear':report_year,'half':half,'source':f.stem,'page':pageat(e.start()),'amountPage':pageat(e.end()+n.end()+(m.start() if m else 0)),'finance':finance,'principalMode':principalmode,'excerpt':compact(block)[:2400],'review':'structured-extraction'})
     recognized_money+=bool(m)
  unparsed_money+=len(money.findall(text))
 cache.write_text(json.dumps(rows,ensure_ascii=False),encoding='utf-8');allrows.extend(rows)
 audit.append({'source':f.stem,'pages':len(doc),'parsedRows':len(rows),'sixMonthAmountsInSection':unparsed_money,'sixMonthAmountsExtracted':recognized_money})
 print(f.name,len(rows),recognized_money,'of',unparsed_money,flush=True)
# Mark duplicates across reports; do not silently sum them.
seen={};dups=0
for r in allrows:
 key=(r['origin'],r['registration'],r['principal'].lower(),r['amount'],r['periodEnd'])
 if r['amount'] is not None and r['periodEnd'] and key in seen:r['duplicateOf']=seen[key];dups+=1
 elif r['amount'] is not None:seen[key]=r['id']
(OUT/'fara.json').write_text(json.dumps(allrows,ensure_ascii=False),encoding='utf-8')
(OUT/'fara-audit.json').write_text(json.dumps({'reports':audit,'rows':len(allrows),'duplicateRows':dups},indent=2),encoding='utf-8')
print('DONE',len(allrows),'duplicates',dups,flush=True)
