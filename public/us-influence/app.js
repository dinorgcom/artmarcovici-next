(() => {
'use strict';
const $ = id => document.getElementById(id);
const L = (de,en) => window.BIEST_LANG === 'en' ? en : de;
const locale = window.BIEST_LOCALE || 'de-AT';
const regions = new Intl.DisplayNames([locale],{type:'region'});
const esc = x => String(x ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize = s => String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const integer = n => new Intl.NumberFormat(locale,{maximumFractionDigits:0}).format(n);
const money = n => n==null ? L('unbekannt','unknown') : new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(n)+' $';
const compact = n => new Intl.NumberFormat(locale,{notation:'compact',maximumFractionDigits:2}).format(n);
const unknown = () => L('unbekannt / nicht offengelegt','unknown / not disclosed');
const cats={lobby:L('Lobby / politische Beratung','Lobbying / political advice'),lda:'LDA',university:L('Hochschulen','Universities'),thinktank:'Thinktanks',media:L('Medien / PR','Media / PR'),representation:L('Weitere Vertretung','Other representation'),investment:L('Kapitalanlagen','Investment'),domestic:L('US-Organisationen','US organizations')};
const measures={'university-gift':L('Hochschulgeschenke · Meldevolumen','University gifts · reported volume'),'university-contract':L('Hochschulverträge · Meldevolumen','University contracts · reported volume'),'university-other':L('Sonstige Hochschulmeldung','Other university disclosure'),'fdi-ubo-stock':L('Direktinvestitionsbestand · letztlicher Eigentümer','Direct investment stock · ultimate owner'),'fdi-parent-stock':L('Direktinvestitionsbestand · unmittelbarer Eigentümer','Direct investment stock · immediate parent'),'fdi-net-flows':L('Direktinvestitionen · Nettofluss','Direct investment · net flow'),'fara-records':L('FARA · Betragsbelege (Anzahl)','FARA · amount entries (count)'),'fara-receipts':L('FARA · gemeldete Einnahmen','FARA · reported receipts'),'disclosed-band':L('Veröffentlichte Spendenklasse','Published donor band'),'tracker-minimum':L('Sekundärtracker · Untergrenze','Secondary tracker · lower bound'),'organization-expenses':L('IRS · Organisationsaufwand','IRS · organizational expense'),'committee-disbursements':L('FEC · Komitee-Auszahlungen','FEC · committee disbursements')};
const reviewLabels={'source-row':L('Amtliche Datenzeile','Government data row'),'source-cell':L('Amtliche Tabellenzelle','Government table cell'),'structured-extraction':L('PDF-Extraktion · stichprobengeprüft','PDF extraction · spot-checked'),'primary-reviewed':L('Original-Spenderliste geprüft','Original donor roll checked'),'source-field':L('Steuererklärung · reproduziert','Tax filing · reproduced'),'secondary-unverified':L('Sekundärhinweis · nicht primärabgeglichen','Secondary lead · not fully reconciled')};
const sourceKinds={'government-data':L('Amtlicher Datensatz','Government dataset'),'government-statistic':L('Amtliche Statistik','Government statistics'),'government-report':L('Amtlicher Bericht','Government report'),'secondary-tracker':L('Sekundärtracker','Secondary tracker'),'primary-filing-mirror':L('Originalerklärung · Spiegel','Original filing · mirror'),'primary-recipient-report':L('Empfänger · Originalbericht','Recipient · original report')};
let countries=[],sources=[],sourceMap=new Map(),current=null,rows=[],filtered=[],page=0,sourceLimit=20,loadSequence=0;
const cache=new Map(); const pageSize=20;
const countryName = c => c.id.length===2 ? (regions.of(c.id)||c.name) : c.name;
const countryById = id => countries.find(c=>c.id===id);
function toast(message,error=false){$('load-status').textContent=message;$('load-status').classList.toggle('error',error);$('load-status').hidden=false;}
function period(r){
 if(r.periodMonths===6)return L('6 Monate bis ','6 months to ')+(r.periodEnd||unknown());
 if(r.measure.startsWith('university-'))return r.date ? r.date+(r.dateBasis==='contract-start'?L(' · Vertragsbeginn',' · contract start'):L(' · Eingang',' · receipt')):L('Datum unbekannt','Date unknown');
 if(r.category==='investment')return String(r.year);
 if(r.periodStart&&r.periodEnd)return r.periodStart+' → '+r.periodEnd;
 return r.year ? String(r.year):L('nicht jahreszuordenbar','no assigned year');
}
function amount(r){
 if(r.amountMin!=null)return r.amountMax==null?'≥ '+money(r.amountMin):money(r.amountMin)+' – '+money(r.amountMax);
 if(r.measure==='tracker-minimum'&&r.amount!=null)return '≥ '+money(r.amount);
 return money(r.amount);
}
function sourceUrl(r){const s=sourceMap.get(r.source);return s?s.url+(r.amountPage||r.page?'#page='+(r.amountPage||r.page):''):'#';}
function badges(r){let b=[];if(r.possibleDuplicate)b.push(L('Mögliche Dublette','Possible duplicate'));if(r.duplicateOf)b.push(L('Wiederholter Beleg','Repeated entry'));if(r.boundaryOverlap)b.push(L('Enthält auch 2005','Also includes 2005'));if(r.mixedServices)b.push(L('Gemischte Leistungen','Mixed services'));if(r.review==='secondary-unverified')b.push(L('Sekundärhinweis','Secondary lead'));return b.map(x=>'<span class="record-badge warning">'+esc(x)+'</span>').join('');}
function renderCountries(){
 const q=normalize($('country-search').value),all=$('country-scope').value==='all';
 const list=countries.filter(c=>(all||['un-member','un-observer'].includes(c.kind))&&normalize([countryName(c),c.name,c.id,...c.aliases].join(' ')).includes(q)).sort((a,b)=>countryName(a).localeCompare(countryName(b),locale));
 $('country-results').innerHTML=list.map(c=>'<button class="country-option" data-select-country="'+esc(c.id)+'" aria-pressed="'+(current?.id===c.id)+'"><span>'+esc(countryName(c))+'</span><small>'+esc(c.id.length===2?c.id:'…')+'</small></button>').join('')||'<p class="mini">'+L('Keine passende Herkunft.','No matching origin.')+'</p>';
 $('country-count').textContent=integer(list.length)+' '+L('Profile in dieser Auswahl. Die Aufnahme ist keine Aussage über Höhe oder Vorliegen von Einfluss.','profiles in this selection. Inclusion does not establish influence or its scale.');
}
const catNotes={
 lobby:L('FARA-Leistungsbezeichnung; LDA fehlt.','FARA service description; LDA is missing.'),lda:L('Kein abrufbarer Datensatz eingelesen.','No retrievable dataset ingested.'),university:L('Meldezeilen bis 28.02.2025. Kein Nachweis des Verwendungsorts.','Release through 28 Feb 2025. Does not establish where money was used.'),thinktank:L('Nur ausgewählte Original-Spenderlisten.','Selected original donor rolls only.'),media:L('Nur in FARA erschlossene Medien-/PR-Leistungen.','Only media / PR services indexed in FARA.'),representation:L('FARA: z. B. Handel, Tourismus, Rechts- oder Registerdienste.','FARA: e.g. trade, tourism, legal or registry services.'),investment:L('Bestände und Nettoflüsse; staatlich / privat nicht trennbar.','Stocks and net flows; state / private not separable.'),domestic:L('US-Vergleichsorganisationen; keine Auslandszuordnung.','US comparator organizations; no foreign attribution.')};
async function selectCountry(id,{scroll=false,category=null}={}){
 const c=countryById(id);if(!c)return;
 current=c;if(scroll)$('country-search').value='';page=0;rows=[];filtered=[];const seq=++loadSequence;
 if(!['un-member','un-observer'].includes(c.kind))$('country-scope').value='all';
 $('record-category').value=category||'';
 $('record-search').value='';
 $('profile').innerHTML='<p>'+L('Profil wird geladen …','Loading profile …')+'</p>';
 $('records').innerHTML='';$('record-count').textContent=L('Belege werden geladen …','Loading evidence …');
 $('download-csv').disabled=true;renderCountries();
 const u=new URL(location.href);u.searchParams.set('country',id);history.replaceState(null,'',u);
 if(scroll)$('atlas').scrollIntoView({behavior:'smooth'});
 try{
  if(!cache.has(id)){const res=await fetch('/us-influence/data/'+encodeURIComponent(id)+'.json');if(!res.ok)throw Error('HTTP '+res.status);cache.set(id,await res.json());}
  if(seq!==loadSequence)return;
  rows=cache.get(id);renderProfile();filterRecords();$('load-status').hidden=true;
 }catch(e){if(seq!==loadSequence)return;$('profile').innerHTML='<p class="empty">'+L('Dieses Profil konnte nicht geladen werden. Bitte die Seite neu laden; das Datenarchiv bleibt im Quellenbereich verfügbar.','This profile could not be loaded. Please reload; the data archive remains available in Sources.')+'</p>';toast(L('Ladefehler: ','Loading error: ')+e.message,true);}
}
function renderProfile(){
 const c=current,primary=rows.filter(r=>r.review!=='secondary-unverified'),type={'un-member':L('UN-Mitglied','UN member'),'un-observer':L('UN-Beobachter','UN observer'),'territory':L('ISO-Gebiet','ISO territory'),'source-category':L('Herkunftskategorie der Quelle','Source attribution category'),'additional-jurisdiction':L('Gesondert geführtes Gebiet','Separately listed jurisdiction')}[c.kind];
 const groups=Object.keys(cats).filter(k=>k!=='domestic'||c.id==='US');
 const cards=groups.map(k=>{const rr=primary.filter(r=>r.category===k),years=rr.map(r=>r.year).filter(Boolean),n=rr.length;return '<button class="category-card '+(n?'':'unknown')+'" data-profile-category="'+k+'"><b>'+cats[k]+'</b><strong>'+ (n?integer(n):L('unbekannt','unknown'))+'</strong><small>'+(n?L('Belegzeilen','records')+(years.length?' · '+Math.min(...years)+'–'+Math.max(...years):'')+'<br>':'')+catNotes[k]+'</small></button>';}).join('');
 const alias=c.aliases.filter(x=>normalize(x)!==normalize(c.name));
 const numeric=primary.filter(r=>r.amount!=null||r.amountMin!=null).length;
 let countryNote=L('Die Quellen ordnen diese Belege einer Herkunft zu. Das macht private Unternehmen, Stiftungen oder Einzelpersonen nicht zu staatlichen Auftraggebern.','Sources assign these records to an origin. This does not make private companies, foundations or individuals government principals.');
 if(c.id==='QA')countryNote=L('Katar: Hochschulverträge können auch die Leistungen von US-Universitäten an Standorten in Doha finanzieren. Die Daten erlauben keine zuverlässige Aufteilung zwischen US-Ausgaben und Auslandscampus.','Qatar: university contracts can finance US institutions operating campuses in Doha. The data does not permit a reliable split between US spending and overseas campuses.');
 if(c.id==='US')countryNote=L('US-Vergleich: AIPAC, AIPAC PAC, UDP, JStreetPAC und U.S.-Cuba Democracy PAC werden als inländische Organisationen geführt. Ihre Budgets werden keinem ausländischen Staat zugerechnet. Ausgaben der Organisationen und Transfers können sich überschneiden.','US comparator: AIPAC, AIPAC PAC, UDP, JStreetPAC and U.S.-Cuba Democracy PAC are domestic organizations. Their budgets are not attributed to a foreign government. Organizational expenses and transfers may overlap.');
 $('profile').innerHTML='<div class="profile-head"><div><span class="small-label">'+esc(type)+' · '+integer(primary.length)+' '+L('Zeilen aus Primärquellen / Originalerklärungen','rows from primary sources / original filings')+'</span><h3>'+esc(countryName(c))+'</h3><p>'+L('Originalbezeichnungen: ','Original labels: ')+esc(alias.join(' · ')||c.name)+'</p></div><span class="country-code" aria-hidden="true">'+esc(c.id.length===2?c.id:'↗')+'</span></div><p class="profile-note">'+countryNote+'</p><div class="category-cards">'+cards+'</div><div class="profile-key"><div><strong>'+L('Was die Zahl bedeutet','What the count means')+'</strong><p>'+integer(numeric)+' '+L('Zeilen enthalten einen Betrag oder eine Bandbreite. Die übrigen enthalten z. B. unterdrückte Werte oder Meldungen ohne bezifferten Betrag. Zeilenanzahl ist kein Ausgabenmaß.','rows contain an amount or a range. Others include suppressed values or disclosures without amounts. Record count is not a spending measure.')+'</p></div><div><strong>'+L('Was offen bleibt','What remains unknown')+'</strong><p>'+L('Für keine Kategorie ist die Vollständigkeit 2006–2025 belegt. Fehlende Belege bedeuten „in dieser Auswertung unbekannt“. Medien außerhalb FARA, verdeckte Aktivitäten und einzelne Staatsfonds-Portfolios sind nicht vollständig erschlossen.','Completeness for 2006–2025 is not established for any category. Missing evidence means “unknown in this edition.” Media outside FARA, concealed activity and individual sovereign-fund portfolios are not comprehensively indexed.')+'</p></div></div><div id="profile-trend" class="spark-chart"></div><button class="text-button" data-jump-evidence>'+L('Alle Belege dieses Profils ansehen ↓','View all records for this profile ↓')+'</button>';
 renderTrend();
}
function renderTrend(){
 const target=$('profile-trend');if(!target||!current)return;
 const m=current.id==='US'?'organization-expenses':$('compare-measure').value;
 const key=m.startsWith('university-')&&$('compare-duplicates').value==='distinct'?m+'-distinct':m;
 let vals=Array.from({length:20},(_,i)=>{let y=2006+i,d=current.metrics[key]?.[y];return {year:y,value:d?(m==='fara-records'?d.count:d.amount):null};});
 if(m==='organization-expenses')vals=vals.map(x=>({...x,value:rows.find(r=>r.measure===m&&r.year===x.year)?.amount??null}));
 if(!vals.some(x=>x.value!=null)){target.innerHTML='<p class="mini">'+L('Keine Jahresreihe für die aktuell gewählte Vergleichsgröße.','No annual series for the currently selected comparison measure.')+'</p>';return;}
 const max=Math.max(0,...vals.map(x=>x.value??0)),min=Math.min(0,...vals.map(x=>x.value??0)),span=max-min||1,base=135-(0-min)/span*115;
 const svg=vals.map((x,i)=>{const xx=24+i*35.8; if(x.value==null)return '<rect x="'+xx+'" y="'+(base-3)+'" width="23" height="6" class="spark-empty"><title>'+x.year+': '+L('unbekannt','unknown')+'</title></rect>';
 const yy=135-(x.value-min)/span*115;return '<rect x="'+xx+'" y="'+Math.min(yy,base)+'" width="23" height="'+Math.max(1,Math.abs(base-yy))+'" class="spark-bar"><title>'+x.year+': '+(m==='fara-records'?integer(x.value):money(x.value))+'</title></rect>';}).join('');
 target.innerHTML='<div class="spark-title"><span>'+esc(measures[m])+' · 2006–2025</span><span>'+L('Gestrichelt: unbekannt','Dashed: unknown')+'</span></div><svg viewBox="0 0 760 170" role="img" aria-label="'+esc(measures[m]+' · '+countryName(current)+' · 2006–2025')+'"><line x1="18" x2="745" y1="'+base+'" y2="'+base+'" stroke="#a8ac9e"/>'+svg+'<text x="24" y="160">2006</text><text x="351" y="160">2015</text><text x="706" y="160">2025</text></svg><p class="mini">'+L('Jeder Balken steht für ein Jahr. Werte sind über den Vergleich bzw. die Einzelbelege zugänglich; keine Addition über Messgrößen.','Each bar represents one year. Values are available in the comparison and evidence ledger; measures are never added together.')+'</p>';
 target.insertAdjacentHTML('beforeend','<details class="trend-values"><summary>'+L('Jahreswerte anzeigen','Show annual values')+'</summary><table><thead><tr><th>'+L('Jahr','Year')+'</th><th>'+L('Wert','Value')+'</th></tr></thead><tbody>'+vals.map(x=>'<tr><td>'+x.year+'</td><td>'+(x.value==null?L('unbekannt','unknown'):m==='fara-records'?integer(x.value):money(x.value))+'</td></tr>').join('')+'</tbody></table></details>');
}
function renderComparison(){
 const m=$('compare-measure').value,y=Number($('compare-year').value),uni=m.startsWith('university-'),key=uni&&$('compare-duplicates').value==='distinct'?m+'-distinct':m;
 $('duplicate-control').hidden=!uni;
 let list=countries.filter(c=>c.kind!=='source-category').map(c=>({c,v:c.metrics[key]?.[y]})).filter(x=>x.v!=null).map(x=>({c:x.c,n:m==='fara-records'?x.v.count:x.v.amount}));
 const total=list.length,negative=list.filter(x=>x.n<0).length;
 // For net flows show largest absolute values, preserving divestment; all other measures sort by value.
 list.sort((a,b)=>m==='fdi-net-flows'?Math.abs(b.n)-Math.abs(a.n):b.n-a.n);list=list.slice(0,12);
 const max=Math.max(0,...list.map(x=>x.n)),min=Math.min(0,...list.map(x=>x.n)),span=max-min||1,zero=-min/span*100;
 $('bars').innerHTML=list.map(x=>{const start=x.n<0?(x.n-min)/span*100:zero;return '<button class="bar-row" data-country="'+x.c.id+'" aria-label="'+esc(countryName(x.c)+': '+(m==='fara-records'?integer(x.n):money(x.n)))+'"><span class="bar-label">'+esc(countryName(x.c))+'</span><span class="bar-track"><span class="bar-fill '+(x.n<0?'negative':'')+'" style="left:'+start+'%;width:'+(Math.abs(x.n)/span*100)+'%"></span>'+(min<0?'<span class="bar-zero" style="left:'+zero+'%"></span>':'')+'</span><span class="bar-value">'+compact(x.n)+(m==='fara-records'?'':' $')+'</span></button>';}).join('')||'<p class="empty">'+L('Für dieses Jahr sind keine Werte dieser Messgröße verfügbar.','No values for this measure are available for this year.')+'</p>';
 $('chart-title').textContent=measures[m]+' · '+y;
 $('chart-unit').textContent=m==='fara-records'?L('Beleganzahl','Entry count'):L('Nominale USD','Nominal USD');
 const notes={
 'university-gift':L('Geschenke nach Eingangsdatum. Selbst gemeldete nominale Werte; staatliche und private Herkunft zusammen, ohne behauptete politische Zweckbindung.','Gifts by receipt date. Self-reported nominal values; public and private origins together, without an assumed political purpose.'),
 'university-contract':L('Vertragsvolumen nach Vertragsbeginn (ersatzweise Eingang). Mehrjährige Verträge erscheinen vollständig in diesem Zuordnungsjahr; dies ist keine jährliche Zahlungsreihe. Auslandscampus sind nicht herausgerechnet.','Contract volume assigned to start date (receipt date as fallback). Multi-year contracts appear in full in that assignment year; this is not an annual payment series. Overseas campuses have not been subtracted.'),
 'fdi-ubo-stock':L('BEA-Jahresendbestand zu historischen Kosten nach letztlichem Eigentümer. 2006–2007 fehlen in diesem Auszug. Kapitalbestand ist keine politische Einflussausgabe.','BEA year-end historical-cost stock by ultimate beneficial owner. 2006–2007 are missing in this extract. Capital stock is not political influence spending.'),
 'fdi-parent-stock':L('BEA-Jahresendbestand zu historischen Kosten nach unmittelbarem Eigentümer. Finanzzentren können Durchgangsstationen sein. Keine Addition mit UBO-Beständen.','BEA year-end historical-cost stock by immediate parent. Financial centers can be intermediaries. Not added to UBO stocks.'),
 'fdi-net-flows':L('BEA-Netto-Direktinvestitionsflüsse. Gezeigt werden die zwölf größten absoluten Werte; negative Beträge bleiben als Desinvestitionen sichtbar. Keine Lobbyzahlungen.','BEA net direct investment flows. The twelve largest absolute values are shown; negative amounts remain visible as divestment. Not lobbying payments.'),
 'fara-records':L('Zahl erschlossener Sechsmonats-Betragsbelege nach Periodenende, identische Kombinationen einmal. Das ist weder eine Zahl von Verträgen noch eine Ausgabensumme oder ein Einflussrang.','Count of indexed six-month amount entries by period end, identical combinations counted once. Not a count of contracts, a spending total or an influence ranking.')};
 $('compare-note').textContent=notes[m]+(uni?' '+L('Quellenstand 28.02.2025; 2025 stark unvollständig.','Source release 28 Feb 2025; 2025 substantially incomplete.'):'');
 $('chart-coverage').textContent=integer(total)+' '+L('Herkünfte mit verfügbarem Zahlenwert','origins with an available number')+(negative?' · '+negative+' '+L('negative Werte im Gesamtauszug','negative values in the full extract'):'');
 $('chart-caption').innerHTML=(uni?'Section 117 · 28.02.2025':m==='fara-records'?'DOJ FARA · 40 '+L('Halbjahresberichte','half-year reports'):'Bureau of Economic Analysis · '+L('Ländertabellen','country tables'))+'. '+L('Balken öffnen das Länderprofil. Fehlende Werte werden nicht zu Null.','Bars open the country profile. Missing values are not made zero.');
 renderTrend();
}
function filterRecords(){
 page=0;const category=$('record-category').value,q=normalize($('record-search').value),from=Number($('year-from').value),to=Number($('year-to').value);
 filtered=rows.filter(r=>{
  if(category&&r.category!==category)return false;
  if(r.review==='secondary-unverified'&&!$('show-secondary').checked)return false;
  if($('amounts-only').checked&&r.amount==null&&r.amountMin==null)return false;
  if(r.year!=null){if(r.year<from||r.year>to)return false;}
  else {if(!$('show-undated').checked)return false;if(r.periodStart&&r.periodEnd&&(Number(r.periodEnd.slice(0,4))<from||Number(r.periodStart.slice(0,4))>to))return false;}
  return !q||normalize([r.recipient,r.principal,r.origin,r.description,r.services,r.id].join(' ')).includes(q);
 }).sort((a,b)=>(b.year||0)-(a.year||0)||(b.amount??b.amountMin??-Infinity)-(a.amount??a.amountMin??-Infinity)||a.id.localeCompare(b.id));
 renderRecords();
}
function renderRecords(){
 const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,pageCount-1);
 const start=page*pageSize;
 $('record-count').textContent=(current?countryName(current)+' · ':'')+integer(filtered.length)+' '+L('gefilterte Belege','filtered records')+' · '+L('Beträge werden nicht addiert.','Amounts are not added together.')+(Number($('year-from').value)>Number($('year-to').value)?' '+L('Der Beginn liegt nach dem Ende.','The start is later than the end.'):'');
 $('records').innerHTML=filtered.slice(start,start+pageSize).map(r=>'<tr><td>'+esc(period(r))+'<small>'+esc(measures[r.measure]||r.measure)+'</small>'+badges(r)+'</td><td><strong>'+esc(r.principal||unknown())+'</strong><div class="record-arrow">↓</div>'+esc(r.recipient||unknown())+'<small>'+esc(cats[r.category])+'</small></td><td class="amount">'+esc(amount(r))+(r.amountMin!=null?'<small>'+L('Bandbreite, kein exakter Betrag','Range, not an exact amount')+'</small>':'')+(r.status==='suppressed-or-range'?'<small>'+L('Quellencode: ','Source code: ')+esc(r.sourceValue??unknown())+'</small>':'')+'</td><td><button class="text-button" data-record="'+esc(r.id)+'">'+L('Details ↗','Details ↗')+'</button><small>'+esc(reviewLabels[r.review]||r.review)+'</small></td></tr>').join('')||'<tr><td colspan="4" class="empty">'+L('Keine Belege unter diesen Filtern. Das bedeutet unbekannt, nicht null Dollar.','No records under these filters. This means unknown, not zero dollars.')+'</td></tr>';
 $('page-info').textContent=(page+1)+' / '+pageCount;
 $('prev').disabled=page===0;$('next').disabled=page>=pageCount-1;$('download-csv').disabled=!filtered.length;
}
function showRecord(id){
 const r=rows.find(x=>x.id===id);if(!r)return;const s=sourceMap.get(r.source);
 let warnings=[];
 if(r.review==='structured-extraction')warnings.push(L('Automatische PDF-Extraktion, stichprobenweise geprüft. Namen, OCR und Perioden müssen bei redaktioneller Weiterverwendung am verlinkten Original kontrolliert werden. Kein Nachweis einer überprüften Kontobewegung.','Automated PDF extraction, spot-checked. Names, OCR and periods require checking against the linked original before further editorial use. Not evidence of a verified bank transaction.'));
 if(r.category==='university')warnings.push(L('Selbstmeldung der Hochschule. Ein Vertragsbetrag kann mehrere Jahre und einen Auslandscampus betreffen. Der Herkunftseintrag ist kein Nachweis staatlicher Finanzierung oder politischer Zweckbindung.','Institutional self-report. A contract can cover several years and an overseas campus. Attribution does not establish state funding or political purpose.'));
 if(r.category==='investment')warnings.push(L('Amtliche aggregierte Investitionsstatistik, nominale USD zu historischen Kosten. Keine Trennung staatlicher und privater Eigentümer, kein Lobbybudget.','Official aggregate investment statistics, nominal USD at historical cost. No separation of state and private owners; not a lobbying budget.'));
 if(r.category==='domestic')warnings.push(L('Inländische US-Organisation. Der Betrag wird keinem ausländischen Staat zugerechnet. Organisationsaufwand und Komitee-Auszahlungen sind verschiedene Größen.','Domestic US organization. This amount is not attributed to a foreign government. Organizational expense and committee disbursements are different measures.'));
 if(r.amountMin!=null)warnings.push(r.cashReported?L('Der Empfänger bezeichnet diese Spendenklasse als erhaltene Geldunterstützung. Der genaue Betrag ist nicht veröffentlicht.','The recipient describes this band as cash support received. The exact amount is not published.'):L('Die veröffentlichte Klasse umfasst Geld, Verträge und/oder Sachleistungen. Kein exakter Zahlungsbetrag.','The published band includes cash, contracts and/or in-kind support. Not an exact payment amount.'));
 if(r.review==='secondary-unverified')warnings.push(L('Recherchehinweis aus einem Sekundärtracker; nicht vollständig mit den ursprünglichen Spenderlisten und Einzeljahren abgeglichen. Nicht als verifizierte Zahlung verwenden.','Lead from a secondary tracker; not fully reconciled with original donor rolls and individual years. Do not use as a verified payment.'));
 if(r.possibleDuplicate)warnings.push(L('Eine frühere Meldezeile hat identische Felder. Ohne Transaktions-ID ist nicht entschieden, ob dies ein Duplikat oder eine echte Wiederholung ist.','An earlier row has identical fields. Without a transaction ID, it is unresolved whether this is a duplicate or a real repeated transaction.'));
 if(r.duplicateOf)warnings.push(L('Identische FARA-Kombination bereits unter ','Identical FARA combination already indexed as ')+r.duplicateOf);
 if(r.boundaryOverlap)warnings.push(L('Die Periode beginnt vor 2006; der Betrag wird nicht künstlich anteilig gekürzt.','The period begins before 2006; the amount has not been artificially prorated.'));
 const fields=[
 [L('Herkunft laut Quelle','Attribution in source'),r.origin],[L('Auftraggeber / Geber','Principal / donor'),r.principal||unknown()],[L('Empfänger / Bezug','Recipient / subject'),r.recipient||unknown()],
 [L('Messgröße','Measure'),measures[r.measure]||r.measure],[L('Betrag / Bandbreite','Amount / range'),amount(r)],[L('Zeitraum / Zuordnung','Period / assignment'),period(r)],
 [L('Vertragslaufzeit','Contract term'),r.category==='university'&&r.measure==='university-contract'?(r.periodStart||'?')+' → '+(r.periodEnd||'?'):null],
 [L('Staatliche Quelle','Government source'),r.governmentSource==='Yes'?L('Ja, laut Hochschulmeldung','Yes, according to university disclosure'):r.governmentSource==='No'?L('Nein, laut Hochschulmeldung','No, according to university disclosure'):unknown()],
 [L('Tätigkeit','Services'),r.services],[L('Berichtsstand','Report edition'),r.reportYear?r.reportYear+' H'+r.reportHalf:null],
 [L('Prüfstatus','Review status'),reviewLabels[r.review]||r.review],[L('Fundstelle','Locator'),r.locator],[L('Registrierung','Registration'),r.registration||r.committeeId],[L('Quellenwert','Source value'),r.category==='investment'?String(r.sourceValue??unknown())+' (USD million)':null],
 [L('Campus-Hinweis','Campus indication'),r.category==='university'?(r.useLocation==='campus-mentioned'?L('Campus in Beschreibung erwähnt; Betrag nicht geografisch aufteilbar','Campus mentioned in description; amount cannot be split geographically'):L('Verwendungsort nicht zuverlässig trennbar','Place of use not reliably separable')):null],
 [L('Datensatz-ID','Record ID'),r.id]
 ];
 $('record-detail').innerHTML='<h2 id="dialog-title">'+esc(measures[r.measure]||r.measure)+'</h2><dl>'+fields.filter(x=>x[1]!=null).map(([k,v])=>'<dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd>').join('')+'</dl>'+(r.description?'<div class="quote"><span class="small-label">'+L('Quellentext / Extraktion','Source text / extraction')+'</span><br>'+esc(r.description)+'</div>':'')+warnings.map(w=>'<p class="mini">'+esc(w)+'</p>').join('')+'<a class="button dark" href="'+esc(sourceUrl(r))+'" target="_blank" rel="noopener">'+L('Originalquelle öffnen ↗','Open original source ↗')+'</a><p class="mini">'+esc(s?.title||r.source)+'<br>'+L('Abruf: ','Retrieved: ')+esc(s?.retrieved||'')+'<br>SHA-256: '+esc(s?.sha256||'')+'</p>';
 $('record-dialog').showModal();
}
function renderCoverage(){
 const years=Array.from({length:20},(_,i)=>2006+i);
 const lines=[
 ['FARA',()=>2],['LDA',()=>0],['Section 117',y=>y===2025?1:2],[L('Thinktanks · Originale','Think tanks · originals'),y=>[2019,2021,2024,2025].includes(y)?1:0],['BEA · parent',()=>2],['BEA · UBO',y=>y>=2008?2:0],['AIPAC · IRS 990',y=>y>=2014?1:0],[L('US-PACs · FEC-Zyklen','US PACs · FEC cycles'),y=>y<=2024?1:0]
 ];
 $('coverage-timeline').innerHTML='<div class="coverage-scroll"><div class="coverage-grid"><span></span>'+years.map(y=>'<span class="coverage-year">'+y+'</span>').join('')+lines.map(([label,fn])=>'<span class="coverage-label">'+esc(label)+'</span>'+years.map(y=>{const v=fn(y);return '<span class="coverage-cell '+(v===2?'corpus':v===1?'partial':'')+'" role="img" aria-label="'+esc(label+' '+y+': '+(v===2?L('Quellenkorpus verfügbar, keine Vollständigkeit der Geldflüsse','Source corpus available; flows not complete'):v===1?L('ausgewählter / unvollständiger Ausschnitt','selected / incomplete subset'):L('nicht eingelesen','not ingested')))+'" title="'+y+'"></span>';}).join('')).join('')+'</div></div><div class="coverage-legend"><span><i></i>'+L('Quellenkorpus verfügbar','Source corpus available')+'</span><span><i class="partial"></i>'+L('Auswahl / unvollständiges Jahr','Selection / incomplete year')+'</span><span><i class="missing"></i>'+L('Nicht eingelesen','Not ingested')+'</span></div><p class="mini">'+L('Die Matrix zeigt verfügbare Quellenausgaben, nicht die Vollständigkeit der Zahlungen oder jedes Landes. FARA-Zellen bezeichnen Berichtsjahre; konkrete Zahlungsperioden können abweichen.','This matrix shows available source releases, not completeness of payments or each country. FARA cells refer to publication years; receipt periods can differ.')+'</p>';
}
function renderSources(){
 const q=normalize($('source-search').value),list=sources.filter(s=>normalize([s.title,s.kind,s.coverage,s.url].join(' ')).includes(q));
 $('source-count').textContent=list.length+' '+L('Quelldateien. Originaltexte und Bezeichnungen bleiben in der Quellsprache.','source files. Original texts and names remain in their source language.');
 $('sources').innerHTML=list.slice(0,sourceLimit).map((s,i)=>'<article class="source-row"><span class="source-index">'+String(i+1).padStart(2,'0')+'</span><div><h3><a href="'+esc(s.url)+'" target="_blank" rel="noopener">'+esc(s.title)+' ↗</a></h3><p>'+esc(s.coverage||'')+'</p><p>'+L('Abruf: ','Retrieved: ')+esc(s.retrieved)+'</p><code>SHA-256 '+esc(s.sha256)+'</code></div><span class="source-kind">'+esc(sourceKinds[s.kind]||s.kind)+'</span></article>').join('');
 $('sources-more').hidden=sourceLimit>=list.length;
}
function downloadCsv(){
 // Spreadsheet applications must not execute text fields as formulas.
 const cell=x=>{let s=x==null?'':typeof x==='object'?JSON.stringify(x):String(x);if(typeof x==='string'&&/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const fields=['id','country','origin','category','measure','year','periodStart','periodEnd','date','dateBasis','amount','amountMin','amountMax','recipient','principal','governmentSource','review','locator','source','sourceUrl','possibleDuplicate','duplicateOf','boundaryOverlap','description'];
 const text='\ufeff'+fields.join(',')+'\r\n'+filtered.map(r=>fields.map(k=>cell(k==='sourceUrl'?sourceUrl(r):r[k])).join(',')).join('\r\n');
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));a.href=url;a.download='biest-us-influence-'+current.id+'-'+($('record-category').value||'all')+'.csv';a.textContent=L('CSV herunterladen ↓','Download CSV ↓');toast(L('Datei bereit. ','File ready. '));$('load-status').append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);if(a.isConnected)$('load-status').hidden=true;},180000);
}
function bind(){
 for(const id of ['compare-measure','compare-year','compare-duplicates'])$(id).addEventListener('change',renderComparison);
 for(const id of ['country-search','country-scope'])$(id).addEventListener(id==='country-search'?'input':'change',renderCountries);
 for(const id of ['record-category','year-from','year-to','show-secondary','amounts-only','show-undated'])$(id).addEventListener('change',filterRecords);
 $('record-search').addEventListener('input',filterRecords);
 $('prev').addEventListener('click',()=>{page--;renderRecords();});$('next').addEventListener('click',()=>{page++;renderRecords();});
 $('download-csv').addEventListener('click',downloadCsv);
 $('source-search').addEventListener('input',()=>{sourceLimit=20;renderSources();});$('sources-more').addEventListener('click',()=>{sourceLimit+=20;renderSources();});
 $('close-dialog').addEventListener('click',()=>$('record-dialog').close());
 $('record-dialog').addEventListener('click',e=>{if(e.target===$('record-dialog')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}});
 $('reset').addEventListener('click',()=>{$('country-search').value='';$('country-scope').value='sovereign';$('record-category').value='';$('record-search').value='';$('year-from').value='2006';$('year-to').value='2025';$('show-secondary').checked=false;$('amounts-only').checked=false;$('show-undated').checked=true;renderCountries();filterRecords();});
 document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.selectCountry)selectCountry(b.dataset.selectCountry);
  if(b.dataset.country)selectCountry(b.dataset.country,{scroll:true,category:b.dataset.country==='US'?'domestic':null});
  if(b.dataset.profileCategory){$('record-category').value=b.dataset.profileCategory;filterRecords();$('belege').scrollIntoView({behavior:'smooth'});}
  if(b.hasAttribute('data-jump-evidence'))$('belege').scrollIntoView({behavior:'smooth'});
  if(b.dataset.record)showRecord(b.dataset.record);
 });
}
async function init(){
 try{
  const [cc,ss,meta]=await Promise.all(['countries','sources','meta'].map(async n=>{const res=await fetch('/us-influence/data/'+n+'.json');if(!res.ok)throw Error(n+': HTTP '+res.status);return res.json();}));
  countries=cc;sources=ss;sourceMap=new Map(ss.map(s=>[s.id,s]));
  $('stat-rows').textContent=integer(meta.records);
  const opts=Array.from({length:20},(_,i)=>'<option value="'+(2006+i)+'">'+(2006+i)+'</option>').join('');
  for(const id of ['compare-year','year-from','year-to'])$(id).innerHTML=opts;
  $('compare-year').value='2024';$('year-from').value='2006';$('year-to').value='2025';
  $('record-category').innerHTML='<option value="">'+L('Alle Kategorien','All categories')+'</option>'+Object.entries(cats).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('');
  bind();renderComparison();renderCoverage();renderSources();renderCountries();
  const requested=new URLSearchParams(location.search).get('country');await selectCountry(countryById(requested)?requested:'QA');
 }catch(e){toast(L('Der Datenatlas konnte nicht geladen werden. Bitte neu laden. ','The data atlas could not be loaded. Please reload. ')+e.message,true);}
}
init();
})();
