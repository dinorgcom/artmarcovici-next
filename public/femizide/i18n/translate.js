/* Femizide in Österreich – englische Übersetzungsschicht (nur aktiv, wenn BIEST_LANG === "en").
 *
 * Das Dossier liegt nur als fertiger Vite-Build vor (assets/index-*.js). Statt das Bundle zu ändern,
 * übersetzt diese Datei die gerenderte Seite:
 *   - Textknoten und die Attribute title, aria-label, alt, placeholder (sowie value von Buttons)
 *     werden über das Wörterbuch FEMIZIDE_I18N.dict ersetzt: exakte deutsche Zeichenkette → Englisch,
 *     Vergleich mit normalisiertem Leerraum. Nur Treffer werden ersetzt – kein Kreislauf möglich.
 *   - Zur Laufzeit zusammengesetzte Texte („203 von 203 Fällen angezeigt", Tooltips, Datumsangaben,
 *     Zahlen mit Dezimalkomma …) über die Regeln in FEMIZIDE_I18N.patterns.
 *   - Kurze Aufzählungen wie „Ort · Bundesland" oder „Ort, Bezirk" werden in bekannte Teile zerlegt.
 *   - Absätze mit eingebettetem Markup (<strong>, <em>, <code>) als Ganzes über FEMIZIDE_I18N.blocks
 *     (Schlüssel = normalisierter textContent, Wert = englisches HTML).
 * Beim Laden wird die ganze Seite einmal übersetzt (DOMContentLoaded, nach dem Bundle), danach hält
 * ein MutationObserver (childList, subtree, characterData, attributes) neu gerenderte Inhalte –
 * Filter, Fallarchiv, Diagramm-Umschalter, Karte – auf Englisch. Diagramme sind SVG/HTML (kein <canvas>).
 *
 * Wörterbuch: i18n/en-ui.js (Oberfläche, Regeln, Absätze) und i18n/en-cases-*.js (Falltexte).
 * Fehlende Einträge auflisten:   node scripts/femizide-i18n.mjs extract
 * Im Browser prüfen:             /femizide/?lang=en&i18n-debug=1  → window.__femizideMissing
 */
(function () {
  "use strict";

  /* ---------- Übersetzungskern (ohne DOM; wird auch von scripts/femizide-i18n.mjs benutzt) ---------- */
  function createEngine(I) {
    I = I || {};
    var DICT = I.dict || {}, BLOCKS = I.blocks || {}, PATTERNS = I.patterns || [];
    var KEEP = new Set(I.keep || []);
    var memo = new Map();
    var depth = 0;
    var HAS_WORK = /[^\d\s–\-:+?()·\/]/;   // reine Zahlen/Jahre ohne Komma, %, × … brauchen nichts
    var THOUSANDS = /\d\s\d{3}(?!\d)/;      // "2 191" (Tausender-Leerzeichen) → "2,191"

    function norm(s) { return String(s).replace(/\s+/g, " ").trim(); }
    function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
    // "2 191" (de-AT, geschütztes Leerzeichen) → "2,191"; "0,51" → "0.51"
    function num(s) {
      return String(s)
        .replace(/(\d),(\d)/g, "$1\u0001$2")
        .replace(/(\d)[   ](?=\d{3}(?!\d))/g, "$1,")
        .replace(/\u0001/g, ".");
    }
    // "41,4 %" → "41.4%"
    function pct(s) { return num(String(s).replace(/\s*%$/, "")) + (/%$/.test(s) ? "%" : ""); }
    // "08.01.2019" → "08/01/2019" (en-GB, gleiche Reihenfolge Tag/Monat/Jahr)
    function date(s) { return String(s).replace(/\b(\d{2})\.(\d{2})\.(\d{4})\b/g, "$1/$2/$3"); }

    // Hilfsfunktionen für die Regeln in en-ui.js
    var H = {
      t: function (x) { var r = lookup(norm(x)); return r == null ? x : r; }, // übersetzen, sonst Original
      r: function (x) { return lookup(norm(x)); },                            // übersetzen oder null
      n: num,
      p: pct,
      d: date,
      pl: function (n, one, many) { return Number(n) === 1 ? one : many; }
    };

    function resolve(k) {
      if (own(DICT, k)) return DICT[k];
      if (KEEP.has(k)) return k;
      for (var i = 0; i < PATTERNS.length; i++) {
        var p = PATTERNS[i], m = p[0].exec(k);
        if (!m) continue;
        var r = typeof p[1] === "function" ? p[1](m, H) : k.replace(p[0], p[1]);
        if (r != null) return r;
      }
      // Zusammengesetzte Kurztexte wie "Ort · Bundesland" oder "Ort, Bezirk": nur übersetzen,
      // wenn sich der Text an einer Trennstelle in zwei bekannte Teile zerlegen lässt
      if (k.length <= 160) {
        var seps = [" · ", ", "];
        for (var s = 0; s < seps.length; s++) {
          var sep = seps[s], j = k.indexOf(sep);
          while (j > 0) {
            var a = lookup(k.slice(0, j));
            var b = a == null ? null : lookup(k.slice(j + sep.length));
            if (a != null && b != null) return a + sep + b;
            j = k.indexOf(sep, j + 1);
          }
        }
      }
      return null;
    }

    // normalisierter deutscher Text → Englisch (bei bewusst unveränderten Texten das Original) oder null
    function lookup(k) {
      if (memo.has(k)) return memo.get(k);
      if (depth > 6) return null;
      depth++;
      var r;
      try { r = resolve(k); } finally { depth--; }
      memo.set(k, r);
      return r;
    }

    // Rohtext (mit Leerraum) → übersetzter Text mit gleichem Leerraum am Rand, oder null
    function translate(raw) {
      var k = norm(raw);
      if (!k || (!HAS_WORK.test(k) && !THOUSANDS.test(k))) return null;
      var r = lookup(k);
      if (r == null || r === k) return null;
      return /^\s*/.exec(raw)[0] + r + /\s*$/.exec(raw)[0];
    }

    function block(text) { var k = norm(text); return own(BLOCKS, k) ? BLOCKS[k] : null; }

    return { norm: norm, lookup: lookup, translate: translate, block: block, hasWork: function (k) { return HAS_WORK.test(k) || THOUSANDS.test(k); } };
  }
  window.FEMIZIDE_I18N_ENGINE = createEngine;

  /* ---------- Seite übersetzen (nur Englisch) ---------- */
  if (window.BIEST_LANG !== "en" || typeof document === "undefined") return;

  var doc = document;
  var DEBUG = /[?&]i18n-debug=1(?:&|$)/.test(location.search);

  // Seite bis zum ersten Durchlauf ausblenden (kein Aufblitzen deutscher Texte); Notfall nach 4 s.
  var hideStyle = doc.createElement("style");
  hideStyle.setAttribute("data-femizide-i18n", "");
  hideStyle.appendChild(doc.createTextNode("body{visibility:hidden!important}"));
  (doc.head || doc.documentElement).appendChild(hideStyle);
  var failsafe = setTimeout(unhide, 4000);
  function unhide() {
    clearTimeout(failsafe);
    if (hideStyle.parentNode) hideStyle.parentNode.removeChild(hideStyle);
  }

  var E = null;
  var writtenText = new WeakMap();
  var writtenAttr = new WeakMap();
  var missing = DEBUG ? (window.__femizideMissing = {}) : null;
  var SKIP = { SCRIPT: 1, STYLE: 1, CODE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
  var ATTRS = ["title", "aria-label", "alt", "placeholder"];
  var LOOKS_GERMAN = /[äöüßÄÖÜ]|\b(der|die|das|und|nicht|mit|von|für|Fälle|Fall|Jahre?|Opfer|Täter|keine?|laut|wurde)\b/;

  function translateString(raw) {
    var out = E.translate(raw);
    if (out == null && missing) {
      var k = E.norm(raw);
      if (k && !/^https?:\/\//.test(k) && E.hasWork(k) && E.lookup(k) == null && LOOKS_GERMAN.test(k)) missing[k] = (missing[k] || 0) + 1;
    }
    return out;
  }

  function text(node) {
    var v = node.data;
    if (writtenText.get(node) === v) return;
    var p = node.parentNode;
    if (!p || SKIP[p.nodeName]) return;
    var out = translateString(v);
    if (out == null) return;
    writtenText.set(node, out);
    node.data = out;
  }

  function attr(el, name) {
    var v = el.getAttribute(name);
    if (v == null) return;
    var w = writtenAttr.get(el);
    if (w && w[name] === v) return;
    var out = translateString(v);
    if (out == null) return;
    if (!w) writtenAttr.set(el, (w = {}));
    w[name] = out;
    el.setAttribute(name, out);
  }

  function attrs(el) {
    for (var i = 0; i < ATTRS.length; i++) if (el.hasAttribute(ATTRS[i])) attr(el, ATTRS[i]);
    if (el.nodeName === "INPUT" && /^(button|submit|reset)$/i.test(el.type) && el.hasAttribute("value")) attr(el, "value");
  }

  // Element mit eigenem Text UND Kind-Elementen → als Ganzes über BLOCKS ersetzen
  function block(el) {
    var hasText = false, hasEl = false;
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 1) hasEl = true;
      else if (c.nodeType === 3 && /\S/.test(c.data)) hasText = true;
      if (hasText && hasEl) break;
    }
    if (!hasText || !hasEl) return false;
    var html = E.block(el.textContent);
    if (html == null) return false;
    el.innerHTML = html;
    return true;
  }

  function walk(n) {
    if (n.nodeType === 3) { text(n); return; }
    if (n.nodeType !== 1 || SKIP[n.nodeName]) return;
    if (n.classList && n.classList.contains("biest-lang")) return; // Sprachumschalter
    attrs(n);
    if (block(n)) return;
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }

  function onMutations(recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === "childList") {
        for (var j = 0; j < r.addedNodes.length; j++) walk(r.addedNodes[j]);
      } else if (r.type === "characterData") {
        text(r.target);
      } else if (r.type === "attributes" && r.target.nodeType === 1) {
        attr(r.target, r.attributeName);
      }
    }
  }

  function start() {
    var t0 = Date.now();
    try {
      E = createEngine(window.FEMIZIDE_I18N);
      var t = E.translate(doc.title);
      if (t) doc.title = t;
      var md = doc.querySelector('meta[name="description"]');
      if (md) {
        var c = E.translate(md.getAttribute("content") || "");
        if (c) md.setAttribute("content", c);
      }
      if (doc.body) {
        walk(doc.body);
        new MutationObserver(onMutations).observe(doc.body, {
          childList: true, subtree: true, characterData: true,
          attributes: true, attributeFilter: ATTRS.concat("value")
        });
      }
    } catch (e) {
      if (window.console) console.error("[femizide-i18n]", e);
    } finally {
      unhide();
      if (DEBUG && window.console) console.info("[femizide-i18n] first pass " + (Date.now() - t0) + " ms");
    }
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})();
