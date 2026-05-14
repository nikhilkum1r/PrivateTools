const fs = require('fs');
const path = require('path');

const SOURCE_LOCALE = 'en';
const LOCALES = [
  "hi", "es", "ar", "fr", "zh", "ru", "pt", "de", "ja", "id", "tr", "it", "pl", 
  "vi", "ko", "th", "nl", "fa", "uk", "ms", "cs", "da", "el", "fi", "ro", "sv"
];
const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');

function getKeys(obj, prefix = '') {
    let keys = [];
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getKeys(obj[key], `${prefix}${key}.`));
        } else {
            keys.push(`${prefix}${key}`);
        }
    }
    return keys;
}

let hasErrors = false;

const sourceDir = path.join(MESSAGES_DIR, SOURCE_LOCALE);
const sourceFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

console.log(`🔍 Validating ${LOCALES.length} locales against "${SOURCE_LOCALE}"...`);

for (const locale of LOCALES) {
    const targetDir = path.join(MESSAGES_DIR, locale);
    if (!fs.existsSync(targetDir)) {
        console.error(`❌ Locale directory missing: ${locale}`);
        hasErrors = true;
        continue;
    }

    for (const file of sourceFiles) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);

        if (!fs.existsSync(targetPath)) {
            console.error(`❌ [${locale}] Missing file: ${file}`);
            hasErrors = true;
            continue;
        }

        try {
            const sourceJSON = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
            const targetJSON = JSON.parse(fs.readFileSync(targetPath, 'utf8'));

            const sourceKeys = getKeys(sourceJSON);
            const targetKeys = getKeys(targetJSON);

            const missingKeys = sourceKeys.filter(k => !targetKeys.includes(k));
            const extraKeys = targetKeys.filter(k => !sourceKeys.includes(k));

            if (missingKeys.length > 0) {
                console.error(`❌ [${locale}/${file}] Missing keys:\n  - ${missingKeys.join('\n  - ')}`);
                hasErrors = true;
            }

            if (extraKeys.length > 0) {
                console.warn(`⚠️ [${locale}/${file}] Extra keys (stale?):\n  - ${extraKeys.join('\n  - ')}`);
            }
        } catch (e) {
            console.error(`❌ [${locale}/${file}] Failed to parse JSON: ${e.message}`);
            hasErrors = true;
        }
    }
}

if (!hasErrors) {
    console.log("\n✨ All translations are structurally valid!");
} else {
    console.log("\n❌ Translation validation failed.");
    process.exit(1);
}
