/* biest.com — gemeinsame Sprachwahl Deutsch/Englisch für alle Dossiers.
 *
 * Einbinden im <head>, VOR allen anderen Skripten und ohne defer/async:
 *   <script src="/shared/biest-lang.js"></script>
 *
 * Sprache wird so bestimmt (erste Übereinstimmung gewinnt):
 *   1. URL-Parameter ?lang=de | ?lang=en   (wird gespeichert, Links sind teilbar)
 *   2. localStorage "lang"                  (gleicher Schlüssel wie im Gaza-Dossier)
 *   3. Browsersprache: de* → Deutsch, alles andere → Englisch
 *
 * Verwendung
 *   HTML-Texte:   <span data-lang="de">Deutsch</span><span data-lang="en">English</span>
 *                 (die jeweils andere Sprache wird per CSS ausgeblendet, auch für ganze Blöcke)
 *   Attribute:    data-en-title, data-en-placeholder, data-en-aria-label, data-en-alt,
 *                 data-en-content, data-en-value … → ersetzen das Attribut bei Englisch
 *   Reiner Text:  data-en-text="…" ersetzt den Textinhalt (für <title>, <option> usw.)
 *   JavaScript:   L("Deutsch", "English")  ·  BIEST_LANG ("de" | "en")
 *                 BIEST_LOCALE ("de-AT" | "en-GB") für toLocaleString/Intl
 *   Umschalter:   <div data-biest-lang-switch></div> — sonst wird er an .site-header angehängt
 */
(function () {
  "use strict";
  var LANGS = ["de", "en"];
  var KEY = "lang";

  function fromUrl() {
    try {
      var p = new URLSearchParams(location.search).get("lang");
      return p && LANGS.indexOf(p) >= 0 ? p : null;
    } catch (e) {
      return null;
    }
  }
  function fromStore() {
    try {
      var s = localStorage.getItem(KEY);
      return s && LANGS.indexOf(s) >= 0 ? s : null;
    } catch (e) {
      return null;
    }
  }
  function fromBrowser() {
    var list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]);
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i] || "").toLowerCase();
      if (l.indexOf("de") === 0) return "de";
      if (l.indexOf("en") === 0) return "en";
    }
    return "en";
  }

  var urlLang = fromUrl();
  var LANG = urlLang || fromStore() || fromBrowser();
  if (urlLang) {
    try { localStorage.setItem(KEY, urlLang); } catch (e) { /* private mode */ }
  }

  window.BIEST_LANG = LANG;
  window.BIEST_LOCALE = LANG === "de" ? "de-AT" : "en-GB";
  window.L = function (de, en) { return LANG === "en" && en != null ? en : de; };
  window.biestSetLang = function (l) {
    if (LANGS.indexOf(l) < 0 || l === LANG) return;
    try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ }
    var u = new URL(location.href);
    u.searchParams.set("lang", l);
    location.href = u.toString();
  };

  var root = document.documentElement;
  root.lang = LANG;
  root.setAttribute("data-biest-lang", LANG);

  // hide the inactive language before first paint
  var css =
    'html[data-biest-lang="de"] [data-lang="en"],html[data-biest-lang="en"] [data-lang="de"]{display:none!important}';
  var style = document.createElement("style");
  style.setAttribute("data-biest-lang-style", "");
  style.appendChild(document.createTextNode(css));
  (document.head || root).appendChild(style);

  var ATTRS = ["title", "placeholder", "aria-label", "alt", "content", "value", "label", "href"];

  function translateAttributes(scope) {
    if (LANG !== "en") return;
    var nodes = (scope || document).querySelectorAll("[data-en-text]");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = nodes[i].getAttribute("data-en-text");
    for (var a = 0; a < ATTRS.length; a++) {
      var name = ATTRS[a];
      var els = (scope || document).querySelectorAll("[data-en-" + name + "]");
      for (var j = 0; j < els.length; j++) els[j].setAttribute(name, els[j].getAttribute("data-en-" + name));
    }
  }
  window.biestTranslate = translateAttributes;

  function renderSwitch() {
    var slot = document.querySelector("[data-biest-lang-switch]");
    if (!slot) {
      var header = document.querySelector(".site-header");
      if (!header) return;
      slot = document.createElement("div");
      header.appendChild(slot);
    }
    if (slot.querySelector(".biest-lang")) return;
    var wrap = document.createElement("div");
    wrap.className = "biest-lang";
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", LANG === "de" ? "Sprache" : "Language");
    [["de", "DE", "Deutsch"], ["en", "EN", "English"]].forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = o[1];
      b.lang = o[0];
      b.title = o[2];
      b.setAttribute("aria-pressed", String(o[0] === LANG));
      b.addEventListener("click", function () { window.biestSetLang(o[0]); });
      wrap.appendChild(b);
    });
    slot.appendChild(wrap);
  }

  // <title> with data-en-text can be applied right away
  if (LANG === "en") {
    var t = document.querySelector("title[data-en-text]");
    if (t) document.title = t.getAttribute("data-en-text");
  }

  function onReady() {
    translateAttributes(document);
    renderSwitch();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
