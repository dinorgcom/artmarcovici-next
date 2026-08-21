/* Gaza-Familien: eigenstaendige Suche, Tabelle und Detailansicht. */
(async function families() {
  const get = async name => (await fetch("data/" + name)).json();
  const nf = new Intl.NumberFormat(window.NUMLOC || "de-DE");
  const FAMS = await get("families.json");
  const FAM_INDEX = new Map(FAMS.map((family, index) => [family.k, index]));
  const AVG_FAMILY_LOSSES = FAMS.reduce((sum, family) => sum + family.n, 0) / FAMS.length;
  const avgNf = new Intl.NumberFormat(window.NUMLOC || "de-DE", { maximumFractionDigits: 1 });
  const signedAvgNf = new Intl.NumberFormat(window.NUMLOC || "de-DE", {
    signDisplay: "always", maximumFractionDigits: 1,
  });
  const info = document.getElementById("searchInfo"), results = document.getElementById("famResults"),
        detail = document.getElementById("famDetail"), input = document.getElementById("famSearch");
  let LIST = null, listLoading = false;

  async function loadList() {
    if (LIST || listLoading) return;
    listLoading = true;
    info.textContent = t("fam.loading");
    LIST = await get("list.json");
    info.textContent = t("fam.loaded", nf.format(LIST.length));
    run();
  }

  const cap = s => s.replace(/(^|[\s-])\p{L}/gu, c => c.toUpperCase());
  const esc = s => String(s).replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
  const searchNorm = s => String(s).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
  const ratioValue = f => f.f ? f.m / f.f : f.m ? Number.POSITIVE_INFINITY : 0;
  const ratioText = f => f.f ? `${avgNf.format(f.m / f.f)} : 1` : f.m ? "∞ : 1" : "—";

  // Ein Abzeichen haengt an einer Person, nicht an der Familie.
  const BADGE = {
    fighter:  { sym: "★", cls: "b-f",  label: t("b.fighter") },
    press:    { sym: "✎", cls: "b-p",  label: t("b.press") },
    medic:    { sym: "✚", cls: "b-m",  label: t("b.medic") },
    prisoner: { sym: "⛓", cls: "b-pr", label: t("b.prisoner") },
    official: { sym: "◆", cls: "b-o",  label: t("b.official") },
    victims:  { sym: "●", cls: "b-v",  label: t("b.victims") },
    media:    { sym: "◎", cls: "b-me", label: t("b.media") },
    culture:  { sym: "✦", cls: "b-c",  label: t("b.culture") },
    activist: { sym: "⚑", cls: "b-a",  label: t("b.activist") },
    diplomat: { sym: "◇", cls: "b-d",  label: t("b.diplomat") },
    aid:      { sym: "♥", cls: "b-h",  label: t("b.aid") },
    unrwa:    { sym: "▣", cls: "b-u",  label: t("b.unrwa") },
    academic: { sym: "▦", cls: "b-ac", label: t("b.academic") },
    sport:    { sym: "🏅", cls: "b-s",  label: t("b.sport") },
  };
  const BADGE_ORDER = ["fighter", "press", "medic", "prisoner", "official", "victims",
    "media", "culture", "activist", "diplomat", "aid", "unrwa", "academic", "sport"];
  const PUBLIC_BADGES = new Set(["media", "culture", "activist", "diplomat", "aid", "academic", "sport"]);

  const noteInfo = p => (p._k && ((window.FAMNOTES_I18N || {})[p._k]?.notable?.[p._i] || {})[LANG])
    || (p.infoI18n || {})[LANG] || p.info;
  const personName = person => (person.nameI18n || {})[LANG] || person.name;

  function famBadges(f) {
    const out = {}, FN = (window.FAM_NOTES || {})[f.k] || {};
    (FN.notable || []).forEach((p, _i) => {
      if (!p.badge) return;
      (Array.isArray(p.badge) ? p.badge : [p.badge]).forEach(k => {
        if (BADGE[k]) (out[k] = out[k] || []).push({ ...p, _i, _k: f.k });
      });
    });
    (FN.tags || []).forEach(k => { if (BADGE[k] && !out[k]) out[k] = []; });
    if (f.p) out.press = (f.pn || []).map(x => ({ name: x.n, info: x.o }));
    if (f.hw) out.medic = (out.medic || []).concat((f.hwn || []).map(x => ({ name: x.n, info: x.o })));
    return BADGE_ORDER.filter(k => out[k]).map(k => ({ key: k, people: out[k] }));
  }

  const badgeHtml = f => famBadges(f).map(b => {
    const B = BADGE[b.key], names = b.people.map(personName).join(", ");
    const cnt = b.key === "press" && f.p > 1 ? f.p
      : b.key === "medic" && f.hw > 1 ? f.hw
      : b.key === "unrwa" && b.people.length > 1 ? b.people.length
      : PUBLIC_BADGES.has(b.key) && b.people.length > 1 ? b.people.length : "";
    return `<span class="bdg ${B.cls}" title="${esc(B.label)}${names ? ": " + esc(names) : ""}">${B.sym}${cnt}</span>`;
  }).join("");

  const personBadgeHtml = person => (Array.isArray(person.badge) ? person.badge : [person.badge])
    .filter(key => BADGE[key]).map(key => {
      const B = BADGE[key];
      return `<span class="bdg ${B.cls}" title="${esc(B.label)}">${B.sym}</span>`;
    }).join("");

  const BIO_PEOPLE = Object.entries(window.FAM_NOTES || {}).flatMap(([family, note]) => {
    const index = FAM_INDEX.get(family);
    if (index == null) return [];
    return (note.notable || []).filter(person => person.name).map(person => ({ family, index, person }));
  });

  function badgeBlock(f) {
    const bs = famBadges(f);
    if (!bs.length) return "";
    return `<div class="badgebox"><h4>${t("fam.badgebox")}</h4>` + bs.map(b => {
      const B = BADGE[b.key];
      const who = b.people.length ? b.people.map(p =>
          (p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${esc(personName(p))}</a>` : `<b>${esc(personName(p))}</b>`)
          + (noteInfo(p) ? ` <span class="fine">— ${esc(noteInfo(p))}</span>` : "")).join("<br>")
        : `<span class="fine">${t("fam.badge.undoc")}</span>`;
      return `<div class="badgeline"><span class="bdg ${B.cls}">${B.sym}</span>
        <div><b>${B.label}</b><div class="badgewho">${who}</div></div></div>`;
    }).join("") + `</div>`;
  }

  const famRow = (f, i) => `<div class="famrow" data-i="${i}"><b>${cap(f.k)}</b>${badgeHtml(f)}
    <span class="meta">${t("fam.meta", nf.format(f.n), f.m, f.f, f.kids)}
    ${f.sib ? t("fam.sib", f.sib, f.big) : ""}</span></div>`;

  const TOPN = 100;
  const curated = new Set(Object.entries(window.FAM_NOTES || {})
    .filter(([_key, note]) => note.origin || (note.notable || []).some(person => !person.generated))
    .map(([key]) => key));
  const TOPSET = FAMS.map((f, i) => ({ f, i })).filter(({ f }, rank) => rank < TOPN || curated.has(f.k));
  const badgeWeight = f => {
    const bs = famBadges(f);
    return bs.length * 1000 + bs.reduce((sum, b) => sum + b.people.length, 0);
  };
  const badgePeople = (f, key) => famBadges(f).find(badge => badge.key === key)?.people.length || 0;
  const hasBadge = (f, key) => famBadges(f).some(badge => badge.key === key);
  const unrwaFamilies = FAMS.filter(f => badgePeople(f, "unrwa") > 0);
  const unrwaNamed = unrwaFamilies.reduce((sum, f) => sum + badgePeople(f, "unrwa"), 0);
  const unrwaWithFighter = unrwaFamilies.filter(f => hasBadge(f, "fighter")).length;
  const unrwaWithoutFighter = unrwaFamilies.length - unrwaWithFighter;
  const COLS = [
    { k: "k",     t: t("col.family"), v: o => o.f.k, txt: true },
    { k: "bdg",   t: t("col.badges"), v: o => badgeWeight(o.f) },
    { k: "unrwa", t: t("col.unrwa"), title: t("col.unrwa.tip"), v: o => badgePeople(o.f, "unrwa") },
    { k: "n",     t: t("col.dead"), v: o => o.f.n },
    { k: "avg",   t: t("col.avgdiff"), title: t("col.avgdiff.tip", avgNf.format(AVG_FAMILY_LOSSES)),
      v: o => o.f.n - AVG_FAMILY_LOSSES },
    { k: "m",     t: t("col.men"), v: o => o.f.m },
    { k: "f",     t: t("col.women"), v: o => o.f.f },
    { k: "ratio", t: t("col.sexratio"), title: t("col.sexratio.tip"), v: o => ratioValue(o.f) },
    { k: "kids",  t: "&lt;18", v: o => o.f.kids },
    { k: "sib",   t: t("col.sib"), v: o => o.f.sib },
  ];
  let sortK = "n", sortDir = -1;

  function renderTop() {
    const col = COLS.find(c => c.k === sortK);
    const rows = TOPSET.slice().sort((a, b) => {
      const av = col.v(a), bv = col.v(b);
      const d = col.txt ? String(av).localeCompare(String(bv), "de") : av === bv ? 0 : av < bv ? -1 : 1;
      return d !== 0 ? d * sortDir : b.f.n - a.f.n;
    });
    document.getElementById("famTop").innerHTML =
      `<div class="criterion-summary">${t("fam.unrwa.summary", nf.format(unrwaNamed), nf.format(unrwaFamilies.length), nf.format(unrwaWithFighter), nf.format(unrwaWithoutFighter))}</div>` +
      `<div class="avg-note">${t("fam.avg.note", nf.format(FAMS.length), avgNf.format(AVG_FAMILY_LOSSES))} ${t("fam.ratio.note")}</div>` +
      `<table><thead><tr>` + COLS.map(c =>
        `<th data-k="${c.k}"${c.title ? ` title="${esc(c.title)}"` : ""}${sortK === c.k ? ' class="sorted"' : ""}>${c.t}` +
        `${sortK === c.k ? (sortDir < 0 ? " ▾" : " ▴") : ""}</th>`).join("") +
      `</tr></thead><tbody>` + rows.map(({ f, i }) =>
        `<tr data-i="${i}"><td>${cap(f.k)}${i >= TOPN ? ` <span class="fine">${t("fam.rank", i + 1)}</span>` : ""}</td>` +
        `<td class="bdgcell">${badgeHtml(f)}</td><td class="unrwacount">${nf.format(badgePeople(f, "unrwa"))}</td><td>${nf.format(f.n)}</td>` +
        `<td class="avgdiff" title="${esc(t("col.avgdiff.cell", nf.format(f.n), avgNf.format(AVG_FAMILY_LOSSES), signedAvgNf.format(f.n - AVG_FAMILY_LOSSES), avgNf.format(f.n / AVG_FAMILY_LOSSES)))}">${signedAvgNf.format(f.n - AVG_FAMILY_LOSSES)}</td>` +
        `<td>${nf.format(f.m)}</td><td>${nf.format(f.f)}</td>` +
        `<td class="sexratio" title="${esc(t("col.sexratio.cell", nf.format(f.m), nf.format(f.f)))}">${ratioText(f)}</td>` +
        `<td>${nf.format(f.kids)}</td><td>${f.sib}</td></tr>`).join("") +
      `</tbody></table>`;
  }
  const unrwaScope = document.getElementById("unrwaScope");
  if (unrwaScope) {
    unrwaScope.innerHTML = t("fam.unrwa.scope", nf.format(unrwaNamed)) +
      ` <a href="https://www.unrwa.org/resources/reports/unrwa-situation-report-220-humanitarian-crisis-gaza-strip-and-occupied-west-bank" target="_blank" rel="noopener">${t("fam.unrwa.report")}</a>.`;
  }
  renderTop();

  function openFam(i) {
    const f = FAMS[i];
    let members = "", clusters = "";
    if (LIST) {
      const mem = LIST.filter(row => row[4] === i);
      const groups = {};
      mem.forEach(row => {
        const name = row[0].toLowerCase().split(" ");
        if (name.length >= 4) { const key = name[1] + " " + name[2]; (groups[key] = groups[key] || []).push(row); }
      });
      const siblings = Object.entries(groups).filter(([, group]) => group.length >= 2)
        .sort((a, b) => b[1].length - a[1].length);
      if (siblings.length) clusters = `<h4 style="margin:14px 0 6px;color:var(--muted);font-size:13px">${t("fam.sibhead")}</h4>` +
        siblings.slice(0, 12).map(([key, group]) => `<div class="loadhint">${t("fam.kidsof", cap(key))}<b style="color:var(--ink)">${group.length}</b>
          ${t("fam.ages", group.map(row => row[2]).sort((a, b) => a - b).join(", "))}</div>`).join("");
      members = `<h4 style="margin:14px 0 4px;color:var(--muted);font-size:13px">${t("fam.allentries", nf.format(mem.length))}</h4>` +
        mem.sort((a, b) => a[2] - b[2]).slice(0, 400).map(row =>
          `<div class="member"><span class="who">${row[0]}</span><span class="ar">${row[1]}</span>
           <span class="agesex">${row[2]} ${t("unit.yrs")} · ${row[3] === "f" ? "♀" : "♂"}</span></div>`).join("") +
        (mem.length > 400 ? `<div class="loadhint">${t("fam.more", nf.format(mem.length - 400))}</div>` : "");
    } else {
      members = `<div class="loadhint">${t("fam.loadhint")}</div>`;
    }

    const FN = (window.FAM_NOTES || {})[f.k];
    let notes = "";
    const origin = ((window.FAMNOTES_I18N || {})[f.k]?.origin || {})[LANG]
      || (FN && FN.origin)
      || ((window.FAM_ORIGINS_I18N || {})[f.k] || {})[LANG]
      || (window.FAM_ORIGINS || {})[f.k];
    if (origin) notes += `<div class="origin"><span class="lbl">${t("fam.origin.lbl")}</span> ${origin}</div>`;
    notes += badgeBlock(f);
    const rest = ((FN || {}).notable || []).map((p, _i) => ({ ...p, _i, _k: f.k })).filter(p => !p.badge);
    if (rest.length) notes += `<div class="origin">` + rest.map(p =>
      `<div><span class="lbl">${t("fam.also")}</span> <a href="${p.url}" target="_blank" rel="noopener">${esc(personName(p))}</a>
        — ${noteInfo(p)}</div>`).join("") + `</div>`;
    detail.hidden = false;
    detail.innerHTML = `<h3>${t("fam.family", cap(f.k))}${badgeHtml(f)}</h3>
      <p class="desc">${t("fam.meta", nf.format(f.n), f.m, f.f, f.kids)} · ${t("col.sexratio")}: ${ratioText(f)} ${f.sib ? t("fam.sib", f.sib, f.big) : ""}</p>${notes}${clusters}${members}`;
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function run() {
    const raw = input.value.trim();
    const query = searchNorm(raw);
    if (query.length < 2) { results.innerHTML = ""; return; }
    const families = FAMS.map((f, i) => [f, i]).filter(([f]) => searchNorm(f.k).includes(query)).slice(0, 10);
    let html = families.map(([f, i]) => famRow(f, i)).join("");
    const bios = BIO_PEOPLE.filter(({ person }) =>
      [person.name, ...Object.values(person.nameI18n || {})]
        .some(name => searchNorm(name).includes(query))).slice(0, 40);
    if (bios.length) html += `<h4 style="margin:12px 0 4px;color:var(--muted);font-size:13px">${t("fam.bio.head")}</h4>` +
      bios.map(({ family, index, person }) => `<div class="famrow" data-i="${index}"><b>${esc(personName(person))}</b>${personBadgeHtml(person)}
        <span class="meta">${t("fam.bio.family", cap(family))}</span></div>`).join("");
    if (LIST) {
      const people = [];
      for (let i = 0; i < LIST.length && people.length < 40; i++)
        if (searchNorm(LIST[i][0]).includes(query) || LIST[i][1].includes(raw)) people.push(LIST[i]);
      if (people.length) html += `<h4 style="margin:12px 0 4px;color:var(--muted);font-size:13px">${t("fam.person.head")}</h4>` +
        people.map(row => `<div class="member"><span class="who">${row[0]}</span><span class="ar">${row[1]}</span>
          <span class="agesex">${row[2]} ${t("unit.yrs")} · ${row[3] === "f" ? "♀" : "♂"}</span></div>`).join("");
    }
    results.innerHTML = html || `<div class="loadhint">${t("fam.none", LIST ? t("fam.none.person") : "")}</div>`;
  }

  input.addEventListener("focus", loadList, { once: true });
  input.addEventListener("input", run);
  results.addEventListener("click", event => {
    const row = event.target.closest(".famrow"); if (row) openFam(+row.dataset.i);
  });
  document.getElementById("famTop").addEventListener("click", event => {
    const heading = event.target.closest("th[data-k]");
    if (heading) {
      if (sortK === heading.dataset.k) sortDir = -sortDir;
      else { sortK = heading.dataset.k; sortDir = sortK === "k" ? 1 : -1; }
      renderTop(); return;
    }
    const row = event.target.closest("tr[data-i]"); if (row) openFam(+row.dataset.i);
  });
})();
