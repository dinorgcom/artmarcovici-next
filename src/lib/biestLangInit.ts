// Kept free of React imports so server components can use it.
/**
 * Inline script for the first child of the language root. It runs while the
 * HTML is parsed — before the page is painted — and sets data-biest-lang and
 * lang on its parent element. Kept as a literal string so server and client
 * render identical markup (no hydration mismatch). Logic mirrors resolveBiestLang().
 */
export const BIEST_LANG_INIT_SCRIPT =
  '(function(){try{var s=document.currentScript,r=s&&s.parentElement;if(!r)return;' +
  'var ok=function(v){return v==="de"||v==="en"},l=null,q=null;' +
  'try{q=new URLSearchParams(location.search).get("lang")}catch(e){}' +
  'if(ok(q)){l=q;try{localStorage.setItem("lang",q)}catch(e){}}' +
  'if(!l){try{var v=localStorage.getItem("lang");if(ok(v))l=v}catch(e){}}' +
  'if(!l){var n=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""];' +
  'for(var i=0;i<n.length;i++){var x=String(n[i]||"").toLowerCase();' +
  'if(x.indexOf("de")===0){l="de";break}if(x.indexOf("en")===0){l="en";break}}}' +
  'l=l||"en";r.setAttribute("data-biest-lang",l);r.setAttribute("lang",l)}catch(e){}})();';
