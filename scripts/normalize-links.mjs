import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;

    const file = path.join(dir, name);
    const stat = fs.statSync(file);

    if (stat.isDirectory()) walk(file);
    else if (file.endsWith(".html")) files.push(file);
  }
}

walk(root);

let changed = 0;
let anchors = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const next = html.replace(/<a\b([^>]*?)>/g, (tag, attrs) => {
    if (/\shref\s*=/.test(attrs) || !/\sdata-href\s*=/.test(attrs)) return tag;

    const match = attrs.match(/\sdata-href\s*=\s*("[^"]*"|'[^']*')/);
    if (!match) return tag;

    anchors += 1;
    return `<a href=${match[1]}${attrs}>`;
  });

  if (next !== html) {
    fs.writeFileSync(file, next);
    changed += 1;
  }
}

console.log(`Updated ${anchors} anchors in ${changed} files.`);

