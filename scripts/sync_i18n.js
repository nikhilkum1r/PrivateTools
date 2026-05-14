const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');
const SOURCE_LOCALE = 'en';

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && !Array.isArray(source[key])) {
      Object.assign(source[key], deepMerge(target[key] || {}, source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

function syncI18n() {
  console.log('Syncing i18n files...');
  
  const locales = fs.readdirSync(MESSAGES_DIR).filter(file => {
    return fs.statSync(path.join(MESSAGES_DIR, file)).isDirectory();
  });

  const sourceFiles = fs.readdirSync(path.join(MESSAGES_DIR, SOURCE_LOCALE))
    .filter(f => f.endsWith('.json'));

  for (const locale of locales) {
    if (locale === SOURCE_LOCALE) continue;

    for (const file of sourceFiles) {
      const sourcePath = path.join(MESSAGES_DIR, SOURCE_LOCALE, file);
      const targetPath = path.join(MESSAGES_DIR, locale, file);

      const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

      if (!fs.existsSync(targetPath)) {
        console.log(`[+] Creating missing file in ${locale}: ${file}`);
        fs.writeFileSync(targetPath, JSON.stringify(sourceContent, null, 2) + '\n', 'utf8');
      } else {
        const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        
        // Deep merge source content into target content (target overwrites source where it exists)
        // Wait, deepMerge above mutates the first arg and overwrites. Let's rewrite it simply.
        
        const mergedContent = mergeObjects(sourceContent, targetContent);
        fs.writeFileSync(targetPath, JSON.stringify(mergedContent, null, 2) + '\n', 'utf8');
      }
    }
  }
  console.log('\n[✅] All i18n files synced!');
}

function mergeObjects(source, target) {
  const result = { ...source }; // start with source to get missing keys
  for (const key in target) {
    if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key]) && source[key] && typeof source[key] === 'object') {
      result[key] = mergeObjects(source[key], target[key]);
    } else {
      result[key] = target[key]; // keep target's translation
    }
  }
  return result;
}

syncI18n();
