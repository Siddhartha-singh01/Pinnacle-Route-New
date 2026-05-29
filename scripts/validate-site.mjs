import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const htmlFiles = [];
const staticFiles = new Set();
const issues = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;

    const file = path.join(dir, name);
    const stat = fs.statSync(file);

    if (stat.isDirectory()) {
      walk(file);
      continue;
    }

    staticFiles.add(path.relative(root, file).replaceAll(path.sep, "/"));
    if (file.endsWith(".html")) htmlFiles.push(file);
  }
}

walk(root);

function stripQuery(value) {
  return value.split("#")[0].split("?")[0];
}

function isExternal(value) {
  return /^(https?:|mailto:|tel:|#)/.test(value);
}

function routeExists(value) {
  const clean = stripQuery(value);
  if (!clean || isExternal(clean)) return true;

  const relative = clean.startsWith("/") ? clean.slice(1) : clean;
  const candidates = [
    relative,
    `${relative}.html`,
    `${relative.replace(/\/$/, "")}/index.html`,
  ];

  return candidates.some((candidate) => {
    const normalized = candidate || "index.html";
    return staticFiles.has(normalized);
  });
}

function assetExists(value) {
  const clean = stripQuery(value);
  if (!clean || isExternal(clean) || clean.startsWith("data:")) return true;

  const relative = clean.startsWith("/") ? clean.slice(1) : clean;
  return staticFiles.has(relative);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file).replaceAll(path.sep, "/");

  if (!/<title>[^<]+<\/title>/.test(html)) issues.push(`${rel}: missing <title>`);
  if (!/<meta\s+name=["']description["']/.test(html)) issues.push(`${rel}: missing meta description`);
  if (/<a\b(?=[^>]*\sdata-href=)(?![^>]*\shref=)/.test(html)) {
    issues.push(`${rel}: data-href anchor without href fallback`);
  }

  for (const match of html.matchAll(/<a\b[^>]*\shref=["']([^"']+)["'][^>]*>/g)) {
    if (!routeExists(match[1])) issues.push(`${rel}: broken link ${match[1]}`);
  }

  for (const match of html.matchAll(/<(?:img|script)\b[^>]*\s(?:src)=["']([^"']+)["'][^>]*>/g)) {
    if (!assetExists(match[1])) issues.push(`${rel}: missing asset ${match[1]}`);
  }

  for (const match of html.matchAll(/<link\b[^>]*\shref=["']([^"']+)["'][^>]*>/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    if (!assetExists(href) && !routeExists(href)) issues.push(`${rel}: missing href target ${href}`);
  }
}

if (issues.length) {
  console.error(`Site validation found ${issues.length} issue(s):`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Site validation passed for ${htmlFiles.length} HTML files.`);
