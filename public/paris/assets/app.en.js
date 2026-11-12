(function(){
 'use strict';
 const data=window.DOSSIER_DATA_EN,core=window.DossierCore;
 const $=id=>document.getElementById(id);
 if(!data||!core){$('results-count').textContent='The country data could not be loaded. PDF and Excel files are available under Sources and method.';return;}
 const number=(v,d=1)=>new Intl.NumberFormat('en-GB',{minimumFractionDigits:d,maximumFractionDigits:d}).format(v);
 const percentage=v=>v===null?'No separate series':`${v>0?'+':''}${number(v)} %`;
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const safeURL=value=>typeof value==='string'&&/^https:\/\//.test(value)?value:null;
 const date=value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')?new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z')):'Date not reliably assigned';
 const sourceLink=(url,label,css='inline-source')=>safeURL(url)?`<a class="${css}" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`:'';
 const countryMap=new Map(data.countries.map(c=>[c.code,c]));
 const regionName=value=>({Europa:'Europe',Asien:'Asia',Afrika:'Africa',Amerika:'Americas',Ozeanien:'Oceania'})[value]||value;
 const comparisonLabel=comp=>({
  'Absolute territoriale Entkopplung':'Absolute territorial decoupling',
  'Relative territoriale Entkopplung':'Relative territorial decoupling',
  'Stabile Emissionen bei wachsendem realem BIP':'Stable emissions with growing real GDP',
  'Keine Entkopplung bei wachsendem realem BIP':'No decoupling with growing real GDP',
  'Emissionsrückgang bei schrumpfendem realem BIP':'Falling emissions with contracting real GDP',
  'Steigende Emissionen bei schrumpfendem realem BIP':'Rising emissions with contracting real GDP',
  'Stabile Emissionen bei schrumpfendem realem BIP':'Stable emissions with contracting real GDP',
  'Steigende Emissionen bei stagnierendem realem BIP':'Rising emissions with stagnant real GDP',
  'Sinkende Emissionen bei stagnierendem realem BIP':'Falling emissions with stagnant real GDP',
  'Reales BIP und Emissionen unverändert':'Real GDP and emissions unchanged'
 })[comp?.label]||'Emissions and economic output';
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
  const description=points.map(p=>`${p.year}: ${number(p.value)} ${global?'billion':'million'} tonnes of CO₂ equivalent`).join('; ');
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
  const description=`Shared scale, 2015 = 100. ${years.map((year,i)=>`${year}: Greenhouse gases ${number(emissions[i])}, real GDP ${number(gdp[i])}`).join('; ')}`;
  return `<svg class="${compact?'chart-mobile':'chart-desktop'}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(description)}"><title>${esc(description)}</title>${grid}<line x1="${left}" x2="${w-right}" y1="${y(100)}" y2="${y(100)}" stroke="#899184" stroke-dasharray="4 4"/>${series(emissions,'#bf422d')}${series(gdp,'#28615e')}${labels}</svg>`;
 }
 const period=metric=>`${metric.start}–${metric.end}`;
 function periodMetrics(c,start,end){
  const g0=core.valueAt(c.economy,start),g1=core.valueAt(c.economy,end),e0=core.valueAt(c.emissions,start),e1=core.valueAt(c.emissions,end);
  if(!(g0>0)||!(g1>0)||!(e0>0)||!Number.isFinite(e1))return null;
  return {start,end,gdp:(g1/g0-1)*100,emissions:(e1/e0-1)*100,annualGDP:((g1/g0)**(1/(end-start))-1)*100};
 }
 const pledgeValue=c=>c.original.metric?.value==='Keine Quote'?'—':c.original.metric?.value==='Offen'?'Open':String(c.original.metric?.value||'Open').replace(/^bis zu /,'up to ').replace(/^rund /,'about ').replace(/(\d),(\d)/g,'$1.$2');
 const pledgeHTML=c=>esc(pledgeValue(c)).replace(/(\d)–(?=\d)/g,'$1–<wbr>').replace(/ %/g,'&nbsp;%');
 function pledgeContext(c){
  const metric=c.original.metric;
  if(!metric)return 'Summary metric not yet assigned';
  return [metric.value==='Keine Quote'?'No emissions quota recorded':null,metric.basis].filter(Boolean).join(' · ');
 }
 function pledgeMetric(c){return `<div class="pledge-metric"><span>PLEDGE</span><strong class="pledge-value">${pledgeHTML(c)}</strong><small>${esc(pledgeContext(c))}</small>${c.original.metric?.note?`<small>${esc(c.original.metric.note)}</small>`:''}</div>`;}
 function economicLabel(c,comp){return c.economy.note?'Comparison limited':comp?comparisonLabel(comp):'Matching comparison unresolved';}
 function germanGrowthNote(c){
  if(c.code!=='DEU')return '';
  const recent=periodMetrics(c,2019,2025),latest=periodMetrics(c,2022,2025);
  return `<aside class="germany-growth-note"><strong>The decade-wide figure conceals the recent stagnation.</strong><p>Real GDP 2019–2025: ${percentage(recent.gdp)}; 2022–2025: ${percentage(latest.gdp)}. Falling emissions have recently coincided with weak or contracting economic output. That does not establish any particular cause.</p><button class="text-link" data-show-economic>Periods and economic conditions explained ↗</button></aside>`;
 }
 function economySection(c){
  const comp=core.comparison(c),growth=core.economyChange(c);
  const caveat=c.economy.note?`<p class="economy-caveat">${esc(c.economy.note)} ${sourceLink(c.economy.note_source,'IMF: coverage limitations')}</p>`:'';
  const title=`<div class="comparison-heading"><div><span class="eyebrow">${esc(c.name.toLocaleUpperCase('en-GB'))} / ECONOMIC CONTEXT</span><h3>Emissions and the economy since Paris</h3></div>`+(comp?`<span class="comparison-period">${period(comp)} · ${comp.years} years</span>`:'')+'</div>';
  if(!comp)return `<section class="detail-economy">${title}<div class="comparison-metrics pledge-only">${pledgeMetric(c)}</div><p class="comparison-missing">No matching comparison is available for 2015–2024 or 2015–2025. ${core.change(c.emissions)===null?'A separate emissions series is unavailable.':'The matching GDP values are unavailable.'}</p>${growth?`<p>Separately available economic change: <strong>real GDP ${percentage(growth.change)}</strong> over ${period(growth)}. No emissions intensity is calculated from this alone.</p>`:'<p>No usable GDP change relative to 2015 is available.</p>'}${caveat}${sourceLink(c.economy.source,'World Bank: real GDP')}</section>`;
  const relation={absolute:'Economic output grew while territorial greenhouse gas emissions fell. This describes absolute decoupling over this period.',relative:'The economy and emissions both grew. Because real GDP grew faster, emissions per unit of output fell: relative decoupling.', 'both-down':'Both emissions and economic output declined. The emissions reduction coincides with a contracting economy; this alone does not establish its causes.', 'emissions-up':'Emissions rose while economic output declined or remained unchanged.', 'no-decoupling':'Emissions grew at least as fast as real GDP. Emissions per unit of economic output therefore did not decline.',flat:'At least one of the two series remained unchanged in level. The individual values and intensity show the difference.'};
  const rows=comp.indexed.years.map((year,i)=>`<tr><th scope="row">${year}</th><td>${number(core.valueAt(c.emissions,year),2)}</td><td>${number(core.valueAt(c.economy,year)/1e9,2)}</td><td>${number(comp.indexed.emissions[i])}</td><td>${number(comp.indexed.gdp[i])}</td></tr>`).join('');
  const later=comp.end<2025&&Number.isFinite(core.valueAt(c.emissions,2025))?`<p class="trend-method-note">Emissions are available for 2025, but GDP is not. The matching comparison therefore ends in 2024. The emissions series through 2025 appears below.</p>`:'';
  return `<section class="detail-economy">${title}<p class="comparison-subtitle">Observed changes over the same period, with price-adjusted GDP. The original pledge has its own stated target year and benchmark. Observed emissions exclude land use.</p><div class="comparison-metrics">${pledgeMetric(c)}<div><span>GREENHOUSE GASES</span><strong class="${comp.emissionsChange>0?'trend-up':'trend-down'}">${percentage(comp.emissionsChange)}</strong><small>total emissions</small></div><div><span>REAL GDP</span><strong class="gdp-value">${percentage(comp.gdpChange)}</strong><small>inflation-adjusted economic output</small></div><div><span>EMISSIONS INTENSITY</span><strong>${percentage(comp.intensityChange)}</strong><small>Greenhouse gases per unit of real GDP</small></div></div><div class="comparison-legend"><span><i class="ghg-line"></i>Greenhouse gases</span><span><i class="gdp-line"></i>Real GDP</span><span>Index: 2015 = 100 · shared scale</span></div><div class="comparison-chart">${comparisonChart(comp)}${comparisonChart(comp,true)}</div><div class="comparison-reading"><h4>${esc(economicLabel(c,comp))}</h4><p>${esc(relation[comp.kind]||comparisonLabel(comp))}</p><p>This comparison describes the trend. It measures neither the causal effect of climate policy nor fulfilment of the climate pledge.</p></div>${germanGrowthNote(c)}${caveat}${later}<details class="comparison-values"><summary>Annual values and calculation <span aria-hidden="true">+</span></summary><div class="values-scroll" tabindex="0" role="region" aria-label="Annual emissions and real GDP values"><table><caption>Only years with observations in both series. GDP in billions of US dollars at 2015 prices.</caption><thead><tr><th scope="col">Year</th><th scope="col">million t CO₂e</th><th scope="col">Real GDP</th><th scope="col">Emissions index</th><th scope="col">GDP index</th></tr></thead><tbody>${rows}</tbody></table></div><p class="trend-method-note">Intensity change = (end-year emissions index ÷ end-year GDP index − 1) × 100. This is not an average annual growth rate. ${esc(c.emissions.precision_note||'')}</p></details><p class="comparison-source">${sourceLink(c.emissions.source,'JRC / EDGAR 2026')}${sourceLink(c.economy.source,'World Bank / WDI: NY.GDP.MKTP.KD')}<span>GDP data as of ${esc(date(c.economy.updated))} · historical values, some provisional or estimated.</span></p></section>`;
 }
 function renderMap(){
  $('world-map').innerHTML=`<svg viewBox="0 0 1000 400" role="group" aria-label="World map with links to country records">${data.map.map(shape=>{
   const c=countryMap.get(shape.code),path=`<path class="map-land" d="${shape.path}"><title>${esc(c?.name||shape.name)}</title></path>`;
   return c?`<a class="map-country" data-featured="${Boolean(c.review)}" href="?land=${c.code}#laender" data-open-country="${c.code}" aria-label="Open the country record for ${esc(c.name)}">${path}</a>`:path;
  }).join('')}</svg>`;
 }
 function statusTag(c){return `<span class="status-tag ${c.tone==='neutral'?'':c.tone}">${esc(c.status)}</span>`;}
 function row(c){
  const comp=core.comparison(c),growth=core.economyChange(c),delta=comp?.emissionsChange??core.change(c.emissions),gdpDelta=comp?.gdpChange??growth?.change??null;
  const observation=delta!==null?`<div class="row-trend"><strong class="${delta>0?'trend-up':'trend-down'}">${percentage(delta)}</strong></div><span class="metric-period">${comp?period(comp):'2015–2025 · separate'}</span><span class="metric-note">excluding land use</span>`:'<span class="metric-missing">No separate series</span>';
  const economy=gdpDelta!==null?`<div class="row-trend"><strong class="gdp-value">${percentage(gdpDelta)}</strong></div><span class="metric-period">${comp?period(comp):period(growth)+' · separate'}</span>${comp?`<span class="metric-note intensity-note">Intensity ${percentage(comp.intensityChange)}</span>`:'<span class="metric-note">No matching comparison</span>'}`:'<span class="metric-missing">No GDP comparison available</span>';
  return `<article class="country-row"><button class="country-opener" data-open-country="${c.code}" aria-label="Open the country record for ${esc(c.name)}" aria-haspopup="dialog"><div class="country-name-cell"><span class="country-code">${c.code}</span><div><div class="country-title">${esc(c.name)}</div><span class="country-subtitle">${esc(regionName(c.region))}${c.joint_eu?' · EU contribution':''}</span></div></div><div class="country-promise" aria-label="Pledge"><div class="row-trend"><strong class="pledge-value">${pledgeHTML(c)}</strong></div><span class="metric-period">${esc(pledgeContext(c))}</span>${c.original.metric?.note?`<span class="metric-note pledge-note">${esc(c.original.metric.note)}</span>`:''}</div><div class="country-observation" aria-label="Greenhouse gases">${observation}</div><div class="country-economy" aria-label="Real GDP">${economy}${c.economy.note?'<span class="quality-mini">Comparison limited</span>':''}</div><div class="country-evaluation"><div class="country-tagstack">${statusTag(c)}<span class="reviewed-mini">${c.review?'In-depth progress review':'No conclusive fulfilment assessment'}</span>${c.quality_flag?'<span class="quality-mini">See source caveat</span>':''}</div><span class="row-arrow" aria-hidden="true">↗</span></div></button></article>`;
 }
 function renderResults(){
  currentResults=core.selectCountries(data.countries,state);
  const result=core.page(currentResults,state.page,18);state.page=result.page;
  $('country-results').innerHTML=result.items.map(row).join('');
  $('results-count').textContent=`${result.total} of 198 entries${result.total?` · showing ${result.start}–${result.end}`:''}`;
  $('empty-results').hidden=result.total!==0;$('pagination').hidden=result.total===0;
  $('previous-page').disabled=result.page===1;$('next-page').disabled=result.page===result.pages;
  $('page-indicator').textContent=`Page ${result.page} of ${result.pages}`;
  document.querySelectorAll('[data-scope]').forEach(button=>{const active=button.dataset.scope===state.scope;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 }
 function reset(){Object.assign(state,{q:'',scope:'all',region:'all',type:'all',economy:'all',sort:'alpha',page:1});$('country-search').value='';$('region-filter').value='all';$('type-filter').value='all';$('economy-filter').value='all';$('sort-filter').value='alpha';renderResults();}
 function sourcesFor(c){
  const entries=[...(c.review?.sources||[])];
  if(c.original.metric?.source_pages?.length)entries.push({title:`Summary metric checked against the original, PDF pages ${c.original.metric.source_pages.join(', ')}`,url:c.original.metric.source_url});
  if(c.original.source.url)entries.push({title:'Historical country contribution / assigned source',url:c.original.source.url});
  if(c.current.source.url)entries.push({title:'Original document for the later summary',url:c.current.source.url});
  if(c.current.latest_source.url&&c.current.latest_source.url!==c.current.source.url)entries.push({title:'Latest version recorded in the registry',url:c.current.latest_source.url});
  entries.push({title:'Climate Watch: versioned country information',url:c.current.analysis_url},{title:'EDGAR 2026: comparable emissions estimates',url:c.emissions.source},{title:'World Bank / WDI: real GDP at constant prices',url:c.economy.source});
  if(c.economy.note_source)entries.push({title:'Special economic case: coverage limitations',url:c.economy.note_source});
  const used=new Set();return entries.filter(s=>safeURL(s.url)&&!used.has(s.url)&&used.add(s.url));
 }
 function showCountry(code,opener){
  const c=countryMap.get(code);if(!c)return;
  if(!dialog.open)lastOpener=opener||document.activeElement;
  const delta=core.change(c.emissions),hasTrend=delta!==null;
  const warning=[];
  if(!c.current.date_match)warning.push(`The summary date does not match the latest registry date (summary: ${date(c.current.date)}; registry: ${date(c.current.registry_date)}). This summary is not necessarily the most recent pledge.`);
  if(c.current.conflict_note)warning.push(c.current.conflict_note);
  const observed=c.review?.observed||(hasTrend?`EDGAR estimates 2025 emissions at ${number(core.valueAt(c.emissions,2025))} million tonnes of CO₂ equivalent excluding land use and forestry. This represents ${percentage(delta)} relative to 2015. Such a trend is not an assessment of complete target fulfilment.`:'Our EDGAR mapping does not provide a separate emissions series for this country. Country totals are not estimated from grouped values.');
  const verdict=c.review?.verdict||'Fulfilment of this country’s original pledge has not been conclusively assessed here. An emissions trend alone is insufficient: target year, benchmark, gas and sector coverage, and conditions must match.';
  const currentSources=sourceLink(c.current.source.url,'Original source for the summary')+sourceLink(c.current.latest_source.url,c.current.latest_source.url===c.current.source.url?'In the UNFCCC registry':'Newer registry version')+sourceLink(c.current.source.mirror_url,'Archived copy');
  const missingDescription=c.emissions.missing.includes('combined_series_only')?'The EDGAR table used here groups this country with other countries. A separate emissions series cannot be derived from it.':'The EDGAR table used here has no separately identifiable emissions series for this country.';
  $('dialog-content').innerHTML=`
   <div class="dialog-country-heading"><div><p class="eyebrow">${c.code} / ${esc(regionName(c.region))} / PARIS RESEARCH SERIES</p><h2 id="dialog-title">${esc(c.name)}</h2></div>${statusTag(c)}</div>
   ${c.joint_eu?`<p class="dialog-shared">The EU and its 27 member states share a joint current NDC. This country record is not an additional independent EU pledge.${c.code==='DEU'?' The in-depth German review also covers the national Climate Change Act.':''}</p>`:''}
   ${c.code==='USA'?'<p class="file-warning">The United States withdrew from the Paris Agreement effective 27 January 2026. Its pledges are documented here as historical contributions.</p>':''}
   ${c.code==='IRN'?'<p class="file-warning">This record documents an INDC. It is not equivalent to a current NDC from a state that has ratified the agreement.</p>':''}
   ${c.code==='YEM'?'<p class="file-warning">Party status and submission status must be considered separately; a database entry alone does not establish ratification.</p>':''}
   ${warning.length?`<div class="file-warning">${warning.map(esc).join('<br>')}</div>`:''}
   <div class="dialog-columns"><section><h3 class="dialog-section-label"><span>01</span> THE ORIGINAL PLEDGE</h3><div class="dialog-source-date">${c.original.date?'Registry/source date: '+date(c.original.date):'Historical version not reliably dated'}</div><p>${esc(c.original.summary)}</p>${sourceLink(c.original.source.url,'Historical source')}${sourceLink(c.original.source.mirror_url,'Archived copy')}</section><section><h3 class="dialog-section-label"><span>02</span> OBSERVED SO FAR</h3><div class="dialog-source-date">${c.review?'In-depth progress review':'Comparable data through 2025'}</div><p>${esc(observed)}</p>${c.review?c.review.sources.slice(0,2).map(s=>sourceLink(s.url,'Primary source')).join(''):sourceLink(c.emissions.source,'EDGAR 2026')}</section></div>
   <section class="detail-assessment"><h3>${c.review?'What can be concluded?':'Where the assessment remains open'}</h3>${c.review?`<p class="review-benchmark"><strong>Benchmark for this progress review:</strong> ${esc(c.review.promise)}</p>`:''}<p>${esc(verdict)}</p><p class="limit">${esc(c.review?.limit||'2030 and 2035 targets are not yet due. A quantified target need not imply an absolute decline if its benchmark is a growth scenario or economic output.')}</p></section>
   ${economySection(c)}
   <details class="detail-trend"><summary>Emissions in absolute quantities <span aria-hidden="true">+</span></summary><p>All greenhouse gases covered, excluding land use and forestry. This is not an NDC fulfilment rate.</p>${hasTrend?`<div class="country-chart">${lineChart(c.emissions.years,c.emissions.values)}</div><div class="trend-legend"><span>Million tonnes of CO₂ equivalent</span><span>2015–2025 · JRC / EDGAR 2026</span></div><p class="trend-method-note">Harmonised EDGAR estimates may differ from the national inventories cited above. These figures are not combined in calculations here.</p>`:`<p class="trend-unavailable">${esc(missingDescription)} Individual country values remain unavailable.</p>`}</details>
   <section class="detail-current"><h3>How the pledge was updated</h3><div class="detail-type">SUMMARY VERSION: ${esc(date(c.current.date))} / ${esc(c.current.type)}</div><p>${esc(c.current.summary)}</p>${currentSources}</section>
   <details class="detail-quality"><summary>Version checks and detailed sources <span aria-hidden="true">+</span></summary><p><strong>Historical version:</strong> ${esc(c.original.quality)}</p><p><strong>Later version:</strong> ${esc(c.current.quality)} ${esc(c.current.conflict_note||'A matching registry date does not replace a complete independent review of the original.')}</p><p>Pledge summaries based on Climate Watch NDC Content, WRI, translated and condensed with marked corrections. CC BY-NC 4.0. A complete translation of every NDC page is not included.</p><ol class="detail-source-list">${sourcesFor(c).map(s=>`<li>${sourceLink(s.url,s.title,'')}</li>`).join('')}</ol></details>`;
  if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}
  dialog.scrollTop=0;
  const url=new URL(location.href);url.searchParams.set('land',code);history.replaceState({country:code},'',url);
  $('copy-country-link').textContent='Copy link ↗';
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
  try{await navigator.clipboard.writeText(location.href);$('copy-country-link').textContent='Link copied ✓';showToast('Country record link copied.');}
  catch{showToast('You can copy the link from the address bar.');}
 });
 function showToast(text){clearTimeout(toastTimeout);$('toast').textContent=text;$('toast').hidden=false;toastTimeout=setTimeout(()=>$('toast').hidden=true,3500);}
 function renderHighlights(){
  $('highlights').innerHTML=data.highlights.map((h,i)=>`<article class="highlight"><div class="highlight-kicker">${esc(h.kicker)}<span>${String(i+1).padStart(2,'0')}</span></div><h3>${esc(h.title)}</h3><p>${esc(h.body)}</p><div class="highlight-stat">${esc(h.stat)}</div><div class="highlight-stat-label">${esc(h.stat_label)}</div><button data-open-country="${h.code}" aria-label="Open the country record for ${esc(countryMap.get(h.code).name)}">Open country record <span aria-hidden="true">↗</span></button></article>`).join('');
 }
 function renderEconomyCases(){
  const comparisons=data.countries.map(c=>core.comparison(c)).filter(Boolean),full=comparisons.filter(c=>c.end===2025).length;
  $('comparison-coverage').textContent=comparisons.length;
  $('comparison-periods').textContent=`${full} through 2025 · ${comparisons.length-full} through 2024 · ${198-comparisons.length} unresolved`;
  const notes={DEU:'Just 0.74% real growth per year since 2015. Near-stagnation since 2019; GDP and emissions fell from 2022 to 2025. Consider each period separately.',CHN:'Both rise, emissions more slowly. Intensity falls even though total emissions grow.',UKR:'Both fell. War and changes in territorial coverage limit the comparison.'};
  $('economy-cases').innerHTML=['DEU','CHN','UKR'].map(code=>{const c=countryMap.get(code),comp=core.comparison(c);if(!comp)return '';return `<article class="economy-case"><button data-open-country="${code}" aria-label="Compare the economy and emissions in ${esc(c.name)}"><span class="case-topline"><span>${esc(c.name)}</span><span>${period(comp)} ↗</span></span><span class="case-metrics"><span><small>PLEDGE</small><strong class="pledge-value">${pledgeHTML(c)}</strong></span><span><small>GREENHOUSE GASES</small><strong>${percentage(comp.emissionsChange)}</strong></span><span><small>REAL GDP</small><strong>${percentage(comp.gdpChange)}</strong></span></span><span class="case-pledge-basis">${esc(pledgeContext(c))}</span><span class="case-note">${esc(notes[code])}</span></button></article>`;}).join('');
 }
 function renderSummary(){
  const s=core.summarize(data.countries);
  $('summary-stats').innerHTML=`<article><span>CLIMATE PLEDGES</span><strong>${s.documentedPledges}</strong><h3>Historical contributions documented</h3><p>Out of ${s.countries} country-specific entries. One original contribution remains unresolved in the analytical dataset: Libya.</p></article><article><span>NO RECORDED EMISSIONS QUOTA</span><strong>${s.noQuota}</strong><h3>That does not mean “no pledge”.</h3><p>These can include policies or deployment targets. This does not establish a count of countries with no climate commitment.</p></article><article><span>PARTIAL TARGETS REACHED</span><strong>${s.partialMetCountries}</strong><h3>China and India</h3><p>At least one partial target from an original or later pledge. This does not establish complete NDC fulfilment.</p></article>`;
  const segments=[['Usable emissions target metric',s.clearQuantified,'clear'],['No emissions quota recorded',s.noQuota,'no-quota'],['Metric or benchmark unresolved',s.unresolvedMetrics,'unresolved']];
  $('summary-pledges').innerHTML=`<div class="summary-bar" role="img" aria-label="${segments.map(([label,n])=>`${n}: ${label}`).join('; ')}">${segments.map(([,n,kind])=>`<span class="${kind}" style="width:${n/s.countries*100}%"></span>`).join('')}</div><dl class="summary-list">${segments.map(([label,n,kind])=>`<div><dt><i class="summary-key ${kind}"></i>${label}</dt><dd>${n}</dd></div>`).join('')}</dl><p class="summary-small">A total of ${s.countries} country/territory entries. ${s.quantified} contain a quantified emissions metric; one has an unresolved benchmark and is counted among unresolved metrics above. Entries without a reduction percentage can still include measurable energy, sink or deployment targets.</p>`;
  $('summary-outcomes').innerHTML=`<dl class="summary-list outcomes-list"><div><dt>Overall pledge fully met</dt><dd>Total unresolved</dd></div><div><dt>Overall pledge conclusively missed</dt><dd>Total unresolved</dd></div><div><dt>At least one partial target demonstrably reached</dt><dd>${s.partialMetCountries} countries</dd></div></dl><p class="summary-small">The in-depth reviews so far establish neither complete NDC fulfilment nor a conclusive overall NDC failure. This describes the evidence in this dossier, not a global tally of zero. Targets for 2030 or 2035 are not yet due.</p><div class="summary-case-links"><button data-open-country="CHN">China: deployment target ↗</button><button data-open-country="IND">India: intensity and power capacity ↗</button></div><p class="summary-small">China’s documented wind/solar target was added in 2021. India reached its original intensity benchmark, among other milestones. Looking only at first pledges, this dataset therefore documents one country with a partial target reached.</p>`;
  $('summary-limits').innerHTML=`<strong>Counting basis:</strong> ${s.countries} country-specific entries; the EU is not counted as an additional country. EU member states share a contribution, so these figures do not count independent NDCs. <strong>Assessment coverage:</strong> ${s.reviewedCountries} countries and the EU have been examined in depth; ${s.unreviewedCountries} other countries lack a comprehensive fulfilment assessment. Falling emissions or improved emissions intensity do not replace that assessment.`;
 }
 function renderEconomicContext(){
  const text=data.economic_context.en,c=countryMap.get('DEU'),windows=[[2015,2025],[2019,2025],[2022,2025]].map(([start,end])=>periodMetrics(c,start,end));
  $('economic-context-content').innerHTML=`<h2 id="economic-context-title">${esc(text.title)}</h2><p class="economic-context-intro">${esc(text.intro)}</p><div class="economic-context-grid"><div><div class="values-scroll" role="region" aria-label="Germany by comparison period" tabindex="0"><table class="economic-period-table"><caption>Total changes; price-adjusted GDP, greenhouse gases excluding land use.</caption><thead><tr><th scope="col">Period</th><th scope="col">Real GDP</th><th scope="col">Greenhouse gases</th><th scope="col">GDP per year*</th></tr></thead><tbody>${windows.map(p=>`<tr><th scope="row">${p.start}–${p.end}</th><td>${percentage(p.gdp)}</td><td>${percentage(p.emissions)}</td><td>${number(p.annualGDP,2)} %</td></tr>`).join('')}</tbody></table></div><p class="source-note">* Compound annual growth rate (CAGR). The periods overlap; they are not established periods of effect for individual policies.</p><p>${esc(text.body[0])}</p><p>${esc(text.body[1])}</p></div><div><h3>Weak growth and falling emissions</h3><p>${esc(text.body[3])}</p><p>${esc(text.body[4])}</p><details><summary>Industry, investment and productivity <span aria-hidden="true">+</span></summary><p>${esc(text.body[2])}</p></details><details><summary>Data and sources <span aria-hidden="true">+</span></summary><p>${esc(text.body[5])}</p><ul>${text.sources.map(source=>`<li>${sourceLink(source.url,source.title,'')}</li>`).join('')}</ul></details></div></div>`;
 }
 const examples={
  absolute:{title:'ABSOLUTE REDUCTION',bars:[['Base year',100],['Target year',70]],max:200,text:'30% below 100 units in the base year means: <strong>no more than 70 units</strong> in the target year. Absolute emissions must decline.'},
  bau:{title:'REDUCTION RELATIVE TO A SCENARIO',bars:[['Today',100],['Without measures',200],['Target: −30%',140]],max:200,text:'The growth scenario rises to 200 units. A target 30% below it allows <strong>140 units</strong> – which is 40% more than today.'},
  intensity:{title:'EMISSIONS PER UNIT OF ECONOMIC OUTPUT',bars:[['Today',100],['After growth',120]],max:200,text:'Emissions intensity falls by 40% and GDP doubles. The calculation is 100 × 0.6 × 2 = <strong>120 units</strong>. Despite reaching the intensity target, total emissions rise.'}
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
  const blob=new Blob([core.toCSV(currentResults,'en')],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Paris-Country-Selection-2026.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast(`Exported ${currentResults.length} entries as CSV.`);
 });
 renderMap();renderResults();renderSummary();renderEconomicContext();renderEconomyCases();renderHighlights();renderExample('absolute');
 $('global-chart').innerHTML=lineChart(data.global.years,data.global.values,{global:true});
 const gChange=core.change(data.global.values);$('global-change').innerHTML=`+${number(gChange)}<span>%</span>`;
 const initial=new URLSearchParams(location.search).get('land');if(initial&&countryMap.has(initial.toUpperCase()))showCountry(initial.toUpperCase());
})();
