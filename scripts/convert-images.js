#!/usr/bin/env node
/**
 * convert-images.js
 * Converts large public/*.png files to WebP using the `sharp` package (if installed)
 * OR falls back to documenting the exact commands to run manually.
 *
 * Run: node scripts/convert-images.js
 *
 * If sharp is not installed: npm install --save-dev sharp
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const PNG_FILES = [
  'hero-bg-dark.png',
  'hero-bg-light.png',
  'hero-engine-dark.png',
  'hero-engine-light.png',
  'hero-woman.png',
  'footer-bg-dark.png',
  'footer-bg-light.png',
  'og-image.png',
  'security-bg-dark.png',
  'security-bg-light.png',
  'site-bg-dark.png',
  'site-bg-light.png',
];

async function convertAll() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.log('\n⚠️  `sharp` not installed. Run:\n  npm install --save-dev sharp\n  node scripts/convert-images.js\n');
    console.log('── Manual fallback using system cwebp ──');
    console.log('Install: sudo apt install webp');
    PNG_FILES.forEach(f => {
      const inPath = path.join('public', f);
      const outPath = path.join('public', f.replace('.png', '.webp'));
      console.log(`cwebp -q 85 ${inPath} -o ${outPath}`);
    });
    return;
  }

  let totalSavedBytes = 0;

  for (const file of PNG_FILES) {
    const inPath = path.join(PUBLIC_DIR, file);
    const outPath = path.join(PUBLIC_DIR, file.replace('.png', '.webp'));

    if (!fs.existsSync(inPath)) {
      console.log(`⏭  Skipping (not found): ${file}`);
      continue;
    }

    const inSize = fs.statSync(inPath).size;

    try {
      await sharp(inPath)
        .webp({ quality: 85, effort: 4 })
        .toFile(outPath);

      const outSize = fs.statSync(outPath).size;
      const saved = inSize - outSize;
      const pct = Math.round((saved / inSize) * 100);
      totalSavedBytes += saved;

      console.log(
        `✅ ${file.padEnd(28)} ${(inSize / 1024).toFixed(0).padStart(5)} KB → ` +
        `${(outSize / 1024).toFixed(0).padStart(5)} KB  (−${pct}%)`
      );
    } catch (err) {
      console.error(`❌ Failed to convert ${file}:`, err.message);
    }
  }

  const savedMB = (totalSavedBytes / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Total saved: ${savedMB} MB`);
  console.log('\nNext: update any CSS/component references from .png → .webp');
  console.log('      Or keep both and let next/image serve the optimized version.');
}

convertAll();
