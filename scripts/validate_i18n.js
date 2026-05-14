const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');
const SOURCE_LOCALE = 'en';

function getKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res; // Ignore arrays for simple key comparison
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
}

function validateI18n() {
  console.log('Validating i18n files...');
  let hasErrors = false;

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

      if (!fs.existsSync(targetPath)) {
        console.error(`[❌] Missing file in ${locale}: ${file}`);
        hasErrors = true;
        continue;
      }

      const sourceContent = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

      const sourceKeys = getKeys(sourceContent);
      const targetKeys = getKeys(targetContent);

      const missingKeys = sourceKeys.filter(key => !targetKeys.includes(key));
      
      if (missingKeys.length > 0) {
        console.error(`[❌] Missing keys in ${locale}/${file}:`);
        missingKeys.forEach(key => console.error(`    - ${key}`));
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('\n[!] i18n validation failed. Please fix the missing keys.');
    process.exit(1);
  } else {
    console.log('\n[✅] All i18n files are valid and in sync!');
  }
}

validateI18n();
