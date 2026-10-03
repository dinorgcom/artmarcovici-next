/* Source-attributed records, kept separate from the existing fighter category. */
(function () {
  const labels = {
    "b.idf": ["IDF-Dossier: behauptete militärische Verbindung", "IDF dossier: alleged military affiliation", "ملف الجيش الإسرائيلي: ارتباط عسكري مزعوم", "תיק צה״ל: זיקה צבאית נטענת"],
    "col.idf": ["IDF-Dossier", "IDF dossier", "ملف الجيش", "תיק צה״ל"],
    "idf.column.tip": ["Anzahl namentlicher IDF-Dossiereinträge mit diesem Nachnamen; keine Bewertung aller Familienmitglieder.", "Named IDF dossier entries with this surname; not a rating of all family members.", "عدد الأسماء في ملف الجيش المطابقة للقب؛ ليس تقييماً لجميع أفراد العائلة.", "מספר הרשומות השמיות בתיק צה״ל עם שם משפחה זה; לא דירוג של כלל בני המשפחה."],
    "idf.title": ["The Press Files: 170 Einzelprofile", "The Press Files: 170 individual profiles", "The Press Files: ملفات 170 شخصاً", "The Press Files: ‏170 פרופילים אישיים"],
    "idf.note": ["Quelle: IDF, „The Press Files“, geprüft am 02.10.2026. Die IDF behauptet militärische Verbindungen von Personen, die als Journalisten geführt wurden. Übernommen werden die Quellenaussagen, nicht eine unabhängige Bestätigung. „Material verlinkt“ bedeutet nur, dass das Profil Bilder oder Dokumente verlinkt; deren Echtheit wurde hier nicht unabhängig geprüft. Nachnamen-Zuordnung belegt weder Verwandtschaft noch die Identität mit einem Opferlisteneintrag. Abzeichen und Zähler beziehen sich auf Einzelpersonen, nicht auf die übrigen Namensträger. Keine Änderung der Opferzahlen oder Ableitung eines Terrorismus-Scores für Familien.", "Source: IDF, The Press Files, reviewed on 2 October 2026. The IDF alleges military affiliations of people listed as journalists. These are attributed source claims, not independent confirmation. ‘Linked material’ only means a profile links images or documents; their authenticity has not been independently assessed here. Surname matching proves neither kinship nor identity with a casualty-list entry. Badges and counts concern individuals, not other surname holders. No change to casualty totals and no family terrorism score.", "المصدر: الجيش الإسرائيلي، The Press Files، مراجعة 02.10.2026. ينسب الجيش ارتباطات عسكرية لأشخاص مدرجين كصحفيين. تُعرض أقوال المصدر لا تأكيداً مستقلاً. «مواد مرتبطة» تعني وجود روابط لصور أو وثائق فقط، دون تحقق مستقل من صحتها. تطابق اللقب لا يثبت القرابة أو الهوية مع سجل في قائمة القتلى. الشارات والأعداد تخص الأفراد لا بقية حاملي اللقب. لا تغيير لأعداد القتلى ولا تصنيف للعائلات على أساس الإرهاب.", "מקור: צה״ל, The Press Files, נבדק ב־02.10.2026. צה״ל טוען לזיקות צבאיות של אנשים שנרשמו כעיתונאים. מוצגות טענות המקור, לא אישור עצמאי. ‘חומר מקושר’ פירושו שהפרופיל מקשר לתמונות או למסמכים; אמיתותם לא נבדקה כאן באופן עצמאי. התאמת שם משפחה אינה מוכיחה קרבה או זהות לרשומה ברשימת ההרוגים. התגים והספירות מתייחסים ליחידים, לא לשאר נושאי השם. אין שינוי במספרי ההרוגים ואין ציון טרור למשפחות."],
    "idf.source": ["IDF-Originaldossier öffnen ↗", "Open the original IDF dossier ↗", "فتح ملف الجيش الأصلي ↗", "פתיחת תיק צה״ל המקורי ↗"],
    "idf.total": ["Personen im Dossier", "people in the dossier", "أشخاص في الملف", "אנשים בתיק"],
    "idf.matched": ["Personen → {0} Namensgruppen", "people → {0} surname groups", "أشخاص ← {0} مجموعات ألقاب", "אנשים ← {0} קבוצות שמות"],
    "idf.unmatched": ["ohne eindeutige Namensgruppe", "without an unambiguous surname group", "دون مجموعة لقب واضحة", "ללא קבוצת שם חד־משמעית"],
    "idf.material": ["Profile mit verlinktem Material", "profiles with linked material", "ملفات بمواد مرتبطة", "פרופילים עם חומר מקושר"],
    "idf.unpublished": ["Profile ohne öffentlich verlinktes Material", "profiles without publicly linked material", "ملفات دون مواد مرتبطة علناً", "פרופילים ללא חומר ציבורי מקושר"],
    "idf.unavailable": ["Profile beim Abruf nicht erreichbar", "profiles unavailable when retrieved", "ملفات تعذّر الوصول إليها عند المراجعة", "פרופילים שלא היו נגישים בבדיקה"],
    "idf.roster": ["Alle {0} Namen durchsuchen", "Browse all {0} names", "تصفح جميع الأسماء {0}", "עיון בכל {0} השמות"],
    "idf.search": ["Dossier durchsuchen: Name, Namensgruppe, Organisation, Medium oder Funktion", "Search dossier: name, surname group, organization, outlet or role", "بحث في الملف: الاسم أو اللقب أو المنظمة أو الوسيلة أو الوظيفة", "חיפוש בתיק: שם, קבוצת שם, ארגון, כלי תקשורת או תפקיד"],
    "idf.filter": ["Dossiereinträge filtern", "Filter dossier records", "تصفية سجلات الملف", "סינון רשומות התיק"],
    "idf.all": ["Alle Einträge", "All records", "جميع السجلات", "כל הרשומות"],
    "idf.assigned": ["Mit Namensgruppe", "With a surname group", "مع مجموعة لقب", "עם קבוצת שם"],
    "idf.notassigned": ["Ohne Namensgruppe", "Without a surname group", "دون مجموعة لقب", "ללא קבוצת שם"],
    "idf.count": ["{0} von {1} Einträgen", "{0} of {1} records", "{0} من {1} سجلاً", "{0} מתוך {1} רשומות"],
    "idf.organization": ["Organisation laut IDF", "Organization alleged by IDF", "المنظمة وفق ادعاء الجيش", "ארגון לפי טענת צה״ל"],
    "idf.role": ["Funktion laut IDF (Original EN)", "Role alleged by IDF (original EN)", "الوظيفة وفق ادعاء الجيش (الأصل بالإنجليزية)", "תפקיד לפי טענת צה״ל (מקור באנגלית)"],
    "idf.outlet": ["Medium laut IDF", "Outlet reported by IDF", "الوسيلة الإعلامية وفق الجيش", "כלי תקשורת לפי צה״ל"],
    "idf.evidence": ["Öffentliches Material im Profil", "Public material in the profile", "المواد العلنية في الملف", "חומר ציבורי בפרופיל"],
    "idf.linked": ["Material verlinkt — nicht unabhängig authentifiziert", "Material linked — not independently authenticated", "مواد مرتبطة — دون تحقق مستقل من صحتها", "חומר מקושר — לא אומת באופן עצמאי"],
    "idf.notpublished": ["Keine öffentlich verlinkten Belege im abgerufenen Profil", "No publicly linked evidence in the retrieved profile", "لا أدلة مرتبطة علناً في الملف المسترجع", "אין ראיות ציבוריות מקושרות בפרופיל שנשלף"],
    "idf.notretrieved": ["Nur im Dossierindex erfasst; Profildetails beim Abruf nicht erreichbar", "Listed in dossier index only; profile details unavailable when retrieved", "مُدرج في فهرس الملف فقط؛ تفاصيله لم تكن متاحة عند المراجعة", "נרשם באינדקס התיק בלבד; פרטי הפרופיל לא היו נגישים בבדיקה"],
    "idf.unspecified": ["Nicht im abgerufenen Profil angegeben", "Not specified in the retrieved profile", "غير مذكور في الملف المسترجع", "לא צוין בפרופיל שנשלף"],
    "idf.freelance": ["freiberuflich", "freelance", "مستقل", "עצמאי"],
    "idf.group": ["Namensgruppe {0} öffnen", "Open surname group {0}", "فتح مجموعة اللقب {0}", "פתיחת קבוצת השם {0}"],
    "idf.match.exact": ["gleiche Nachnamenschreibweise", "same surname spelling", "نفس تهجئة اللقب", "אותו כתיב של שם משפחה"],
    "idf.match.alias": ["geprüfte Schreib-/Namenskettenvariante", "reviewed spelling / name-chain variant", "صيغة تهجئة أو سلسلة أسماء مراجعة", "וריאציית כתיב או שרשרת שמות שנבדקה"],
    "idf.oct7": ["IDF behauptet Eindringen nach Israel am 7. Oktober 2023", "IDF alleges entry into Israel on 7 October 2023", "الجيش يدّعي الدخول إلى إسرائيل في 7 أكتوبر 2023", "צה״ל טוען לכניסה לישראל ב־7 באוקטובר 2023"],
    "idf.error": ["Das IDF-Dossier konnte nicht geladen werden. Die übrige Familienliste bleibt verfügbar.", "The IDF dossier could not be loaded. The rest of the family list remains available.", "تعذّر تحميل ملف الجيش. بقية قائمة العائلات متاحة.", "לא ניתן לטעון את תיק צה״ל. שאר רשימת המשפחות זמינה."],
    "idf.download": ["Datensatz als JSON", "Dataset as JSON", "البيانات بصيغة JSON", "מערך הנתונים כ־JSON"],
  };
  window.I18N_EXTRA = window.I18N_EXTRA || {};
  Object.entries(labels).forEach(([key, values]) => {
    window.I18N_EXTRA[key] = Object.fromEntries(["de", "en", "ar", "he"].map((lang, i) => [lang, values[i]]));
  });
  document.addEventListener("i18n-done", () => {
    const legend = document.querySelector("#familien .legend");
    if (legend) {
      const entry = document.createElement("span");
      entry.innerHTML = `<span class="bdg b-idf">IDF</span> ${t("b.idf")}`;
      legend.appendChild(entry);
    }
  }, { once: true });

  const esc = s => String(s).replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
  const norm = s => String(s).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[-’']/g, " ");
  const cap = s => s.replace(/(^|[\s-])\p{L}/gu, c => c.toUpperCase());
  const state = { records: [], byFamily: new Map(), loaded: false };
  const evidenceLabel = r => t({ "linked-material": "idf.linked", "not-published": "idf.notpublished", "profile-unavailable": "idf.notretrieved" }[r.evidenceStatus]);

  function personHtml(r) {
    const outlet = !r.outlet || r.outlet === "Not specified" ? t("idf.unspecified") : r.outlet === "Freelance" ? t("idf.freelance") : r.outlet;
    return `<div class="idf-person"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)} ↗</a>
      <dl><dt>${t("idf.organization")}</dt><dd>${esc(r.organization || t("idf.unspecified"))}</dd>
      <dt>${t("idf.role")}</dt><dd lang="en" dir="ltr">${esc(r.role || t("idf.unspecified"))}</dd>
      <dt>${t("idf.outlet")}</dt><dd>${esc(outlet)}</dd>
      <dt>${t("idf.evidence")}</dt><dd>${esc(evidenceLabel(r))}</dd></dl>
      ${r.oct7Claim ? `<p class="fine">${t("idf.oct7")}</p>` : ""}</div>`;
  }

  async function load() {
    try {
      const response = await fetch("data/idf-press-files.json");
      if (!response.ok) throw new Error(`IDF dossier HTTP ${response.status}`);
      const dataset = await response.json();
      if (!Array.isArray(dataset.records) || !dataset.records.length) throw new Error("Empty IDF dossier");
      state.records = dataset.records;
      state.records.forEach(r => {
        if (r.family) {
          if (!state.byFamily.has(r.family)) state.byFamily.set(r.family, []);
          state.byFamily.get(r.family).push(r);
        }
      });
      state.loaded = true;
    } catch (error) { console.warn("IDF dossier unavailable", error); }
    return state;
  }

  function render(openGroup) {
    const root = document.getElementById("idfContent");
    if (!root) return;
    if (!state.loaded) { root.textContent = t("idf.error"); return; }
    const nf = new Intl.NumberFormat(window.NUMLOC || "de-DE");
    const records = state.records, matched = records.filter(r => r.family).length;
    const stats = [
      [records.length, t("idf.total")], [matched, t("idf.matched", state.byFamily.size)],
      [records.length - matched, t("idf.unmatched")],
      [records.filter(r => r.evidenceStatus === "linked-material").length, t("idf.material")],
      [records.filter(r => r.evidenceStatus === "not-published").length, t("idf.unpublished")],
      [records.filter(r => r.evidenceStatus === "profile-unavailable").length, t("idf.unavailable")],
    ];
    root.innerHTML = `<div class="statrow idf-stats">${stats.map(([n, label]) => `<div class="stat"><b>${nf.format(n)}</b><span>${label}</span></div>`).join("")}</div>
      <details class="idf-roster"><summary>${t("idf.roster", nf.format(records.length))}</summary>
        <div class="idf-controls"><label class="idf-search-label">${t("idf.search")}<input id="idfSearch" type="search" autocomplete="off"></label>
        <label>${t("idf.filter")}<select id="idfFilter">${[["all", "idf.all"], ["matched", "idf.assigned"], ["unmatched", "idf.notassigned"], ["linked-material", "idf.material"], ["not-published", "idf.unpublished"], ["profile-unavailable", "idf.unavailable"]].map(([value, key]) => `<option value="${value}">${t(key)}</option>`).join("")}</select></label></div>
        <p id="idfCount" class="note" aria-live="polite"></p><div id="idfRecords" class="idf-records"></div>
      </details><p class="fine"><a href="data/idf-press-files.json">${t("idf.download")}</a></p>`;
    const input = root.querySelector("#idfSearch"), filter = root.querySelector("#idfFilter");
    function update() {
      const q = norm(input.value).trim(), f = filter.value;
      const visible = records.filter(r => (f === "all" || (f === "matched" ? r.family : f === "unmatched" ? !r.family : r.evidenceStatus === f))
        && norm([r.name, r.family, r.organization, r.outlet, r.role].join(" ")).includes(q));
      root.querySelector("#idfCount").textContent = t("idf.count", nf.format(visible.length), nf.format(records.length));
      root.querySelector("#idfRecords").innerHTML = visible.map(r => `<details class="idf-record"><summary><span dir="ltr">${esc(r.name)}</span><span class="fine">${esc(r.organization || "IDF")}</span></summary>
        ${personHtml(r)}<p class="idf-assignment">${r.family ? `<button type="button" data-family="${esc(r.family)}">${t("idf.group", esc(cap(r.family)))}</button> <span class="fine">${t(r.matchType === "exact-surname" ? "idf.match.exact" : "idf.match.alias")}</span>` : `<span class="fine">${t("idf.unmatched")}</span>`}</p></details>`).join("");
    }
    input.addEventListener("input", update); filter.addEventListener("change", update);
    root.addEventListener("click", e => { const button = e.target.closest("button[data-family]"); if (button) openGroup(button.dataset.family); });
    update();
  }

  window.IDF_PRESS = { state, load, render, personHtml, evidenceLabel, norm };
})();
