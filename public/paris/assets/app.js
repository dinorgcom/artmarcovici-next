(function(){
 'use strict';
 const data=window.DOSSIER_DATA,core=window.DossierCore;
 const $=id=>document.getElementById(id);
 if(!data||!core){$('results-count').textContent='Die Länderdaten konnten nicht geladen werden. PDF und Excel stehen unter Quellen & Methode bereit.';return;}
 const number=(v,d=1)=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
 const percentage=v=>v===null?'Keine Einzelreihe':`${v>0?'+':''}${number(v)} %`;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeURL=value=>typeof value==='string'&&/^https:\/\//.test(value)?value:null;
 const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?new Intl.DateTimeFormat('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')):'Datum nicht eindeutig zugeordnet';
 const sourceLink=(url,label,css='inline-source')=>safeURL(url)?`<a class="${css}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
 const countryMap=new Map(data.countries.map(c=>[c.code,c]));
 const state={q:'',scope:'all',region:'all',type:'all',economy:'all',sort:'alpha',page:1};
 let currentResults=[],lastOpener=null,toastTimeout;
 const dialog=$('country-dialog');

 function lineChart(years,values,options={}){
  const points=years.map((year,i)=>({year,value:values[i]})).filter(p=>Number.isFinite(p.value));
  if(points.length<2)return '';
  const global=options.global,w=540,h=global?235:205,left=44,right=28,top=28,bottom=32;
  const yMin=global?45:0,rawMax=Math.max(...points.map(p=>p.value));
  const step=Math.pow(10,Math.floor(Math.log10(rawMax||1)));
  const yMax=global?56:Math.ceil(rawMax*1.1/step)*step||1;
  const x=value=>left+(value-years[0])/(years.at(-1)-years[0])*(w-left-right);
  const y=value=>top+(yMax-value)/(yMax-yMin)*(h-top-bottom);
  const ticks=global?[45,50,55]:[0,yMax/2,yMax];
  const grid=ticks.map(v=>`<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="${global?'#597268':'#c5c8b8'}" stroke-width=".6"/><text x="${left-10}" y="${y(v)+3}" text-anchor="end" fill="${global?'#aebdaf':'#697363'}" font-family="Arial,sans-serif" font-size="9">${number(v,global?0:rawMax<10?1:0)}</text>`).join('');
  const path=points.map((p,i)=>`${i?'L':'M'}${x(p.year).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const area=`${path} L${x(points.at(-1).year)},${h-bottom} L${x(points[0].year)},${h-bottom} Z`;
  const labels=points.filter(p=>global||p.year===years[0]||p.year===2020||p.year===years.at(-1)).map(p=>`<circle cx="${x(p.year)}" cy="${y(p.value)}" r="3.2" fill="${global?'#e3b497':'#d9472e'}"/><text x="${x(p.year)}" y="${y(p.value)-13}" text-anchor="middle" fill="${global?'#f5f2e9':'#263b31'}" font-family="Arial,sans-serif" font-size="10">${number(p.value,1)}</text><text x="${x(p.year)}" y="${h-7}" text-anchor="middle" fill="${global?'#bac9b8':'#697363'}" font-family="Courier New,monospace" font-size="9">${p.year}</text>`).join('');
  const description=points.map(p=>`${p.year}: ${number(p.value)} ${global?'Milliarden':'Millionen'} Tonnen CO2-Äquivalente`).join('; ');
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(description)}"><title>${esc(description)}</title>${grid}<path d="${area}" fill="${global?'#e3b497':'#d9472e'}" opacity=".07"/><path d="${path}" fill="none" stroke="${global?'#e3b497':'#d9472e'}" stroke-width="2.6" stroke-linejoin="round"/>${labels}</svg>`;
 }
 function comparisonChart(comp,compact=false){
  const {years,emissions,gdp}=comp.indexed,w=compact?340:700,h=compact?240:280,left=compact?36:46,right=compact?14:24,top=22,bottom=34;
  const values=[...emissions,...gdp],min=Math.max(0,Math.floor((Math.min(...values)-10)/20)*20),max=Math.ceil((Math.max(...values)+10)/20)*20;
  const x=year=>left+(year-comp.start)/(comp.end-comp.start)*(w-left-right),y=v=>top+(max-v)/(max-min)*(h-top-bottom);
  const step=(max-min)/4,ticks=Array.from({length:5},(_,i)=>min+i*step);
  const grid=ticks.map(v=>`<line x1="${left}" x2="${w-right}" y1="${y(v)}" y2="${y(v)}" stroke="#c5c8b8" stroke-width=".7"/><text x="${left-10}" y="${y(v)+4}" text-anchor="end" fill="#5c665d" font-family="Arial,sans-serif" font-size="11">${number(v,0)}</text>`).join('');
  const series=(items,color)=>{
   // Start a new path across missing calendar years; no interpolation of missing observations.
   const path=items.map((v,i)=>`${i&&years[i]===years[i-1]+1?'L':'M'}${x(years[i]).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
   return `<path d="${path}" fill="none" stroke="${color}" stroke-width="2.7" stroke-linejoin="round"/>${items.map((v,i)=>`<circle cx="${x(years[i])}" cy="${y(v)}" r="2.5" fill="${color}"><title>${years[i]}: ${number(v)} (2015 = 100)</title></circle>`).join('')}`;
  };
  const labels=[comp.start,2020,comp.end].map(year=>`<text x="${x(year)}" y="${h-8}" text-anchor="middle" fill="#5c665d" font-family="Courier New,monospace" font-size="11">${year}</text>`).join('');
  const description=`Gleiche Skala, 2015 = 100. ${years.map((year,i)=>`${year}: Treibhausgase ${number(emissions[i])}, reales BIP ${number(gdp[i])}`).join('; ')}`;
  return `<svg class="${compact?'chart-mobile':'chart-desktop'}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(description)}"><title>${esc(description)}</title>${grid}<line x1="${left}" x2="${w-right}" y1="${y(100)}" y2="${y(100)}" stroke="#899184" stroke-dasharray="4 4"/>${series(emissions,'#bf422d')}${series(gdp,'#28615e')}${labels}</svg>`;
 }
 const period=metric=>`${metric.start}–${metric.end}`;
 function periodMetrics(c,start,end){
  const g0=core.valueAt(c.economy,start),g1=core.valueAt(c.economy,end),e0=core.valueAt(c.emissions,start),e1=core.valueAt(c.emissions,end);
  if(!(g0>0)||!(g1>0)||!(e0>0)||!Number.isFinite(e1))return null;
  return {start,end,gdp:(g1/g0-1)*100,emissions:(e1/e0-1)*100,annualGDP:((g1/g0)**(1/(end-start))-1)*100};
 }
 const pledgeValue=c=>c.original.metric?.value==='Keine Quote'?'—':c.original.metric?.value||'Offen';
 const pledgeHTML=c=>esc(pledgeValue(c)).replace(/(\d)–(?=\d)/g,'$1–<wbr>').replace(/ %/g,'&nbsp;%');
 function pledgeContext(c){
  const metric=c.original.metric;
  if(!metric)return 'Kurzkennzahl noch nicht zugeordnet';
  return [metric.value==='Keine Quote'?'Keine Quote erfasst':null,metric.basis].filter(Boolean).join(' · ');
 }
 function pledgeMetric(c){return `<div class="pledge-metric"><span>VERSPRECHEN</span><strong class="pledge-value">${pledgeHTML(c)}</strong><small>${esc(pledgeContext(c))}</small>${c.original.metric?.note?`<small>${esc(c.original.metric.note)}</small>`:''}</div>`;}
 function economicLabel(c,comp){return c.economy.note?'Vergleich eingeschränkt':comp?.label||'Gemeinsamer Vergleich offen';}
 function germanGrowthNote(c){
  if(c.code!=='DEU')return '';
  const recent=periodMetrics(c,2019,2025),latest=periodMetrics(c,2022,2025);
  return `<aside class="germany-growth-note"><strong>Die Zehnjahreszahl verdeckt die jüngste Stagnation.</strong><p>Reales BIP 2019–2025: ${percentage(recent.gdp)}; 2022–2025: ${percentage(latest.gdp)}. Sinkende Emissionen gingen zuletzt mit schwacher beziehungsweise schrumpfender Wirtschaftsleistung einher. Das ist kein Beleg für eine bestimmte Ursache.</p><button class="text-link" data-show-economic>Zeiträume und Wirtschaftslage erläutert ↗</button></aside>`;
 }
 function economySection(c){
  const comp=core.comparison(c),growth=core.economyChange(c);
  const caveat=c.economy.note?`<p class="economy-caveat">${esc(c.economy.note)} ${sourceLink(c.economy.note_source,'IWF: Erfassungsgrenzen')}</p>`:'';
  const title=`<div class="comparison-heading"><div><span class="eyebrow">${esc(c.name.toLocaleUpperCase('de'))} / WIRTSCHAFTLICHER KONTEXT</span><h3>Emissionen und Wirtschaft seit Paris</h3></div>`+(comp?`<span class="comparison-period">${period(comp)} · ${comp.years} Jahre</span>`:'')+'</div>';
  if(!comp)return `<section class="detail-economy">${title}<div class="comparison-metrics pledge-only">${pledgeMetric(c)}</div><p class="comparison-missing">Kein gemeinsamer Vergleich für 2015–2024 oder 2015–2025 möglich. ${core.change(c.emissions)===null?'Eine eigenständige Emissionsreihe fehlt.':'Die passenden BIP-Werte fehlen.'}</p>${growth?`<p>Separat verfügbare Wirtschaftsentwicklung: <strong>reales BIP ${percentage(growth.change)}</strong> von ${period(growth)}. Daraus wird keine Emissionsintensität berechnet.</p>`:'<p>Keine verwendbare BIP-Veränderung gegenüber 2015 verfügbar.</p>'}${caveat}${sourceLink(c.economy.source,'Weltbank: reales BIP')}</section>`;
  const relation={absolute:'Die Wirtschaftsleistung stieg, während der territoriale Treibhausgasausstoß sank. Das beschreibt eine absolute Entkopplung in diesem Zeitraum.',relative:'Die Wirtschaft und die Emissionen wuchsen. Weil das reale BIP schneller wuchs, sank der Ausstoß je Einheit Wirtschaftsleistung: relative Entkopplung.', 'both-down':'Sowohl der Ausstoß als auch die Wirtschaftsleistung sanken. Der Emissionsrückgang fällt mit einer schrumpfenden Wirtschaft zusammen; seine Ursachen lassen sich daraus nicht bestimmen.', 'emissions-up':'Die Emissionen stiegen bei sinkender oder unveränderter Wirtschaftsleistung.', 'no-decoupling':'Die Emissionen wuchsen mindestens so schnell wie das reale BIP. Der Ausstoß je Einheit Wirtschaftsleistung sank damit nicht.',flat:'Mindestens eine der beiden Reihen blieb im Niveau unverändert. Die Einzelwerte und die Intensität beschreiben den Unterschied.'};
  const rows=comp.indexed.years.map((year,i)=>`<tr><th scope="row">${year}</th><td>${number(core.valueAt(c.emissions,year),2)}</td><td>${number(core.valueAt(c.economy,year)/1e9,2)}</td><td>${number(comp.indexed.emissions[i])}</td><td>${number(comp.indexed.gdp[i])}</td></tr>`).join('');
  const later=comp.end<2025&&Number.isFinite(core.valueAt(c.emissions,2025))?`<p class="trend-method-note">Für 2025 liegen Emissionen vor, aber kein BIP-Wert. Der gemeinsame Vergleich endet deshalb 2024. Die Emissionsreihe bis 2025 steht weiter unten.</p>`:'';
  return `<section class="detail-economy">${title}<p class="comparison-subtitle">Bisherige Veränderung im gleichen Zeitraum, preisbereinigtes BIP. Die ursprüngliche Zusage hat das jeweils angegebene eigene Ziel- und Bezugsjahr. Ist-Emissionen ohne Landnutzung.</p><div class="comparison-metrics">${pledgeMetric(c)}<div><span>TREIBHAUSGASE</span><strong class="${comp.emissionsChange>0?'trend-up':'trend-down'}">${percentage(comp.emissionsChange)}</strong><small>gesamter Ausstoß</small></div><div><span>REALES BIP</span><strong class="gdp-value">${percentage(comp.gdpChange)}</strong><small>preisbereinigte Wirtschaftsleistung</small></div><div><span>EMISSIONSINTENSITÄT</span><strong>${percentage(comp.intensityChange)}</strong><small>Treibhausgase je Einheit realem BIP</small></div></div><div class="comparison-legend"><span><i class="ghg-line"></i>Treibhausgase</span><span><i class="gdp-line"></i>Reales BIP</span><span>Index: 2015 = 100 · gemeinsame Skala</span></div><div class="comparison-chart">${comparisonChart(comp)}${comparisonChart(comp,true)}</div><div class="comparison-reading"><h4>${esc(economicLabel(c,comp))}</h4><p>${esc(relation[comp.kind]||comp.label)}</p><p>Diese Gegenüberstellung beschreibt den Verlauf. Sie misst weder den ursächlichen Effekt der Klimapolitik noch die Erfüllung der Klimazusage.</p></div>${germanGrowthNote(c)}${caveat}${later}<details class="comparison-values"><summary>Jahreswerte und Rechenweg <span aria-hidden="true">+</span></summary><div class="values-scroll" tabindex="0" role="region" aria-label="Jahreswerte für Emissionen und reales BIP"><table><caption>Nur Jahre mit Werten in beiden Reihen. BIP in Milliarden US-Dollar zu Preisen von 2015.</caption><thead><tr><th scope="col">Jahr</th><th scope="col">Mio. t CO₂e</th><th scope="col">Reales BIP</th><th scope="col">Emissionsindex</th><th scope="col">BIP-Index</th></tr></thead><tbody>${rows}</tbody></table></div><p class="trend-method-note">Veränderung der Intensität = (Emissionsindex Ende ÷ BIP-Index Ende − 1) × 100. Keine durchschnittliche jährliche Wachstumsrate. ${esc(c.emissions.precision_note||'')}</p></details><p class="comparison-source">${sourceLink(c.emissions.source,'JRC / EDGAR 2026')}${sourceLink(c.economy.source,'Weltbank / WDI: NY.GDP.MKTP.KD')}<span>BIP-Datenstand ${esc(date(c.economy.updated))} · historische Werte, teils vorläufig oder geschätzt.</span></p></section>`;
 }
 function renderMap(){
  $('world-map').innerHTML=`<svg viewBox="0 0 1000 400" role="group" aria-label="Weltkarte mit Links zu Länderakten">${data.map.map(shape=>{
   const c=countryMap.get(shape.code),path=`<path class="map-land" d="${shape.path}"><title>${esc(c?.name||shape.name)}</title></path>`;
   return c?`<a class="map-country" data-featured="${Boolean(c.review)}" href="?land=${c.code}#laender" data-open-country="${c.code}" aria-label="Länderakte ${esc(c.name)} öffnen">${path}</a>`:path;
  }).join('')}</svg>`;
 }
 function statusTag(c){return `<span class="status-tag ${c.tone==='neutral'?'':c.tone}">${esc(c.status)}</span>`;}
 function row(c){
  const comp=core.comparison(c),growth=core.economyChange(c),delta=comp?.emissionsChange??core.change(c.emissions),gdpDelta=comp?.gdpChange??growth?.change??null;
  const observation=delta!==null?`<div class="row-trend"><strong class="${delta>0?'trend-up':'trend-down'}">${percentage(delta)}</strong></div><span class="metric-period">${comp?period(comp):'2015–2025 · separat'}</span><span class="metric-note">ohne Landnutzung</span>`:'<span class="metric-missing">Keine eigenständige Reihe</span>';
  const economy=gdpDelta!==null?`<div class="row-trend"><strong class="gdp-value">${percentage(gdpDelta)}</strong></div><span class="metric-period">${comp?period(comp):period(growth)+' · separat'}</span>${comp?`<span class="metric-note intensity-note">Intensität ${percentage(comp.intensityChange)}</span>`:'<span class="metric-note">Kein gemeinsamer Vergleich</span>'}`:'<span class="metric-missing">Kein BIP-Vergleich verfügbar</span>';
  return `<article class="country-row"><button class="country-opener" data-open-country="${c.code}" aria-label="Länderakte ${esc(c.name)} öffnen" aria-haspopup="dialog"><div class="country-name-cell"><span class="country-code">${c.code}</span><div><div class="country-title">${esc(c.name)}</div><span class="country-subtitle">${esc(c.region)}${c.joint_eu?' · EU-Beitrag':''}</span></div></div><div class="country-promise" aria-label="Versprechen"><div class="row-trend"><strong class="pledge-value">${pledgeHTML(c)}</strong></div><span class="metric-period">${esc(pledgeContext(c))}</span>${c.original.metric?.note?`<span class="metric-note pledge-note">${esc(c.original.metric.note)}</span>`:''}</div><div class="country-observation" aria-label="Treibhausgase">${observation}</div><div class="country-economy" aria-label="Reales BIP">${economy}${c.economy.note?'<span class="quality-mini">Vergleich eingeschränkt</span>':''}</div><div class="country-evaluation"><div class="country-tagstack">${statusTag(c)}<span class="reviewed-mini">${c.review?'Vertiefte Zwischenbilanz':'Kein abschließender Erfüllungsnachweis'}</span>${c.quality_flag?'<span class="quality-mini">Quellenhinweis beachten</span>':''}</div><span class="row-arrow" aria-hidden="true">↗</span></div></button></article>`;
 }
 function renderResults(){
  currentResults=core.selectCountries(data.countries,state);
  const result=core.page(currentResults,state.page,18);state.page=result.page;
  $('country-results').innerHTML=result.items.map(row).join('');
  $('results-count').textContent=`${result.total} von 198 Einträgen${result.total?` · ${result.start}–${result.end} angezeigt`:''}`;
  $('empty-results').hidden=result.total!==0;$('pagination').hidden=result.total===0;
  $('previous-page').disabled=result.page===1;$('next-page').disabled=result.page===result.pages;
  $('page-indicator').textContent=`Seite ${result.page} von ${result.pages}`;
  document.querySelectorAll('[data-scope]').forEach(button=>{const active=button.dataset.scope===state.scope;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 }
 function reset(){Object.assign(state,{q:'',scope:'all',region:'all',type:'all',economy:'all',sort:'alpha',page:1});$('country-search').value='';$('region-filter').value='all';$('type-filter').value='all';$('economy-filter').value='all';$('sort-filter').value='alpha';renderResults();}
 function sourcesFor(c){
  const entries=[...(c.review?.sources||[])];
  if(c.original.metric?.source_pages?.length)entries.push({title:`Primärabgleich der Kurzkennzahl, PDF-Seiten ${c.original.metric.source_pages.join(', ')}`,url:c.original.metric.source_url});
  if(c.original.source.url)entries.push({title:'Historischer Länderbeitrag / zugeordnete Quelle',url:c.original.source.url});
  if(c.current.source.url)entries.push({title:'Original der späteren Kurzfassung',url:c.current.source.url});
  if(c.current.latest_source.url&&c.current.latest_source.url!==c.current.source.url)entries.push({title:'Neueste im Register erfasste Fassung',url:c.current.latest_source.url});
  entries.push({title:'Climate Watch: versionierte Länderangaben',url:c.current.analysis_url},{title:'EDGAR 2026: vergleichbare Emissionsschätzungen',url:c.emissions.source},{title:'Weltbank / WDI: reales BIP, konstante Preise',url:c.economy.source});
  if(c.economy.note_source)entries.push({title:'Wirtschaftlicher Sonderfall: Erfassungsgrenzen',url:c.economy.note_source});
  const used=new Set();return entries.filter(s=>safeURL(s.url)&&!used.has(s.url)&&used.add(s.url));
 }
 function showCountry(code,opener){
  const c=countryMap.get(code);if(!c)return;
  if(!dialog.open)lastOpener=opener||document.activeElement;
  const delta=core.change(c.emissions),hasTrend=delta!==null;
  const warning=[];
  if(!c.current.date_match)warning.push(`Die Kurzfassung und das neueste Registerdatum stimmen nicht überein (Kurzfassung: ${date(c.current.date)}; Register: ${date(c.current.registry_date)}). Diese Kurzfassung ist nicht automatisch die jüngste Zusage.`);
  if(c.current.conflict_note)warning.push(c.current.conflict_note);
  const observed=c.review?.observed||(hasTrend?`EDGAR schätzt für 2025 ${number(core.valueAt(c.emissions,2025))} Mio. Tonnen CO₂-Äquivalente ohne Landnutzung und Forstwirtschaft. Das entspricht ${percentage(delta)} gegenüber 2015. Ein solcher Trend ist keine Prüfung der vollständigen Zielerfüllung.`:'Für dieses Land ist in unserer EDGAR-Zuordnung keine eigenständige Emissionsreihe verfügbar. Aus Gruppenwerten wird keine Länderbilanz geschätzt.');
  const verdict=c.review?.verdict||'Die individuelle Erfüllung der ursprünglichen Zusage ist hier nicht abschließend geprüft. Ein Emissionstrend allein genügt dafür nicht: Zieljahr, Bezugsbasis, Gas- und Sektorabdeckung sowie Bedingungen müssen übereinstimmen.';
  const currentSources=sourceLink(c.current.source.url,'Original zur Kurzfassung')+sourceLink(c.current.latest_source.url,c.current.latest_source.url===c.current.source.url?'Im UNFCCC-Register':'Neuere Registerfassung')+sourceLink(c.current.source.mirror_url,'Archivkopie');
  const missingDescription=c.emissions.missing.includes('combined_series_only')?'EDGAR weist dieses Land in der verwendeten Tabelle nur gemeinsam mit weiteren Ländern aus. Eine eigenständige Emissionsreihe lässt sich daraus nicht ableiten.':'In der verwendeten EDGAR-Tabelle gibt es keine eigenständig zuordenbare Emissionsreihe für dieses Land.';
  $('dialog-content').innerHTML=`
   <div class="dialog-country-heading"><div><p class="eyebrow">${c.code} / ${esc(c.region)} / RECHERCHEREIHE PARIS</p><h2 id="dialog-title">${esc(c.name)}</h2></div>${statusTag(c)}</div>
   ${c.joint_eu?`<p class="dialog-shared">Die EU und ihre 27 Mitgliedstaaten haben einen gemeinsamen aktuellen NDC. Diese Länderakte ist keine zusätzliche eigenständige EU-Zusage.${c.code==='DEU'?' Die vertiefte deutsche Bilanz behandelt zusätzlich das nationale Klimagesetz.':''}</p>`:''}
   ${c.code==='USA'?'<p class="file-warning">Die USA sind seit dem 27. Januar 2026 aus dem Pariser Übereinkommen ausgetreten. Die Zusagen werden hier historisch dokumentiert.</p>':''}
   ${c.code==='IRN'?'<p class="file-warning">Hier wird ein INDC dokumentiert. Das ist nicht mit einem aktuellen NDC eines ratifizierten Vertragsstaats gleichzusetzen.</p>':''}
   ${c.code==='YEM'?'<p class="file-warning">Parteistatus und Einreichungsstand müssen gesondert betrachtet werden; ein Datenbankeintrag allein belegt keine Ratifikation.</p>':''}
   ${warning.length?`<div class="file-warning">${warning.map(esc).join('<br>')}</div>`:''}
   <div class="dialog-columns"><section><h3 class="dialog-section-label"><span>01</span> DAMALS VERSPROCHEN</h3><div class="dialog-source-date">${c.original.date?'Register-/Quelldatum: '+date(c.original.date):'Historischer Stand nicht eindeutig datiert'}</div><p>${esc(c.original.summary)}</p>${sourceLink(c.original.source.url,'Historische Quelle')}${sourceLink(c.original.source.mirror_url,'Archivkopie')}</section><section><h3 class="dialog-section-label"><span>02</span> BISHER BEOBACHTET</h3><div class="dialog-source-date">${c.review?'Vertiefte Zwischenbilanz':'Vergleichbare Daten bis 2025'}</div><p>${esc(observed)}</p>${c.review?c.review.sources.slice(0,2).map(s=>sourceLink(s.url,'Primärquelle')).join(''):sourceLink(c.emissions.source,'EDGAR 2026')}</section></div>
   <section class="detail-assessment"><h3>${c.review?'Was lässt sich daraus schließen?':'Wo die Prüfung offenbleibt'}</h3>${c.review?`<p class="review-benchmark"><strong>Maßstab dieser Zwischenbilanz:</strong> ${esc(c.review.promise)}</p>`:''}<p>${esc(verdict)}</p><p class="limit">${esc(c.review?.limit||'2030 und 2035 sind noch nicht fällig. Aus einem bezifferten Ziel folgt keine absolute Senkung, wenn es sich auf ein Wachstumsszenario oder die Wirtschaftsleistung bezieht.')}</p></section>
   ${economySection(c)}
   <details class="detail-trend"><summary>Die Emissionsmengen in absoluten Zahlen <span aria-hidden="true">+</span></summary><p>Alle erfassten Treibhausgase, ohne Landnutzung und Forstwirtschaft. Keine NDC-Erfüllungsquote.</p>${hasTrend?`<div class="country-chart">${lineChart(c.emissions.years,c.emissions.values)}</div><div class="trend-legend"><span>Mio. Tonnen CO₂-Äquivalente</span><span>2015–2025 · JRC / EDGAR 2026</span></div><p class="trend-method-note">Harmonisierte EDGAR-Schätzungen können von nationalen Inventaren im Befund oben abweichen. Die Zahlen werden hier nicht miteinander verrechnet.</p>`:`<p class="trend-unavailable">${esc(missingDescription)} Die Einzelwerte bleiben offen.</p>`}</details>
   <section class="detail-current"><h3>Wie die Zusage später weitergeschrieben wurde</h3><div class="detail-type">STAND DER KURZFASSUNG: ${esc(date(c.current.date))} / ${esc(c.current.type)}</div><p>${esc(c.current.summary)}</p>${currentSources}</section>
   <details class="detail-quality"><summary>Versionsprüfung und Quellen im Detail <span aria-hidden="true">+</span></summary><p><strong>Historische Fassung:</strong> ${esc(c.original.quality)}</p><p><strong>Spätere Fassung:</strong> ${esc(c.current.quality)} ${esc(c.current.conflict_note||'Ein übereinstimmendes Registerdatum ersetzt keine vollständige unabhängige Originalprüfung.')}</p><p>Kurzzusagen nach Climate Watch NDC Content, WRI, mit Übersetzung, Verdichtung und markierten Korrekturen. CC BY-NC 4.0. Eine vollständige Übersetzung aller NDC-Seiten ist nicht enthalten.</p><ol class="detail-source-list">${sourcesFor(c).map(s=>`<li>${sourceLink(s.url,s.title,'')}</li>`).join('')}</ol></details>`;
  if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}
  dialog.scrollTop=0;
  const url=new URL(location.href);url.searchParams.set('land',code);history.replaceState({country:code},'',url);
  $('copy-country-link').textContent='Link kopieren ↗';
 }
 function closeCountry(){if(dialog.open)dialog.close();}
 dialog.addEventListener('close',()=>{
  document.body.classList.remove('modal-open');
  const url=new URL(location.href);url.searchParams.delete('land');history.replaceState({},'',url);
  if(lastOpener?.isConnected)lastOpener.focus({preventScroll:true});
 });
 dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeCountry();}});
 $('close-dialog').addEventListener('click',closeCountry);
 $('copy-country-link').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(location.href);$('copy-country-link').textContent='Link kopiert ✓';showToast('Link zur Länderakte kopiert.');}
  catch{showToast('Den Link können Sie aus der Adresszeile kopieren.');}
 });
 function showToast(text){clearTimeout(toastTimeout);$('toast').textContent=text;$('toast').hidden=false;toastTimeout=setTimeout(()=>$('toast').hidden=true,3500);}
 function renderHighlights(){
  $('highlights').innerHTML=data.highlights.map((h,i)=>`<article class="highlight"><div class="highlight-kicker">${esc(h.kicker)}<span>${String(i+1).padStart(2,'0')}</span></div><h3>${esc(h.title)}</h3><p>${esc(h.body)}</p><div class="highlight-stat">${esc(h.stat)}</div><div class="highlight-stat-label">${esc(h.stat_label)}</div><button data-open-country="${h.code}" aria-label="Länderakte ${esc(countryMap.get(h.code).name)} öffnen">Zur Länderakte <span aria-hidden="true">↗</span></button></article>`).join('');
 }
 function renderEconomyCases(){
  const comparisons=data.countries.map(c=>core.comparison(c)).filter(Boolean),full=comparisons.filter(c=>c.end===2025).length;
  $('comparison-coverage').textContent=comparisons.length;
  $('comparison-periods').textContent=`${full} bis 2025 · ${comparisons.length-full} bis 2024 · ${198-comparisons.length} offen`;
  const notes={DEU:'Nur 0,74 % reales Wachstum pro Jahr seit 2015. Seit 2019 nahezu Stagnation; ab 2022 sinken BIP und Emissionen. Zeiträume getrennt betrachten.',CHN:'Beide wachsen, der Ausstoß langsamer. Die Intensität sinkt, obwohl die Gesamtemissionen steigen.',UKR:'Beide gesunken. Krieg und veränderte Gebietserfassung schränken den Vergleich ein.'};
  $('economy-cases').innerHTML=['DEU','CHN','UKR'].map(code=>{const c=countryMap.get(code),comp=core.comparison(c);if(!comp)return '';return `<article class="economy-case"><button data-open-country="${code}" aria-label="Wirtschaft und Emissionen in ${esc(c.name)} vergleichen"><span class="case-topline"><span>${esc(c.name)}</span><span>${period(comp)} ↗</span></span><span class="case-metrics"><span><small>VERSPRECHEN</small><strong class="pledge-value">${pledgeHTML(c)}</strong></span><span><small>TREIBHAUSGASE</small><strong>${percentage(comp.emissionsChange)}</strong></span><span><small>REALES BIP</small><strong>${percentage(comp.gdpChange)}</strong></span></span><span class="case-pledge-basis">${esc(pledgeContext(c))}</span><span class="case-note">${esc(notes[code])}</span></button></article>`;}).join('');
 }
 function renderSummary(){
  const s=core.summarize(data.countries);
  $('summary-stats').innerHTML=`<article><span>KLIMAZUSAGEN</span><strong>${s.documentedPledges}</strong><h3>historische Beiträge dokumentiert</h3><p>Von ${s.countries} länderspezifischen Einträgen. Ein ursprünglicher Beitrag bleibt im Analysebestand offen: Libyen.</p></article><article><span>OHNE ERFASSTE EMISSIONSQUOTE</span><strong>${s.noQuota}</strong><h3>Das bedeutet nicht „kein Versprechen“.</h3><p>Hier stehen etwa Maßnahmen oder Ausbauziele. Eine Zahl für Länder ganz ohne Klimazusage ist damit nicht belegt.</p></article><article><span>ERREICHTE TEILZIELE BELEGT</span><strong>${s.partialMetCountries}</strong><h3>China und Indien</h3><p>Mindestens ein Teilziel aus ursprünglichen oder späteren Zusagen. Das ist keine vollständig erfüllte Gesamt-NDC.</p></article>`;
  const segments=[['Auswertbare Emissionszielzahl',s.clearQuantified,'clear'],['Keine Emissionsquote erfasst',s.noQuota,'no-quota'],['Kennzahl oder Bezugsbasis offen',s.unresolvedMetrics,'unresolved']];
  $('summary-pledges').innerHTML=`<div class="summary-bar" role="img" aria-label="${segments.map(([label,n])=>`${n}: ${label}`).join('; ')}">${segments.map(([,n,kind])=>`<span class="${kind}" style="width:${n/s.countries*100}%"></span>`).join('')}</div><dl class="summary-list">${segments.map(([label,n,kind])=>`<div><dt><i class="summary-key ${kind}"></i>${label}</dt><dd>${n}</dd></div>`).join('')}</dl><p class="summary-small">Zusammen ${s.countries} Länder-/Territorieneinträge. ${s.quantified} enthalten eine bezifferte Emissionskennzahl; bei einem davon ist die Bezugsbasis ungeklärt. Dieser Fall wird oben den offenen Kennzahlen zugerechnet. „Keine Quote“ kann trotzdem messbare Energie-, Senken- oder Ausbauziele enthalten.</p>`;
  $('summary-outcomes').innerHTML=`<dl class="summary-list outcomes-list"><div><dt>Gesamtzusage vollständig erfüllt</dt><dd>Gesamtzahl offen</dd></div><div><dt>Gesamtzusage endgültig verfehlt</dt><dd>Gesamtzahl offen</dd></div><div><dt>Mindestens ein Teilziel nachweislich erreicht</dt><dd>${s.partialMetCountries} Länder</dd></div></dl><p class="summary-small">Die bisherigen Vertiefungsprüfungen belegen weder eine vollständige Gesamt-NDC-Erfüllung noch eine abschließende Gesamt-NDC-Verfehlung. Das ist die Nachweislage dieses Dossiers, keine weltweite Nullbilanz. Ziele für 2030 oder 2035 sind noch nicht fällig.</p><div class="summary-case-links"><button data-open-country="CHN">China: Ausbauziel ↗</button><button data-open-country="IND">Indien: Intensität und Stromleistung ↗</button></div><p class="summary-small">Chinas belegtes Wind-/Solarziel wurde 2021 ergänzt. Indien erreichte unter anderem die ursprüngliche Intensitätsquote. Ausschließlich bei Erstzusagen ist damit hier ein Land mit erreichtem Teilziel belegt.</p>`;
  $('summary-limits').innerHTML=`<strong>Zählbasis:</strong> ${s.countries} länderspezifische Einträge, die EU wird hier nicht zusätzlich als Land gezählt. EU-Mitgliedstaaten teilen einen Beitrag; diese Zahlen sind keine Anzahl unabhängiger NDCs. <strong>Prüfabdeckung:</strong> ${s.reviewedCountries} Länder und die EU wurden vertieft untersucht; für ${s.unreviewedCountries} weitere Länder fehlt die umfassende Erfüllungsprüfung. Sinkende Emissionen oder eine bessere Emissionsintensität ersetzen diese Prüfung nicht.`;
 }
 function renderEconomicContext(){
  const text=data.economic_context.de,c=countryMap.get('DEU'),windows=[[2015,2025],[2019,2025],[2022,2025]].map(([start,end])=>periodMetrics(c,start,end));
  $('economic-context-content').innerHTML=`<h2 id="economic-context-title">${esc(text.title)}</h2><p class="economic-context-intro">${esc(text.intro)}</p><div class="economic-context-grid"><div><div class="values-scroll" role="region" aria-label="Deutschland nach Vergleichszeitraum" tabindex="0"><table class="economic-period-table"><caption>Veränderungen insgesamt; BIP preisbereinigt, Treibhausgase ohne Landnutzung.</caption><thead><tr><th scope="col">Zeitraum</th><th scope="col">Reales BIP</th><th scope="col">Treibhausgase</th><th scope="col">BIP pro Jahr*</th></tr></thead><tbody>${windows.map(p=>`<tr><th scope="row">${p.start}–${p.end}</th><td>${percentage(p.gdp)}</td><td>${percentage(p.emissions)}</td><td>${number(p.annualGDP,2)} %</td></tr>`).join('')}</tbody></table></div><p class="source-note">* Geometrischer Jahresdurchschnitt (CAGR). Zeitfenster überlappen; sie sind keine nachgewiesenen Wirkungszeiträume einzelner Maßnahmen.</p><p>${esc(text.body[0])}</p><p>${esc(text.body[1])}</p></div><div><h3>Wachstumsschwäche und Emissionsrückgang</h3><p>${esc(text.body[3])}</p><p>${esc(text.body[4])}</p><details><summary>Industrie, Investitionen und Produktivität <span aria-hidden="true">+</span></summary><p>${esc(text.body[2])}</p></details><details><summary>Daten und Quellen <span aria-hidden="true">+</span></summary><p>${esc(text.body[5])}</p><ul>${text.sources.map(source=>`<li>${sourceLink(source.url,source.title,'')}</li>`).join('')}</ul></details></div></div>`;
 }
 const examples={
  absolute:{title:'ABSOLUTE MINDERUNG',bars:[['Basisjahr',100],['Zieljahr',70]],max:200,text:'30 % weniger als 100 Einheiten im Basisjahr bedeutet: <strong>höchstens 70 Einheiten</strong> im Zieljahr. Die absolute Emissionsmenge muss sinken.'},
  bau:{title:'MINDERUNG GEGENÜBER EINEM SZENARIO',bars:[['Heute',100],['Ohne Maßnahmen',200],['Ziel: −30 %',140]],max:200,text:'Das Wachstumsszenario steigt auf 200 Einheiten. 30 % darunter erlaubt <strong>140 Einheiten</strong> – also 40 % mehr als heute.'},
  intensity:{title:'EMISSIONEN JE WIRTSCHAFTSLEISTUNG',bars:[['Heute',100],['Nach Wachstum',120]],max:200,text:'Die Emissionsintensität sinkt um 40 %, das BIP verdoppelt sich. Die Rechnung lautet 100 × 0,6 × 2 = <strong>120 Einheiten</strong>. Trotz des erreichten Intensitätsziels steigen die Gesamtemissionen.'}
 };
 function renderExample(name){
  const ex=examples[name];$('explainer-chart').innerHTML=`<div class="example-eyebrow">${ex.title}</div><div class="example-bars">${ex.bars.map(([label,value])=>`<div class="example-bar"><b>${value}</b><i style="height:${value/ex.max*95}px"></i><span>${label}</span></div>`).join('')}</div><p class="example-description">${ex.text}</p>`;
  document.querySelectorAll('[data-example]').forEach(b=>{const on=b.dataset.example===name;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});
 }
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-show-economic]')){closeCountry();$('wirtschaft').scrollIntoView({behavior:'smooth'});return;}
  const country=event.target.closest('[data-open-country]');if(country){event.preventDefault();showCountry(country.dataset.openCountry,country);return;}
  const filter=event.target.closest('[data-scope]');if(filter){state.scope=filter.dataset.scope;state.page=1;renderResults();return;}
  const example=event.target.closest('[data-example]');if(example)renderExample(example.dataset.example);
 });
 $('country-search').addEventListener('input',event=>{state.q=event.target.value;state.page=1;renderResults();});
 for(const [id,key] of [['region-filter','region'],['type-filter','type'],['economy-filter','economy'],['sort-filter','sort']])$(id).addEventListener('change',event=>{state[key]=event.target.value;state.page=1;renderResults();});
 $('reset-filters').addEventListener('click',()=>{reset();$('country-search').focus();});
 $('previous-page').addEventListener('click',()=>{state.page--;renderResults();$('laender').scrollIntoView({behavior:'smooth',block:'start'});});
 $('next-page').addEventListener('click',()=>{state.page++;renderResults();$('laender').scrollIntoView({behavior:'smooth',block:'start'});});
 $('download-csv').addEventListener('click',()=>{
  const blob=new Blob([core.toCSV(currentResults)],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Paris-Laenderauswahl-2026.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(`${currentResults.length} Einträge als CSV exportiert.`);
 });
 renderMap();renderResults();renderSummary();renderEconomicContext();renderEconomyCases();renderHighlights();renderExample('absolute');
 $('global-chart').innerHTML=lineChart(data.global.years,data.global.values,{global:true});
 const gChange=core.change(data.global.values);$('global-change').innerHTML=`+${number(gChange)}<span>%</span>`;
 const initial=new URLSearchParams(location.search).get('land');if(initial&&countryMap.has(initial.toUpperCase()))showCountry(initial.toUpperCase());
})();
