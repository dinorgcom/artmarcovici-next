(function(){
 'use strict';
 const language=window.BIEST_LANG==='en'?'en':'de';
 const load=name=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='/paris/assets/'+name;script.onload=resolve;script.onerror=reject;document.head.appendChild(script);});
 (async()=>{
  try{if(language==='en')await load('data.en.js');await load(language==='en'?'app.en.js':'app.js');}
  catch{const target=document.getElementById('results-count');if(target)target.textContent=language==='en'?'Country data could not be loaded. CSV and JSON downloads remain available below.':'Die Länderdaten konnten nicht geladen werden. CSV und JSON stehen unten zum Download bereit.';}
 })();
})();
