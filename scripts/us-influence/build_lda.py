"""Reproducible House LD-1/LD-2 ingestion, amendment reconciliation and public extracts.
No cross-channel total, country allocation of US advocacy, or imputed cash payment.
Original ZIPs and a full local SQLite ledger stay outside the website repository.
"""
import argparse, collections, csv, datetime as dt, gzip, hashlib, json, re, sqlite3, unicodedata, zipfile
from pathlib import Path
import xml.etree.ElementTree as ET
import pycountry

ROOT=Path(__file__).resolve().parents[2]
p=argparse.ArgumentParser();p.add_argument('--raw',type=Path,required=True);p.add_argument('--ingest-only',action='store_true');args=p.parse_args()
OUT=ROOT/'public/us-influence/lda';OUT.mkdir(exist_ok=True)
DB=sqlite3.connect(args.raw/'ledger.sqlite');DB.execute('PRAGMA journal_mode=WAL');DB.execute('PRAGMA synchronous=NORMAL')
DB.executescript('''CREATE TABLE IF NOT EXISTS files(name TEXT PRIMARY KEY, records INTEGER, errors INTEGER);
CREATE TABLE IF NOT EXISTS docs(id TEXT PRIMARY KEY, archive TEXT, member TEXT, kind INTEGER, pair TEXT, year INTEGER, period TEXT, stamp TEXT, event TEXT, payload TEXT);
CREATE INDEX IF NOT EXISTS doc_pair ON docs(pair,year,period,stamp);
CREATE TABLE IF NOT EXISTS errors(archive TEXT, member TEXT, error TEXT);
CREATE TABLE IF NOT EXISTS repairs(archive TEXT, member TEXT, reason TEXT, PRIMARY KEY(archive,member));''')
norm=lambda x:re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',str(x)).encode('ascii','ignore').decode().lower())
dump=lambda x:json.dumps(x,ensure_ascii=False,separators=(',',':'))
def write(path,obj):
    path.parent.mkdir(exist_ok=True,parents=True)
    if path.parent.name in ['years','details'] or path.name=='summary.json':
        path.with_suffix('.json.gz').write_bytes(gzip.compress(dump(obj).encode('utf-8'),mtime=0))
        if path.exists():path.unlink()
    else:path.write_text(dump(obj),encoding='utf-8')
def text(e,path):return ' '.join((e.findtext(path) or '').split())
def stamp(s):
    for f in ['%m/%d/%Y %I:%M:%S %p','%m/%d/%Y','%Y-%m-%d','%m/%d/%Y %H:%M:%S']:
        try:return dt.datetime.strptime(s,f).isoformat()
        except ValueError:pass
    return ''
def period(t):
    if t.startswith('Q') and t[1:2] in '1234':return 'Q'+t[1]
    if t[:1] in '1234':return 'Q'+t[0]
    if t.startswith('M'):return 'H1'
    if t.startswith('Y'):return 'H2'
    return t
def end(y,q):return f'{y}-'+{'Q1':'03-31','Q2':'06-30','Q3':'09-30','Q4':'12-31','H1':'06-30','H2':'12-31'}.get(q,'12-31')
def number(s):
    if not s:return None
    try:return float(s.replace(',','').replace('$',''))
    except ValueError:return None
def entities(e,path):
    a=[]
    for x in e.findall(path):
        if not text(x,'name'):continue
        a.append({'name':text(x,'name'),'country':text(x,'country'),'principalCountry':text(x,'prinCountry'),'contributionRaw':text(x,'contribution'),'ownershipRaw':text(x,'ownership_Percentage')})
    return a
def parse(b,archive,member):
    repaired=False
    try:e=ET.fromstring(b)
    except ET.ParseError:
        def fix(m):
            v=int(m[1][1:],16) if m[1].lower().startswith(b'x') else int(m[1])
            return m[0] if v in [9,10,13] or 32<=v<=0xD7FF or 0xE000<=v<=0xFFFD or 0x10000<=v<=0x10FFFF else b'&#65533;'
        cleaned=re.sub(rb'&#(x[0-9a-fA-F]+|[0-9]+);',fix,b)
        e=ET.fromstring(cleaned);repaired=cleaned!=b
    kind=1 if e.tag=='LOBBYINGDISCLOSURE1' else 2 if e.tag=='LOBBYINGDISCLOSURE2' else 0
    if not kind:raise ValueError('Unrecognized XML root: '+e.tag)
    t=text(e,'reportType');y=int(text(e,'reportYear'));q=period(t);signed=stamp(text(e,'signedDate'))
    reg=text(e,'organizationName') or ' '.join(filter(None,[text(e,'firstName'),text(e,'lastName')]))
    client=text(e,'clientName');hid=text(e,'houseID');sid=text(e,'senateID')
    pair='house:'+re.sub('[^0-9]','',hid) if re.search('[1-9]',hid) else 'names:'+norm(reg)+'|'+norm(client)
    d={'id':Path(member).stem,'archive':archive,'member':member,'kind':kind,'pair':pair,'year':y,'period':q,'type':t,'signed':signed,'signedRaw':text(e,'signedDate'),'registrant':reg,'client':client,'houseId':hid,'senateId':sid,'registrantCountry':text(e,'country'),'selfBox':text(e,'selfSelect'),'incomeRaw':text(e,'income'),'expensesRaw':text(e,'expenses'),'method':text(e,'expensesMethod'),'noActivity':text(e,'noLobbying'),'terminationDate':text(e,'terminationDate')}
    d['xmlCharacterRepair']=repaired
    base='' if kind==1 else 'updates/'
    d.update({'clientCountry':text(e,base+'clientCountry'),'principalCountry':text(e,base+'prinClientCountry'),'entities':entities(e,base+'foreignEntities/foreignEntity'),'removedEntities':[x.text.strip() for x in e.findall('updates/inactive_ForeignEntities/inactive_ForeignEntity') if x.text and x.text.strip()]})
    if kind==1:
        d['effective']=stamp(text(e,'effectiveDate'))[:10]
        d['event']=d['effective'] or signed[:10] or f'{y}-12-31'
    else:
        d['event']=end(y,q)
        d['activities']=[{'code':text(x,'issueAreaCode'),'description':text(x,'specific_issues/description'),'agencies':text(x,'federal_agencies'),'foreignInterest':text(x,'foreign_entity_issues'),'lobbyists':sorted(set(' '.join(filter(None,[text(a,'lobbyistFirstName'),text(a,'lobbyistLastName'),text(a,'lobbyistSuffix')])) for a in x.findall('lobbyists/lobbyist') if text(a,'lobbyistLastName')))} for x in e.findall('alis/ali_info')]
    return d

done={x[0] for x in DB.execute('SELECT name FROM files')}
for f in sorted(args.raw.glob('LD-*.zip')):
    if f.name in done:continue
    count=errors=0;batch=[]
    with zipfile.ZipFile(f) as z:
        for member in z.namelist():
            if not member.lower().endswith('.xml'):continue
            try:
                d=parse(z.read(member),f.name,member);count+=1
                if d['xmlCharacterRepair']:DB.execute('INSERT OR REPLACE INTO repairs VALUES(?,?,?)',(f.name,member,'Invalid XML numeric character reference replaced with U+FFFD; original ZIP unchanged.'))
                batch.append((d['id'],f.name,member,d['kind'],d['pair'],d['year'],d['period'],d['signed'],d['event'],dump(d)))
                if len(batch)>=500:DB.executemany('INSERT OR REPLACE INTO docs VALUES(?,?,?,?,?,?,?,?,?,?)',batch);batch=[]
            except Exception as exc:
                errors+=1;DB.execute('INSERT INTO errors VALUES(?,?,?)',(f.name,member,str(exc)))
    if batch:DB.executemany('INSERT OR REPLACE INTO docs VALUES(?,?,?,?,?,?,?,?,?,?)',batch)
    DB.execute('INSERT INTO files VALUES(?,?,?)',(f.name,count,errors));DB.commit()
    print(dump({'ingested':f.name,'records':count,'errors':errors}),flush=True)
# Retry only known failures after parser improvements; do not rescan successful XMLs.
for archive,member,error in list(DB.execute('SELECT * FROM errors')):
    try:
        with zipfile.ZipFile(args.raw/archive) as z:d=parse(z.read(member),archive,member)
        DB.execute('INSERT OR REPLACE INTO docs VALUES(?,?,?,?,?,?,?,?,?,?)',(d['id'],archive,member,d['kind'],d['pair'],d['year'],d['period'],d['signed'],d['event'],dump(d)))
        DB.execute('DELETE FROM errors WHERE archive=? AND member=?',(archive,member))
        DB.execute('UPDATE files SET records=records+1,errors=errors-1 WHERE name=?',(archive,))
        if d['xmlCharacterRepair']:DB.execute('INSERT OR REPLACE INTO repairs VALUES(?,?,?)',(archive,member,'Invalid XML numeric character reference replaced with U+FFFD; original ZIP unchanged.'))
    except Exception:pass
DB.commit()
if args.ingest_only:raise SystemExit()

# Keep the last signed version per registrant-client / reporting period; preserve every
# version in the ledger. Equal timestamps use the numeric document ID as a tie-breaker.
DB.executescript('''DROP TABLE IF EXISTS selected;
CREATE TABLE selected AS SELECT * FROM (SELECT docs.*, ROW_NUMBER() OVER(PARTITION BY pair,year,period ORDER BY stamp DESC,CAST(id AS INTEGER) DESC) AS rn FROM docs WHERE kind=2 AND year BETWEEN 2006 AND 2025) WHERE rn=1;
CREATE INDEX sel_pair ON selected(pair,event);
''')
DB.commit()
manifest=json.loads((args.raw/'download-manifest.json').read_text(encoding='utf-8'))
sources=[];sourceIds={}
for s in manifest:
    if 'error' in s:continue
    sourceId='lda-house-'+s['kind'].lower()+'-'+Path(s['file']).stem.lower();sourceIds[s['local']]=sourceId
    sources.append({'id':sourceId,'title':'House LDA · '+s['name'],'kind':'government-data','url':s['url'],'retrieved':s['retrieved'],'sha256':s['sha256'],'coverage':s['name']+'; archive availability is not completeness of reporting.','file':s['local'],'entries':s['entries'],'bytes':s['bytes']})
country_list=json.loads((ROOT/'public/us-influence/data/countries.json').read_text(encoding='utf-8'))
country_ids={x['id'] for x in country_list}
country_map={norm(n):c['id'] for c in country_list for n in [c['id'],c['name'],*c['aliases']]}
for c in pycountry.countries:country_map[norm(c.alpha_3)]=c.alpha_2
# Only clear historical spelling variants, retained alongside the normalized code.
country_map.update({'uk':'GB','uae':'AE','republicofkorea':'KR'})
code_review=json.loads((OUT/'country-code-map.json').read_text(encoding='utf-8'))
for row in code_review['aliases']:
    assert row['country'] in country_ids
    country_map[norm(row['raw'])]=row['country']
for row in code_review['withheld']:country_map[norm(row['raw'])]=None
unmapped=collections.Counter()
def country(v):
    if not v:return None
    c=country_map.get(norm(v))
    if not c:unmapped[v]+=1
    return c
yearstats={y:collections.Counter() for y in range(2006,2026)}
for y,n in DB.execute('SELECT year,COUNT(*) FROM docs WHERE kind=2 GROUP BY year'):
    if y in yearstats:yearstats[y]['rawReports']=n
groups={};orggroups={};relations={};orgnames={};details=collections.defaultdict(list);originrecords=collections.Counter();issues=collections.Counter();selectedCount=0
def aggregate(container,key,d):
    if key not in container:container[key]={'amount':0,'numeric':0,'unknown':0,'reports':0,'methods':set(),'issues':set(),'ids':[],'sources':set(),'periods':set()}
    g=container[key];g['reports']+=1;g['ids'].append(d['id']);g['sources'].add(d['source']);g['periods'].add(d['period'])
    if d['amount'] is None:g['unknown']+=1
    else:g['amount']+=d['amount'];g['numeric']+=1
    if d['method']:g['methods'].add(d['method'])
    for a in d['activities']:g['issues'].add(a['code'])

query='''SELECT payload FROM (SELECT pair,event,stamp,payload,kind,id FROM docs WHERE kind=1 UNION ALL SELECT pair,event,stamp,payload,kind,id FROM selected) ORDER BY pair,event,kind,stamp,CAST(id AS INTEGER)'''
current=None;state={};seenVersions={}
for (payload,) in DB.execute(query):
    d=json.loads(payload)
    if d['pair']!=current:current=d['pair'];state={'entities':{},'address':None,'principal':None}
    # A registration effective after this reporting period is never applied backwards.
    for fld,key in [('clientCountry','address'),('principalCountry','principal')]:
        if d[fld]:state[key]={'raw':d[fld],'country':country(d[fld]),'id':d['id'],'source':sourceIds[d['archive']],'date':d['event'],'member':d['member']}
    for ent in d['entities']:
        state['entities'][norm(ent['name'])]={**ent,'origin':country(ent['principalCountry'] or ent['country']),'evidenceId':d['id'],'source':sourceIds[d['archive']],'member':d['member'],'date':d['event']}
    for n in d['removedEntities']:state['entities'].pop(norm(n),None)
    if d['kind']==1:continue
    selectedCount+=1;y=d['year'];ys=yearstats[y];ys['selectedReports']+=1
    d['source']=sourceIds[d['archive']]
    self_report=d['selfBox']=='Y' or (norm(d['registrant'])==norm(d['client']) and bool(norm(d['client'])))
    d['reportingScope']='self' if self_report else 'agency'
    income=number(d['incomeRaw']);expense=number(d['expensesRaw'])
    d['amount']=expense if expense is not None else income
    d['amountField']='expenses' if expense is not None else 'income' if income is not None else None
    d['amountConflict']=income is not None and expense is not None
    if d['amountConflict']:d['amount']=None;ys['amountConflicts']+=1
    d['selfInIncomeField']=self_report and income is not None and expense is None
    if d['selfInIncomeField']:ys['selfInIncomeField']+=1
    if d['amount'] is None:ys['unknownAmounts']+=1
    cc=state['principal'] or state['address']
    if self_report and d['registrantCountry']:
        cc={'raw':d['registrantCountry'],'country':country(d['registrantCountry']),'id':d['id'],'source':d['source'],'date':d['event'],'member':d['member']}
        d['countryBasis']='registrant-self'
    else:d['countryBasis']='client-principal' if state['principal'] else 'client-address' if state['address'] else 'unknown'
    d['country']=cc['country'] if cc else None;d['countryEvidence']=cc
    d['clientAddressEvidence']=state['address'];d['clientPrincipalEvidence']=state['principal']
    d['foreignEntities']=list(state['entities'].values())
    if not d['country']:ys['unassignedClientCountry']+=1
    elif d['country']=='US':ys['usClientCountry']+=1
    else:ys['foreignClientCountry']+=1
    # Relational links are not ownership-weighted expense estimates or state funding.
    linked=set(e['origin'] for e in d['foreignEntities'] if e['origin'] and e['origin']!='US')
    d['linkedCountries']=sorted(linked)
    for c in linked:
        key=(c,y)
        if key not in relations:relations[key]={'reports':0,'pairs':set(),'entities':set()}
        relations[key]['reports']+=1;relations[key]['pairs'].add(d['pair']);relations[key]['entities'].update(e['name'] for e in d['foreignEntities'] if e['origin']==c)
    isforeign=d['country'] and d['country']!='US'
    if isforeign:aggregate(groups,(d['reportingScope'],d['country'],y,d['method']),d)
    if self_report:
        orgkey=d['pair'];orgnames[orgkey]=d['client'] or d['registrant'];aggregate(orggroups,(orgkey,d['country'],y,d['method']),d)
    # Public detail records include every source row used by a country/org comparison
    # and every reconstructed foreign-entity relation. Unassigned agency rows remain
    # in the local full ledger and the coverage counts, not invented country totals.
    if isforeign or self_report or linked:
        shard=hashlib.sha256(d['id'].encode()).hexdigest()[:2]
        details[shard].append(d)
        for c in linked|({d['country']} if d['country'] else set()):originrecords[c]+=1
        if d['country']=='US' and self_report:ys['usSelfReports']+=1

def final(g):
    return {**{k:v for k,v in g.items() if k not in ['amount','numeric','methods','issues','sources','periods']},'amount':round(g['amount'],2) if g['numeric'] else None,'methods':sorted(g['methods']),'issues':sorted(g['issues']),'sources':sorted(g['sources']),'periods':sorted(g['periods'])}
countryseries=[{'scope':scope,'country':c,'year':y,'method':m,**final(g)} for (scope,c,y,m),g in groups.items()]
orgseries=[{'org':k,'country':c,'year':y,'method':m,**final(g)} for (k,c,y,m),g in orggroups.items()]
relationseries=[{'country':c,'year':y,'reports':g['reports'],'mandates':len(g['pairs']),'entities':len(g['entities'])} for (c,y),g in relations.items()]
index_by_year={y:[] for y in range(2006,2026)}
for shard,rr in details.items():
    write(OUT/'details'/f'{shard}.json',rr)
    for d in rr:
        index_by_year[d['year']].append({k:d[k] for k in ['id','country','linkedCountries','year','period','registrant','client','reportingScope','amount','source','pair','method']})
for y,rr in index_by_year.items():write(OUT/'years'/f'{y}.json',rr)
for y in yearstats:yearstats[y]['supersededReports']=yearstats[y]['rawReports']-yearstats[y]['selectedReports']
audit={'retrieved':'2026-10-26','archiveCount':len(sources),'ldArchives':DB.execute('SELECT COUNT(*) FROM files').fetchone()[0],'rawDocuments':DB.execute('SELECT COUNT(*) FROM docs').fetchone()[0],'registrations':DB.execute('SELECT COUNT(*) FROM docs WHERE kind=1').fetchone()[0],'selectedReports':selectedCount,'publicDetailReports':sum(map(len,details.values())),'parseErrors':[dict(zip(['archive','member','error'],x)) for x in DB.execute('SELECT * FROM errors')],'xmlCharacterRepairs':[dict(zip(['archive','member','reason'],x)) for x in DB.execute('SELECT * FROM repairs')],'unmappedCountryLabels':dict(unmapped),'years':[{'year':y,**dict(s),'coverage':'sparse-legacy' if y<2013 else 'broad-archive-not-certified-complete'} for y,s in yearstats.items()]}
summary={'meta':audit,'countries':countryseries,'organizations':orgseries,'organizationNames':orgnames,'relations':relationseries,'countryCounts':dict(originrecords),'sources':sources,'notes':{'attribution':'Principal place of business, then declared client address; exact self-report uses registrant country. Earlier available registrations and explicit updates only; no future backfill.','amendments':'Latest signed report per House registrant-client ID, year and quarter/half-year. Original and replaced versions retained in local ledger.','amounts':'Self reports and agency receipts are separate overlapping views. Null is not zero. Estimates, not verified cash payments.','relations':'Disclosed foreign entities are separate links. No whole-budget or ownership-percentage allocation to their countries.','earlyYears':'House XML archive is sparse before 2013; early values are available records, not a comparable time series or country ranking.'}}
write(OUT/'summary.json',summary);write(OUT/'audit.json',audit);write(OUT/'sources.json',sources)
write(OUT/'catalog.json',{'countryCounts':dict(originrecords),'sources':sources})
with (OUT/'country-annual.csv').open('w',encoding='utf-8-sig',newline='') as f:
    cols=['scope','country','year','amount','reports','unknown','methods','periods','sources'];w=csv.DictWriter(f,fieldnames=cols);w.writeheader()
    for r in countryseries:w.writerow({k:'|'.join(r[k]) if isinstance(r[k],list) else r[k] for k in cols})
with (OUT/'organization-annual.csv').open('w',encoding='utf-8-sig',newline='') as f:
    cols=['org','name','country','year','amount','reports','unknown','methods','periods'];w=csv.DictWriter(f,fieldnames=cols);w.writeheader()
    for r in orgseries:w.writerow({k:orgnames[r['org']] if k=='name' else '|'.join(r[k]) if isinstance(r[k],list) else r[k] for k in cols})
write(OUT/'relations-annual.json',relationseries)
print(dump({k:v for k,v in audit.items() if k not in ['years','parseErrors']}),flush=True)
DB.close()
