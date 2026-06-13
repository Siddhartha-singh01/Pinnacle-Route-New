/**
 * Convert heavy PNG brand assets to WebP for faster footer load times.
 * Run once: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Files to convert: [source, destination, quality]
const conversions = [
  // Brand logos (footer + nav)
  ['public/assets/brand/logo-full.png', 'public/assets/brand/logo-full.webp', 90],
  ['public/assets/brand/logo-gold.png', 'public/assets/brand/logo-gold.webp', 90],
  // logo-gold-transparent.png & favicon-web.png stay as PNG (transparency critical)
];

for (const [src, dest, quality] of conversions) {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);
  try {
    const srcStat = await stat(srcPath);
    await sharp(srcPath).webp({ quality }).toFile(destPath);
    const destStat = await stat(destPath);
    const saved = ((1 - destStat.size / srcStat.size) * 100).toFixed(1);
    console.log(`✓ ${src} → ${dest}  (${(srcStat.size/1024).toFixed(0)}KB → ${(destStat.size/1024).toFixed(0)}KB, -${saved}%)`);
  } catch (err) {
    console.error(`✗ Failed: ${src}`, err.message);
  }
}

console.log('\nDone! Update Footer.astro to use logo-full.webp');
