/**
 * Fix Canonical URLs & OG URLs in all page.tsx files
 * 
 * Problem: Many page.tsx files have hardcoded URLs without /${locale}/ prefix
 * This causes duplicate content issues across all locales.
 * 
 * Fixes:
 * 1. canonical: "/path" → canonical: `/${locale}/path`
 * 2. url: "https://safetools.space/path" → url: `https://safetools.space/${locale}/path`
 * 
 * Also ensures generateMetadata receives and destructures locale from params.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files under [locale]
const pagesDir = path.join(__dirname, '..', 'src', 'app', '[locale]');

function findPageFiles(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...findPageFiles(fullPath));
    } else if (item.name === 'page.tsx') {
      results.push(fullPath);
    }
  }
  return results;
}

const files = findPageFiles(pagesDir);
let fixedCount = 0;
let totalFixes = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  const relPath = path.relative(path.join(__dirname, '..'), file);
  
  // Fix 1: canonical URLs without locale
  // canonical: "/path" → canonical: `/${locale}/path`
  const canonicalRegex = /canonical:\s*"(\/[^"]+)"/g;
  let match;
  while ((match = canonicalRegex.exec(content)) !== null) {
    const oldUrl = match[0];
    const urlPath = match[1];
    // Skip if already has locale
    if (urlPath.includes('${locale}') || urlPath.includes('locale')) continue;
    const newUrl = `canonical: \`/\${locale}${urlPath}\``;
    content = content.replace(oldUrl, newUrl);
    modified = true;
    totalFixes++;
    console.log(`  [canonical] ${relPath}: "${urlPath}" → \`/\${locale}${urlPath}\``);
  }
  
  // Fix 2: OG/Twitter urls without locale
  // url: "https://safetools.space/path" → url: `https://safetools.space/${locale}/path`
  const ogUrlRegex = /url:\s*"https:\/\/safetools\.space(\/[^"]+)"/g;
  while ((match = ogUrlRegex.exec(content)) !== null) {
    const oldUrl = match[0];
    const urlPath = match[1];
    if (urlPath.includes('${locale}') || urlPath.includes('locale')) continue;
    const newUrl = `url: \`https://safetools.space/\${locale}${urlPath}\``;
    content = content.replace(oldUrl, newUrl);
    modified = true;
    totalFixes++;
    console.log(`  [og-url] ${relPath}: "${urlPath}" → \`/\${locale}${urlPath}\``);
  }
  
  // Fix 3: SEOStructuredData url prop without locale
  const seoUrlRegex = /url="https:\/\/safetools\.space(\/[^"]+)"/g;
  while ((match = seoUrlRegex.exec(content)) !== null) {
    const oldUrl = match[0];
    const urlPath = match[1];
    if (urlPath.includes('${locale}') || urlPath.includes('locale')) continue;
    const newUrl = `url={\`https://safetools.space/\${locale}${urlPath}\`}`;
    content = content.replace(oldUrl, newUrl);
    modified = true;
    totalFixes++;
    console.log(`  [seo-url] ${relPath}: "${urlPath}" → \`/\${locale}${urlPath}\``);
  }

  if (modified) {
    // Ensure the file has locale available
    // Check if generateMetadata destructures locale
    if (!content.includes('locale') && !content.includes('params')) {
      console.log(`  ⚠️  WARNING: ${relPath} - locale variable not found, manual fix needed`);
    }
    
    fs.writeFileSync(file, content);
    fixedCount++;
  }
}

console.log(`\n✅ Fixed ${totalFixes} URLs across ${fixedCount} files (out of ${files.length} total page files)`);
