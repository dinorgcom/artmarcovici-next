from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,hashlib,requests
R=Path(__file__).parent;raw=R/'raw';raw.mkdir(exist_ok=True);(R/'parsed').mkdir(exist_ok=True)
def fetch(m):
 p=raw/m['file']
 if p.exists() and hashlib.sha256(p.read_bytes()).hexdigest()==m['sha256']:return p.name+' cached'
 response=requests.get(m['url'],timeout=120,headers={'User-Agent':'BIEST research source archive/1.0'})
 response.raise_for_status();data=response.content
 if hashlib.sha256(data).hexdigest()!=m['sha256']:raise ValueError('Source changed: '+m['file']+'; review the new release before replacing the fixed corpus')
 p.write_bytes(data);return p.name+' saved'
if __name__=='__main__':
 with ThreadPoolExecutor(max_workers=4) as pool:
  for result in pool.map(fetch,json.loads((R/'corpus-manifest.json').read_text(encoding='utf-8'))):print(result,flush=True)
