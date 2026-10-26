"""Download official House LDA XML archives without relying on the blocked Senate API.
The index is published by the House and lists the exact files; no guessed URLs.
"""
import argparse, concurrent.futures, hashlib, json, time, zipfile
from pathlib import Path
import requests

BASE = 'https://disclosurespreview.house.gov/'
p = argparse.ArgumentParser()
p.add_argument('--raw', type=Path, required=True)
p.add_argument('--contributions', action='store_true')
args = p.parse_args()
args.raw.mkdir(parents=True, exist_ok=True)
jobs = []
for kind, index in [('LD','LdSearchPastFilings')] + ([('LC','LcSearchPastFilings')] if args.contributions else []):
    response = requests.get(f'{BASE}data/{kind}/{index}.json', timeout=60)
    response.raise_for_status()
    (args.raw / f'{kind}-index.json').write_bytes(response.content)
    for item in response.json():
        year = int(item['file'][:4])
        if 2006 <= year <= 2025 or (kind == 'LD' and year < 2006 and 'Registrations' in item['file']):
            jobs.append({**item, 'kind':kind, 'url':f'{BASE}data/{kind}/'+item['file']})

def download(item):
    target = args.raw / (item['kind']+'-'+item['file'])
    for attempt in range(3):
        try:
            if not target.exists():
                with requests.get(item['url'], stream=True, timeout=(30,120)) as r:
                    r.raise_for_status()
                    with target.with_suffix('.part').open('wb') as f:
                        for chunk in r.iter_content(1024*1024): f.write(chunk)
                target.with_suffix('.part').replace(target)
            with zipfile.ZipFile(target) as z:
                count = len(z.infolist())
                size = sum(x.file_size for x in z.infolist())
            h = hashlib.file_digest(target.open('rb'),'sha256').hexdigest()
            result={**item,'local':target.name,'bytes':target.stat().st_size,'uncompressedBytes':size,'entries':count,'sha256':h,'retrieved':'2026-10-26'}
            print(json.dumps({'file':target.name,'entries':count,'bytes':target.stat().st_size}),flush=True)
            return result
        except Exception as e:
            if attempt == 2: return {**item,'error':str(e)}
            time.sleep(2*(attempt+1))

results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for result in pool.map(download,jobs):
        results.append(result)
        (args.raw/'download-manifest.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'files':len(results),'errors':[x for x in results if 'error' in x],'bytes':sum(x.get('bytes',0) for x in results)}),flush=True)
