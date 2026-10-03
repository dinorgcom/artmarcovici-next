import fs from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

const read = name => JSON.parse(fs.readFileSync(`public/gaza/data/${name}.json`, "utf8"));
const dataset = read("idf-press-files"), families = read("families");
const keys = new Set(families.map(f => f.k));
const norm = s => s.toLowerCase().replace(/muhammad|muhammed|mohammad/g, "mohammed").replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
assert.equal(dataset.records.length, 170);
assert.equal(new Set(dataset.records.map(r => r.url)).size, 170);
assert.equal(new Set(dataset.records.map(r => r.sourceId)).size, 170);
for (const r of dataset.records) {
  assert.ok(r.name && /^https:\/\/www\.idf\.il\/en\/mini-sites\/the-press-files\//.test(r.url));
  assert.ok(!r.family || keys.has(r.family), `${r.name}: invalid group`);
  assert.ok(["exact-surname", "reviewed-transliteration", "unmatched"].includes(r.matchType));
  assert.equal(Boolean(r.family), r.matchType !== "unmatched");
  assert.ok(["linked-material", "not-published", "profile-unavailable"].includes(r.evidenceStatus));
  assert.ok(!Object.keys(r).some(k => /militaryId|idNumber|identityNumber/i.test(k)));
  if (r.evidenceStatus !== "profile-unavailable") assert.ok(r.organization && r.role);
}
if (process.argv.includes("--candidates")) {
  const list = read("list");
  for (const r of dataset.records.filter(r => !r.family)) {
    const given = norm(r.name).split(" ").slice(0, 3);
    const hits = list.filter(row => {
      const tokens = norm(row[0]).split(" ");
      return given.every((g, i) => g === tokens[i]);
    });
    console.log(JSON.stringify({ id: r.sourceId, name: r.name, candidates: hits.map(row => ({ name: row[0], arabic: row[1], group: families[row[4]].k })) }));
  }
} else {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync("public/gaza/js/famnotes.js", "utf8"), ctx);
  vm.runInContext(fs.readFileSync("public/gaza/js/public-figures.js", "utf8"), ctx);
  const existing = Object.values(ctx.window.FAM_NOTES).flatMap(f => (f.notable || []).map(p => norm(p.name || "")));
  const count = field => dataset.records.reduce((out, r) => { out[r[field] || "unmatched"] = (out[r[field] || "unmatched"] || 0) + 1; return out; }, {});
  console.log(JSON.stringify({ records: dataset.records.length, matched: dataset.records.filter(r => r.family).length,
    groups: new Set(dataset.records.filter(r => r.family).map(r => r.family)).size, matches: count("matchType"),
    evidence: count("evidenceStatus"), organizations: count("organization"),
    exactExistingNames: dataset.records.filter(r => existing.includes(norm(r.name))).map(r => r.name) }, null, 2));
}
