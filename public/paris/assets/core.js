(function(global){
 'use strict';
 const normalize=value=>String(value??'').toLocaleLowerCase('de').replace(/ß/g,'ss').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const transliterate=value=>String(value??'').toLocaleLowerCase('de').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss');
 function seriesMap(series){
  const mapped=new Map();
  if(!Array.isArray(series?.years)||!Array.isArray(series?.values))return mapped;
  series.years.forEach((year,index)=>{const y=Number(year),value=series.values[index];if(Number.isInteger(y)&&Number.isFinite(value))mapped.set(y,value);});
  return mapped;
 }
 function valueAt(series,year){return seriesMap(series).get(Number(year))??null;}
 function change(values){
  const first=Array.isArray(values)?values[0]:valueAt(values,2015);
  const last=Array.isArray(values)?values[values.length-1]:valueAt(values,2025);
  return Number.isFinite(first)&&first>0&&Number.isFinite(last)?(last/first-1)*100:null;
 }
 function economyChange(c){
  const gdp=seriesMap(c?.economy),baseline=gdp.get(2015);
  if(!(baseline>0))return null;
  const end=[...gdp.keys()].filter(year=>year>2015&&gdp.get(year)>0).sort((a,b)=>b-a)[0];
  return end===undefined?null:{start:2015,end,change:(gdp.get(end)/baseline-1)*100};
 }
 function comparison(c){
  const emissions=seriesMap(c?.emissions),gdp=seriesMap(c?.economy);
  const e0=emissions.get(2015),g0=gdp.get(2015);
  if(!(e0>0)||!(g0>0))return null;
  const common=[...emissions.keys()].filter(year=>year>=2015&&emissions.get(year)>=0&&gdp.get(year)>0).sort((a,b)=>a-b);
  const end=common.filter(year=>year>=2024).at(-1);
  if(end===undefined)return null;
  const eratio=emissions.get(end)/e0,gratio=gdp.get(end)/g0;
  const emissionsChange=(eratio-1)*100,gdpChange=(gratio-1)*100,intensityChange=(eratio/gratio-1)*100;
  const epsilon=1e-9;
  let kind,label;
  if(gdpChange>epsilon){
   if(emissionsChange<-epsilon){kind='absolute';label='Absolute territoriale Entkopplung';}
   else if(emissionsChange>epsilon&&emissionsChange<gdpChange-epsilon){kind='relative';label='Relative territoriale Entkopplung';}
   else if(Math.abs(emissionsChange)<=epsilon){kind='flat';label='Stabile Emissionen bei wachsendem realem BIP';}
   else {kind='no-decoupling';label='Keine Entkopplung bei wachsendem realem BIP';}
  }else if(gdpChange<-epsilon){
   if(emissionsChange<-epsilon){kind='both-down';label='Emissionsrückgang bei schrumpfendem realem BIP';}
   else if(emissionsChange>epsilon){kind='emissions-up';label='Steigende Emissionen bei schrumpfendem realem BIP';}
   else {kind='flat';label='Stabile Emissionen bei schrumpfendem realem BIP';}
  }else {
   if(emissionsChange>epsilon){kind='emissions-up';label='Steigende Emissionen bei stagnierendem realem BIP';}
   else if(emissionsChange<-epsilon){kind='flat';label='Sinkende Emissionen bei stagnierendem realem BIP';}
   else {kind='flat';label='Reales BIP und Emissionen unverändert';}
  }
  const years=common.filter(year=>year<=end);
  return {start:2015,end,years:end-2015,emissionsChange,gdpChange,intensityChange,indexed:{years,emissions:years.map(year=>emissions.get(year)/e0*100),gdp:years.map(year=>gdp.get(year)/g0*100)},kind,label};
 }
 function summarize(countries=[]){
  const entries=Array.isArray(countries)?countries:[];
  const national=entries.filter(c=>c?.code!=='EUU');
  const summary={entries:entries.length,countries:national.length,documentedPledges:0,historicalMissing:0,quantified:0,noQuota:0,metricOpen:0,unclearBasis:0,clearQuantified:0,unresolvedMetrics:0,reviewedCountries:0,unreviewedCountries:0,partialMetCountries:0,firstPledgePartialMetCountries:0,fullMetConfirmed:0,fullMissedConfirmed:0,overallOpen:0};
  for(const c of national){
   if(c?.original?.recorded===true)summary.documentedPledges++;
   else summary.historicalMissing++;
   const metric=c?.original?.metric,value=metric?.value;
   if(normalize(value).trim()==='keine quote')summary.noQuota++;
   else if((typeof value==='number'&&Number.isFinite(value))||(typeof value==='string'&&/\d/.test(value))){
    summary.quantified++;
    if(metric?.kind==='unclear')summary.unclearBasis++;
   }else summary.metricOpen++;
   if(c?.review&&typeof c.review==='object'&&!Array.isArray(c.review))summary.reviewedCountries++;
   else summary.unreviewedCountries++;
   const outcome=c?.review?.outcome;
   if(outcome?.partial_met===true)summary.partialMetCountries++;
   if(outcome?.first_pledge_partial_met===true)summary.firstPledgePartialMetCountries++;
   if(outcome?.overall==='met')summary.fullMetConfirmed++;
   else if(outcome?.overall==='missed')summary.fullMissedConfirmed++;
   else summary.overallOpen++;
  }
  summary.clearQuantified=summary.quantified-summary.unclearBasis;
  summary.unresolvedMetrics=summary.metricOpen+summary.unclearBasis;
  return summary;
 }
 function selectCountries(countries,state){
  const query=normalize(state.q||'').trim();
  const found=countries.filter(c=>{
   const aliases={GBR:'Großbritannien Grossbritannien UK Britain',USA:'Vereinigte Staaten Vereinigte Staaten von Amerika US',ARE:'VAE UAE',CZE:'Tschechische Republik',CIV:'Elfenbeinküste Elfenbeinkueste'};
   const haystack=normalize([c.name,c.name_de,transliterate(c.name),c.official_name,c.code,aliases[c.code]||''].join(' '));
   if(query&&!query.split(/\s+/).every(part=>haystack.includes(part)))return false;
   if(state.region&&state.region!=='all'&&c.region!==state.region)return false;
   if(state.type&&state.type!=='all'&&c.current.family!==state.type)return false;
   if(state.scope==='reviewed'&&!c.review)return false;
   if(state.scope==='quality'&&!c.quality_flag)return false;
   if(state.economy&&state.economy!=='all'){
    const paired=comparison(c);
    if(state.economy==='missing'){if(paired!==null)return false;}
    else if(paired?.kind!==state.economy)return false;
   }
   return true;
  });
  return found.sort((a,b)=>{
   if(state.sort==='emissions')return (valueAt(b.emissions,2025)??-Infinity)-(valueAt(a.emissions,2025)??-Infinity)||a.name.localeCompare(b.name,'de');
   if(state.sort==='increase'||state.sort==='decrease'){
    const av=change(a.emissions),bv=change(b.emissions);
    if(av===null&&bv!==null)return 1;if(bv===null&&av!==null)return -1;
    if(av!==null&&bv!==null&&av!==bv)return state.sort==='increase'?bv-av:av-bv;
   }
   if(state.sort==='gdp'||state.sort==='intensity'){
    const av=state.sort==='gdp'?economyChange(a)?.change:comparison(a)?.intensityChange;
    const bv=state.sort==='gdp'?economyChange(b)?.change:comparison(b)?.intensityChange;
    const aMissing=!Number.isFinite(av),bMissing=!Number.isFinite(bv);
    if(aMissing&&!bMissing)return 1;if(bMissing&&!aMissing)return -1;
    if(!aMissing&&!bMissing&&av!==bv)return state.sort==='gdp'?bv-av:av-bv;
   }
   return a.name.localeCompare(b.name,'de');
  });
 }
 function page(items,index,size=18){const pages=Math.max(1,Math.ceil(items.length/size));const current=Math.min(Math.max(1,index),pages);return {items:items.slice((current-1)*size,current*size),page:current,pages,total:items.length,start:items.length?(current-1)*size+1:0,end:Math.min(current*size,items.length)};}
 const csvCell=value=>'"'+String(value??'').replace(/"/g,'""')+'"';
 function toCSV(countries,language='de'){
  const rows=[['Code','Land / Partei','Erste Zusage (Deutsch)','Stand der ersten Zusage','Quelle erste Zusage','Spätere Zusage (Deutsch)','Stand spätere Zusage','Bisher beobachtet','Einordnung','Emissionen 2015 (Mt CO2e ohne LULUCF)','Emissionen 2025 (Mt CO2e ohne LULUCF)','Änderung 2015–2025 (%)','Quellenhinweis','Attribution und Bearbeitung','Lizenz der Länderkerne','Lizenz-URL','Quelle der späteren Kurzfassung','Quelle der Emissionsdaten','BIP-Indikator','Reales BIP 2015 (konstante 2015-US$)','Reales BIP im jüngsten verfügbaren Jahr (konstante 2015-US$)','Jüngstes BIP-Jahr','BIP-Vergleichszeitraum','BIP-Änderung im verfügbaren Zeitraum (%)','Gemeinsamer Vergleichszeitraum BIP und Emissionen','Vergleichsdauer (Jahre)','Emissionen im gemeinsamen Endjahr (Mt CO2e ohne LULUCF)','Reales BIP im gemeinsamen Endjahr (konstante 2015-US$)','Emissionsänderung im gemeinsamen Zeitraum (%)','BIP-Änderung im gemeinsamen Zeitraum (%)','Änderung der Emissionsintensität im gemeinsamen Zeitraum (%)','Deskriptive Einordnung BIP und Emissionen','Quelle der realen BIP-Daten']];
  for(const c of countries){
   const paired=comparison(c),economy=economyChange(c);
   const gdpSource=typeof c.economy?.source==='string'?c.economy.source:c.economy?.source?.url;
   rows.push([c.code,c.name,c.original.summary,c.original.date,c.original.source.url,c.current.summary,c.current.date,c.review?.observed||'Kein individueller Erfüllungsnachweis; EDGAR-Trend separat.',c.review?.verdict||'Zielvergleich offen',valueAt(c.emissions,2015),valueAt(c.emissions,2025),change(c.emissions),[c.current.quality,c.current.conflict_note,c.original.quality].filter(Boolean).join(' '),'Climate Watch NDC Content, World Resources Institute; abgerufen 11.11.2026. Deutsche Übersetzung/Verdichtung, Versionsabgleich und markierte Korrekturen für dieses Dossier.','CC BY-NC 4.0','https://creativecommons.org/licenses/by-nc/4.0/',c.current.analysis_url,c.emissions.source,c.economy?.indicator,valueAt(c.economy,2015),economy?valueAt(c.economy,economy.end):null,economy?.end,economy?`${economy.start}–${economy.end}`:null,economy?.change,paired?`${paired.start}–${paired.end}`:null,paired?.years,paired?valueAt(c.emissions,paired.end):null,paired?valueAt(c.economy,paired.end):null,paired?.emissionsChange,paired?.gdpChange,paired?.intensityChange,paired?.label||'Kein gemeinsamer Vergleich ab 2015 bis mindestens 2024 verfügbar',gdpSource]);
  }
  rows[0].push('Einschränkung des Wirtschaftsvergleichs','Quelle der Einschränkung','BIP-Datenstand','Lizenz der BIP-Daten');
  countries.forEach((c,i)=>rows[i+1].push(c.economy?.note,c.economy?.note_source,c.economy?.updated,c.economy?.license));
  rows[0].push('Ursprüngliches Versprechen (Kurzkennzahl)','Bezugsbasis der Kurzkennzahl','Zieljahr der Kurzkennzahl','Basisjahr der Kurzkennzahl','Zielart der Kurzkennzahl','Zusatz zur Kurzkennzahl','Quelle der Kurzkennzahl','PDF-Seiten der Kurzkennzahl');
  countries.forEach((c,i)=>{const p=c.original.metric;rows[i+1].push(p?.value,p?.basis,p?.target_year,p?.base_year,p?.kind,p?.note,p?.source_url,p?.source_pages?.join(', '));});
  if(language==='en'){
   const header=['Code','Country / party','Original pledge (English)','Original pledge date','Original pledge source','Later pledge (English)','Later pledge date','Observed so far','Assessment','Emissions 2015 (Mt CO2e excluding LULUCF)','Emissions 2025 (Mt CO2e excluding LULUCF)','Change 2015–2025 (%)','Source quality note','Attribution and adaptation','Country summary licence','Licence URL','Later summary source','Emissions source','GDP indicator','Real GDP 2015 (constant 2015 US$)','Real GDP in latest available year (constant 2015 US$)','Latest GDP year','GDP comparison period','GDP change in available period (%)','Shared GDP and emissions comparison period','Comparison duration (years)','Emissions in shared end year (Mt CO2e excluding LULUCF)','Real GDP in shared end year (constant 2015 US$)','Emissions change in shared period (%)','GDP change in shared period (%)','Emissions intensity change in shared period (%)','Descriptive GDP and emissions assessment','Real GDP source','Economic comparison limitation','Limitation source','GDP data updated','GDP data licence','Original pledge (headline figure)','Headline figure reference basis','Headline figure target year','Headline figure base year','Headline figure target type','Headline figure note','Headline figure source','Headline figure PDF pages'];
   if(header.length!==rows[0].length)throw new Error('English CSV header mismatch');
   const words=new Map([
    ['Kein individueller Erfüllungsnachweis; EDGAR-Trend separat.','No individual proof of target fulfilment; EDGAR trend shown separately.'],['Zielvergleich offen','Target comparison remains open'],['Keine Quote','No emissions quota recorded'],['Offen','Open'],
    ['Absolute territoriale Entkopplung','Absolute territorial decoupling'],['Relative territoriale Entkopplung','Relative territorial decoupling'],['Emissionsrückgang bei schrumpfendem realem BIP','Falling emissions alongside shrinking real GDP'],['Keine Entkopplung bei wachsendem realem BIP','No decoupling alongside growing real GDP'],['Steigende Emissionen bei schrumpfendem realem BIP','Rising emissions alongside shrinking real GDP'],['Steigende Emissionen bei stagnierendem realem BIP','Rising emissions alongside stagnant real GDP'],['Stabile Emissionen bei wachsendem realem BIP','Stable emissions alongside growing real GDP'],['Stabile Emissionen bei schrumpfendem realem BIP','Stable emissions alongside shrinking real GDP'],['Sinkende Emissionen bei stagnierendem realem BIP','Falling emissions alongside stagnant real GDP'],['Reales BIP und Emissionen unverändert','Real GDP and emissions unchanged'],
    ['Kein gemeinsamer Vergleich ab 2015 bis mindestens 2024 verfügbar','No shared comparison from 2015 to at least 2024 available'],
    ['Climate Watch NDC Content, World Resources Institute; abgerufen 11.11.2026. Deutsche Übersetzung/Verdichtung, Versionsabgleich und markierte Korrekturen für dieses Dossier.','Climate Watch NDC Content, World Resources Institute; accessed 11 November 2026. English translation and condensation, version comparison and marked corrections for this dossier.']
   ]);
   rows[0]=header;
   for(let i=1;i<rows.length;i++)rows[i]=rows[i].map(value=>words.get(value)??value);
   for(let i=1;i<rows.length;i++)if(typeof rows[i][37]==='string')rows[i][37]=rows[i][37].replace(/^bis zu /,'up to ').replace(/^rund /,'about ').replace(/(\d),(\d)/g,'$1.$2');
  }
  return '\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
 }
 global.DossierCore={normalize,change,valueAt,economyChange,comparison,summarize,selectCountries,page,toCSV};
})(globalThis);
