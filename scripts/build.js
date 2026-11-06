// Copies src/ to dist/ and fails the build on broken links, missing assets or exposed secrets.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), src = path.join(root, "src"), dist = path.join(root, "dist");
fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(src, dist, { recursive: true });
const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(dist), errs = [];
const ids = f => new Set([...fs.readFileSync(f, "utf8").matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const f of files.filter(f => f.endsWith(".html"))) {
  const h = fs.readFileSync(f, "utf8"), own = ids(f), rel = path.relative(dist, f);
  for (const m of h.matchAll(/(?:href|src|srcset)="([^"]+)"/g)) {
    const v = m[1];
    if (/^(mailto:|tel:)/.test(v)) continue;
    if (/^https?:/.test(v)) { if (!v.startsWith("https://www.instagram.com/")) errs.push(`${rel}: unexpected external URL ${v}`); continue; }
    if (v.startsWith("#")) { if (v !== "#" && !own.has(v.slice(1))) errs.push(`${rel}: missing anchor ${v}`); continue; }
    const [p, hash] = v.split("#"), t = path.join(path.dirname(f), p);
    if (!fs.existsSync(t)) { errs.push(`${rel}: missing file ${v}`); continue; }
    if (hash && p.endsWith(".html") && !ids(t).has(hash)) errs.push(`${rel}: missing anchor ${v}`);
  }
}
const secret = /(api[_-]?key|secret|passw(or)?d|token)\s*[:=]\s*["'][^"']+["']|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}/i;
for (const f of files.filter(f => /\.(html|css|js|json|txt|svg)$/.test(f)))
  if (secret.test(fs.readFileSync(f, "utf8"))) errs.push(`${path.relative(dist, f)}: possible secret`);
if (errs.length) { console.error("Build failed:\n" + errs.join("\n")); process.exit(1); }
console.log(`Build OK: ${files.length} files in dist/ (${files.filter(f => f.endsWith(".html")).length} pages), all links and assets resolve, no secrets found.`);
