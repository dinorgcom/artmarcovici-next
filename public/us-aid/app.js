(() => {
'use strict';
const $=id=>document.getElementById(id),L=(de,en)=>window.BIEST_LANG==='en'?en:de;
const locale=window.BIEST_LOCALE||'de-AT',display=new Intl.DisplayNames([locale],{type:'region'});
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(n);
const usd=n=>n==null?L('unbekannt','unknown'):num(n)+' $';
const compact=n=>n==null?L('unbekannt','unknown'):new Intl.NumberFormat(locale,{notation:'compact',maximumFractionDigits:2}).format(n)+' $';
const norm=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const option=(v,t)=>'<option value="'+esc(v)+'">'+esc(t)+'</option>';
const objName=o=>({All:L('Gesamte erfasste Hilfe','All reported assistance'),Military:L('Militärhilfe','Military assistance'),Economic:L('Wirtschaftliche Hilfe','Economic assistance')}[o]||o);
const transName=t=>t==='Disbursements'?L('Auszahlungen','Disbursements'):L('Verpflichtungen','Obligations');
let data,cmap,countries,shown=25,rankRows=[],cache=new Map(),sequence=0,exportUrl;
const name=id=>{const c=cmap.get(id);return c?.iso2?display.of(c.iso2)||c.name:c?.name||id;};
const yrs=()=>Array.from({length:20},(_,i)=>2025-i).map(y=>option(y,y)).join('');
const span=(a,b)=>a===b?'FY '+b:'FY '+a+'–'+b;
function selection(){const to=+$('aid-to').value,from=Math.min(+$('aid-from').value,to);$('aid-from').value=String(from);return {from,to,transaction:$('aid-transaction').value,objective:$('aid-objective').value};}
function matches(r,s){return r.year>=s.from&&r.year<=s.to&&r.transaction===s.transaction&&(s.objective==='All'||r.objective===s.objective);}
function aggregate(s){
 const gs=new Map();
 for(const r of data.annual){if(!matches(r,s))continue;let g=gs.get(r.country);if(!g){g={country:r.country,amount:null,count:0,years:new Set()};gs.set(r.country,g);}if(r.amount!=null)g.amount=(g.amount??0)+r.amount;g.count+=r.count;g.years.add(r.year);}
 return gs;
}
function ranked(gs){
 const rr=countries.map(c=>gs.get(c.id)).filter(r=>r?.amount!=null).sort((a,b)=>b.amount-a.amount||name(a.country).localeCompare(name(b.country),locale));let rank=0,previous=null;rr.forEach((r,i)=>{if(r.amount!==previous)rank=i+1;r.rank=rank;previous=r.amount;});return rr;
}
function sum(rr){const numeric=rr.filter(r=>r.amount!=null);return numeric.length?numeric.reduce((a,r)=>a+r.amount,0):null;}
function renderOverview(){
 const views=[['Military','Disbursements'],['Military','Obligations'],['Economic','Disbursements'],['Economic','Obligations']];
 $('aid-overview').innerHTML=views.map(([o,t])=>{
  const rr=ranked(aggregate({from:2025,to:2025,objective:o,transaction:t}));
  return '<button class="leader-card" data-aid-view="'+o+'|'+t+'"><span class="small-label">FY 2025 · '+transName(t)+'</span><h3>'+objName(o)+'</h3><ol>'+rr.slice(0,3).map(r=>'<li><span>'+esc(name(r.country))+'</span><b>'+compact(r.amount)+'</b></li>').join('')+'</ol><span class="leader-footer">'+L('Rangliste öffnen','Open ranking')+' ↗</span><small>'+L('Veröffentlichter Stand · nachmeldbar','Published release · subject to updates')+'</small></button>';
 }).join('');
}
function tableRow(r,max,s){return '<tr class="'+(r.country===$('aid-country').value?'focus-row':'')+'"><td>'+r.rank+'</td><td><button class="text-button" data-aid-country="'+esc(r.country)+'">'+esc(name(r.country))+'</button><div class="rank-track"><span class="'+(r.amount<0?'negative':'')+'" style="width:'+(Math.abs(r.amount)/max*100)+'%"></span></div></td><td class="numeric">'+usd(r.amount)+'</td><td>'+r.years.size+' / '+(s.to-s.from+1)+'</td></tr>';}
function render(){
 const s=selection(),gs=aggregate(s),rr=ranked(gs),regional=[...gs.values()].filter(r=>!countries.some(c=>c.id===r.country)).sort((a,b)=>(b.amount??-Infinity)-(a.amount??-Infinity));
 const q=norm($('aid-query').value),match=id=>norm(name(id)+' '+id+' '+(cmap.get(id)?.name||'')).includes(q);
 rankRows=rr;const visible=rr.filter(r=>match(r.country)),missing=countries.filter(c=>!gs.has(c.id)||gs.get(c.id).amount==null).filter(c=>match(c.id));
 const total=sum([...gs.values()]),known=sum(rr),unallocated=sum(regional),max=Math.max(1,...rr.map(r=>Math.abs(r.amount)));
 $('aid-summary').innerHTML=[[L('Alle Zuordnungen','All attributions'),total,L('Länder, Gebiete und nicht enger zugeordnete Programme','Countries, territories and geographically unallocated programs')],[L('Ländern / Gebieten zugeordnet','Assigned to countries / territories'),known,L('Grundlage der folgenden Rangliste','Basis of the ranking below')],[L('Weitere Quellenkategorien','Other source categories'),unallocated,L('Regionale, globale und historische Zuordnungen separat','Regional, global and historical attributions kept separate')]].map(([t,v,n])=>'<div><span class="small-label">'+t+'</span><strong>'+compact(v)+'</strong><p>'+n+'</p></div>').join('');
 $('aid-selection-note').textContent=transName(s.transaction)+' · '+objName(s.objective)+' · '+span(s.from,s.to)+'. '+(s.transaction==='Obligations'?L('Rechtlich gebundene Mittel; kein Nachweis einer Auszahlung im selben Jahr.','Legally committed funds; not evidence of disbursement in the same year.'):L('Gemeldete Mittelabflüsse; können frühere Verpflichtungen erfüllen.','Reported outlays; may settle earlier obligations.'))+' '+L('Negative Berichtigungen sind enthalten. Fehlende Werte bleiben unbekannt.','Negative corrections are included. Missing values remain unknown.');
 $('aid-coverage').textContent=rr.length+' / '+countries.length+' '+L('Länder und gesondert geführte Gebiete mit Betrag in dieser Auswahl. Rang absteigend unter diesen Angaben, Gleichstände teilen einen Rang. Die Suche verändert den Rang nicht.','countries and separately listed territories have an amount in this selection. Descending rank among those values; ties share a rank. Search does not change ranks.');
 $('aid-table').innerHTML=visible.slice(0,shown).map(r=>tableRow(r,max,s)).join('')||'<tr><td colspan="4">'+L('Keine bezifferten Angaben.','No numeric records.')+'</td></tr>';
 $('aid-more').hidden=visible.length<=shown;
 $('aid-missing').innerHTML='<summary>'+missing.length+' '+L('Länder / Gebiete ohne Angabe','countries / territories without records')+'</summary><p>'+L('Keine gemeldete Zeile in dieser Auswahl bedeutet hier nicht null.','No reported row in this selection does not mean zero.')+'</p><div class="missing-grid">'+missing.map(c=>'<button class="text-button" data-aid-country="'+esc(c.id)+'">'+esc(name(c.id))+'</button>').join('')+'</div>';
 $('aid-regions').innerHTML='<summary>'+L('Regionen, globale Programme und historische Kategorien','Regions, global programs and historical categories')+' · '+regional.length+'</summary><p class="mini">'+L('Nicht zu heutigen Ländern umverteilt. „World“ ist eine eigene Zuordnung und kein erneut zu addierendes Gesamttotal.','Not reallocated to modern countries. World is an attribution, not another grand total to add.')+'</p><div class="table-scroll"><table class="ranking-table"><tbody>'+regional.map(r=>'<tr><td><button class="text-button" data-aid-country="'+esc(r.country)+'">'+esc(name(r.country))+'</button></td><td class="numeric">'+usd(r.amount)+'</td></tr>').join('')+'</tbody></table></div>';
 $('aid-export-status').textContent='';renderProfile();
}
function annualChart(id,transaction){
 const vals=Array.from({length:20},(_,i)=>{const y=2006+i;return {year:y,economic:sum(data.annual.filter(r=>r.country===id&&r.year===y&&r.transaction===transaction&&r.objective==='Economic')),military:sum(data.annual.filter(r=>r.country===id&&r.year===y&&r.transaction===transaction&&r.objective==='Military'))};});
 const all=vals.flatMap(v=>[v.economic,v.military]).filter(x=>x!=null),max=Math.max(0,...all),min=Math.min(0,...all),scale=max-min||1,base=190-(0-min)/scale*165;
 const bars=vals.map((v,i)=>['economic','military'].map((key,j)=>{const x=24+i*36+j*13,n=v[key];if(n==null)return '<line x1="'+x+'" x2="'+(x+10)+'" y1="'+base+'" y2="'+base+'" stroke="#9b9d92" stroke-dasharray="2 2"><title>'+v.year+': '+L('unbekannt','unknown')+'</title></line>';const y=190-(n-min)/scale*165;return '<rect x="'+x+'" y="'+Math.min(base,y)+'" width="10" height="'+Math.max(1,Math.abs(base-y))+'" class="aid-'+key+'"><title>'+v.year+' · '+objName(key==='economic'?'Economic':'Military')+': '+usd(n)+'</title></rect>';}).join('')).join('');
 return '<div class="aid-profile-chart"><p class="aid-period-caption">'+transName(transaction)+' · FY 2006–2025 · '+L('nominale USD; gemeinsame Skala','nominal USD; common scale')+'</p><div class="aid-legend"><span>'+objName('Economic')+'</span><span>'+objName('Military')+'</span></div><svg viewBox="0 0 770 230" role="img" aria-label="'+esc(name(id)+' · '+transName(transaction)+' · 2006–2025')+'"><text x="22" y="17">'+compact(max)+'</text><line x1="20" x2="750" y1="'+base+'" y2="'+base+'" stroke="#a2aa9a"/>'+bars+'<text x="24" y="215">2006</text><text x="345" y="215">2015</text><text x="705" y="215">2025</text></svg><p class="mini">'+L('Gestrichelte Markierung: keine Angabe, nicht null. Beide Reihen verwenden dieselbe Skala.','Dashed marker: no record, not zero. Both series use the same scale.')+'</p><details class="aid-annual-table"><summary>'+L('Alle Jahreswerte lesen','Read all annual values')+'</summary><div class="table-scroll"><table class="ranking-table"><thead><tr><th>FY</th><th>'+objName('Economic')+'</th><th>'+objName('Military')+'</th></tr></thead><tbody>'+vals.map(v=>'<tr><td>'+v.year+'</td><td class="numeric">'+usd(v.economic)+'</td><td class="numeric">'+usd(v.military)+'</td></tr>').join('')+'</tbody></table></div></details></div>';
}
function breakdown(rows,s,key){
 const g=new Map();for(const r of rows){if(!matches(r,s))continue;const label=r[key]||L('Nicht zugeordnet','Unspecified');if(r.amount!=null)g.set(label,(g.get(label)||0)+r.amount);}
 return [...g].sort((a,b)=>b[1]-a[1]);
}
function detailTable(rows){return '<div class="table-scroll"><table class="ranking-table"><tbody>'+rows.map(([n,v])=>'<tr><td>'+esc(n)+'</td><td class="numeric">'+usd(v)+'</td></tr>').join('')+'</tbody></table></div>';}
async function renderProfile(){
 const id=$('aid-country').value,s=selection(),seq=++sequence;if(!id)return;
 const c=cmap.get(id),r=rankRows.find(r=>r.country===id);
 $('aid-country-title').textContent=name(id);
 const u=new URL(location.href);u.searchParams.set('country',id);history.replaceState(null,'',u);
 const stats=['All','Economic','Military'].map(o=>{const all=ranked(aggregate({...s,objective:o})),x=aggregate({...s,objective:o}).get(id),rank=all.find(v=>v.country===id)?.rank;return '<div><span class="small-label">'+objName(o)+'</span><strong>'+compact(x?.amount)+'</strong><p>'+(rank?L('Rang ','Rank ')+rank+' / '+all.length:L('Kein Länderrang','No country rank'))+'</p></div>';}).join('');
 $('aid-country-content').innerHTML='<p class="aid-period-caption">'+transName(s.transaction)+' · '+span(s.from,s.to)+'</p><div class="aid-country-stats">'+stats+'</div><p class="aid-scope-note">'+L('Begünstigtes Land / Gebiet, nicht zwingend der direkte Zahlungsempfänger. Die drei Kennzahlen zeigen das erfasste Gesamtvolumen und seine Kategorien; sie werden nicht zusammenaddiert.','Beneficiary country / territory, not necessarily the direct payee. The three figures show the reported total and its categories; they are not added together.')+'</p>'+annualChart(id,s.transaction)+'<div id="aid-profile-more"><p>'+L('Programme werden geladen …','Loading programs …')+'</p></div>';
 try{
  if(!cache.has(id)){const res=await fetch('/us-aid/data/'+encodeURIComponent(id)+'.json');if(!res.ok)throw Error(res.status);cache.set(id,await res.json());}
  if(seq!==sequence)return;const detail=cache.get(id),sectors=breakdown(detail.sectors,s,'sector'),accounts=breakdown(detail.accounts,s,'account');
  const examples=detail.examples.filter(e=>matches(e,s)).sort((a,b)=>b.amount-a.amount).slice(0,4);
  $('aid-profile-more').innerHTML=(sectors.length?'<p class="aid-period-caption">'+objName(s.objective)+' · '+span(s.from,s.to)+'</p><div class="aid-profile-details"><div><h3>'+L('Programme / USG-Sektoren','Programs / USG sectors')+'</h3>'+detailTable(sectors)+'</div><div><h3>'+L('Finanzierungstitel','Funding accounts')+'</h3>'+detailTable(accounts)+'</div></div><p class="mini">'+L('Zwei Ansichten derselben Mittel. Originalbezeichnungen bleiben erhalten. Auswertung des vollständigen Datensatzes mit Länder-, Jahres-, Transaktions- und Kategorienfilter.','Two views of the same funds. Original labels retained. Derived from the complete dataset using country, year, transaction and objective filters.')+'</p>':'<p class="aid-empty">'+L('Keine Programme mit Zahlenwert für diese Auswahl.','No numeric program records for this selection.')+'</p>')+'<div class="aid-examples"><h3>'+L('Von der Summe zur Originalzeile','From the aggregate to an original record')+'</h3><p class="mini">'+L('Bis zu vier Beispiele: die größten Originalzeilen aus den Jahres-/Kategoriegruppen der Auswahl. Keine vollständige Empfänger- oder Transaktionsliste; eine Zeile ist kein vollständiges Projektbudget.','Up to four examples: the largest original records from the selected year/objective groups. Not a full payee or transaction list; one record is not an entire project budget.')+'</p><div class="aid-example-list">'+examples.map(e=>'<article><span class="small-label">FY '+e.year+' · '+objName(e.objective)+' · '+transName(e.transaction)+'</span><h4>'+esc(e.activity||L('Aktivität unbenannt','Activity unnamed'))+'</h4><strong>'+usd(e.amount)+'</strong><dl><dt>'+L('US-Behörde','US agency')+'</dt><dd>'+esc(e.agency||L('unbekannt','unknown'))+'</dd><dt>'+L('Umsetzung','Implementer')+'</dt><dd>'+esc(e.implementer||L('unbekannt','unknown'))+'</dd><dt>'+L('Titel','Account')+'</dt><dd>'+esc(e.account||L('unbekannt','unknown'))+'</dd><dt>'+L('Datum','Date')+'</dt><dd>'+esc(e.date||L('unbekannt','unknown'))+'</dd><dt>Activity ID</dt><dd>'+esc(e.activityId||L('unbekannt','unknown'))+'</dd></dl><p class="mini">'+esc(e.locator)+'</p><a href="https://foreignassistance.gov/static/us_foreign_aid_complete.csv" target="_blank" rel="noopener">'+L('Original-CSV (3,76 GB)','Original CSV (3.76 GB)')+' ↗</a></article>').join('')+'</div></div>'+(c.iso2?'<p><a href="/us-influence?lang='+L('de','en')+'&country='+esc(c.iso2)+'&focus='+esc(c.iso2)+'#rankings">'+L('Andere Richtung: Finanzierung aus diesem Land in den USA','Other direction: financing from this country into the USA')+' →</a></p>':'')+(r?'<p class="mini">'+num(r.count)+' '+L('Originalzeilen im gewählten Ranglistenwert.','original records in the selected ranking value.')+'</p>':'');
 }catch(e){if(seq===sequence)$('aid-profile-more').innerHTML='<p class="aid-empty">'+L('Programmdetails konnten nicht geladen werden. Bitte neu laden.','Program details could not load. Please reload.')+' '+esc(e.message)+'</p>';}
}
function exportCsv(){
 const s=selection(),cell=x=>'"'+String(x??'').replace(/"/g,'""')+'"';
 const csv=[['rank','country','name','transaction','objective','fiscal_year_from','fiscal_year_to','nominal_usd','source_rows','years_with_records'],...rankRows.map(r=>[r.rank,r.country,name(r.country),s.transaction,s.objective,s.from,s.to,r.amount,r.count,r.years.size])].map(r=>r.map(cell).join(',')).join('\r\n');
 if(exportUrl)URL.revokeObjectURL(exportUrl);exportUrl=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
 $('aid-export-status').innerHTML='<a href="'+exportUrl+'" download="BIEST-US-aid-'+s.transaction+'-'+s.objective+'-'+s.from+'-'+s.to+'.csv">'+L('CSV herunterladen','Download CSV')+' ↓</a>';
}
async function init(){
 try{
  const [d,audit]=await Promise.all(['/us-aid/data/summary.json','/us-aid/data/audit.json'].map(async url=>{const r=await fetch(url);if(!r.ok)throw Error(r.status);return r.json();}));data=d;
  cmap=new Map(data.countries.map(c=>[c.id,c]));countries=data.countries.filter(c=>c.kind!=='source-category'&&c.id!=='USA');
  $('aid-controls').innerHTML='<label>'+L('Messgröße','Measure')+'<select id="aid-transaction">'+option('Disbursements',transName('Disbursements'))+option('Obligations',transName('Obligations'))+'</select></label><label>'+L('Art der Hilfe','Assistance category')+'<select id="aid-objective">'+['All','Military','Economic'].map(o=>option(o,objName(o))).join('')+'</select></label><label>'+L('Von Haushaltsjahr','From fiscal year')+'<select id="aid-from">'+yrs()+'</select></label><label>'+L('Bis Haushaltsjahr','To fiscal year')+'<select id="aid-to">'+yrs()+'</select></label>';
  $('aid-country').innerHTML=data.countries.slice().sort((a,b)=>name(a.id).localeCompare(name(b.id),locale)).map(c=>option(c.id,name(c.id))).join('');
  const requested=new URLSearchParams(location.search).get('country');$('aid-country').value=cmap.has(requested)?requested:'ISR';
  $('aid-audit-text').textContent=num(data.meta.selectedRows)+' '+L('Originalzeilen für 2006–2025 aus ','original records for 2006–2025 out of ')+num(data.meta.inputRows)+' '+L('Zeilen insgesamt. ','total records. ')+num(audit.independentCountrySummaryComparisons)+' '+L('Länder-Jahres-Transaktionssummen gegen die unabhängige Country-Summary-Datei geprüft: ','country-year-transaction totals checked against the separate Country Summary file: ')+audit.differences.length+' '+L('Abweichungen über 1,01 $. ','differences above $1.01. ')+num(data.meta.negativeRows)+' '+L('negative Korrekturzeilen bleiben enthalten.','negative adjustment records retained.');
  $('aid-source-list').innerHTML=data.sources.map(s=>'<article><h3><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.file)+' ↗</a></h3><p class="mini">'+L('U.S. Department of State / USAID · Stand 30.09.2026 · Abruf 26.10.2026','U.S. Department of State / USAID · Release 30 Sep 2026 · Retrieved 26 Oct 2026')+' · '+num(s.bytes/1e6)+' MB</p><small>SHA-256 '+s.sha256+'</small></article>').join('');
  $('aid-load').hidden=true;renderOverview();render();
  ['aid-transaction','aid-objective','aid-from','aid-to'].forEach(id=>$(id).addEventListener('change',()=>{shown=25;render();}));
  $('aid-country').addEventListener('change',render);$('aid-query').addEventListener('input',render);$('aid-more').addEventListener('click',()=>{shown=countries.length;render();});$('aid-export').addEventListener('click',exportCsv);
  document.addEventListener('click',e=>{const country=e.target.closest('[data-aid-country]');if(country){$('aid-country').value=country.dataset.aidCountry;render();$('aid-profile').scrollIntoView({behavior:'smooth'});}const view=e.target.closest('[data-aid-view]');if(view){const [o,t]=view.dataset.aidView.split('|');$('aid-objective').value=o;$('aid-transaction').value=t;$('aid-from').value='2025';$('aid-to').value='2025';$('aid-query').value='';shown=25;render();$('aid-controls').scrollIntoView({behavior:'smooth'});}});
 }catch(e){$('aid-load').textContent=L('Die Hilfsdaten konnten nicht geladen werden. Bitte neu laden. ','Assistance data could not be loaded. Please reload. ')+e.message;}
}
init();
})();
