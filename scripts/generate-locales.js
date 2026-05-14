const fs = require('fs');
const path = require('path');

const SOURCE_LOCALE = 'en';
const LOCALES = [
  "hi", "es", "ar", "fr", "zh", "ru", "pt", "de", "ja", "id", "tr", "it", "pl", 
  "vi", "ko", "th", "nl", "fa", "uk", "ms", "cs", "da", "el", "fi", "ro", "sv"
];
const MESSAGES_DIR = path.join(__dirname, '../src/i18n/messages');

function syncObjects(source, target) {
    const result = { ...target };
    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            result[key] = syncObjects(source[key], target[key] || {});
        } else if (target[key] === undefined) {
            result[key] = source[key];
        }
    }
    return result;
}

const sourceDir = path.join(MESSAGES_DIR, SOURCE_LOCALE);
const sourceFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

console.log(`🚀 Syncing ${LOCALES.length} locales with "${SOURCE_LOCALE}" source...`);

for (const locale of LOCALES) {
    const targetDir = path.join(MESSAGES_DIR, locale);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    for (const file of sourceFiles) {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        
        const sourceJSON = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
        let targetJSON = {};
        
        if (fs.existsSync(targetPath)) {
            targetJSON = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
        }

        const syncedJSON = syncObjects(sourceJSON, targetJSON);
        fs.writeFileSync(targetPath, JSON.stringify(syncedJSON, null, 2));
    }
    console.log(`✅ Synced ${sourceFiles.length} files to "${locale}"`);
}

console.log("\n✨ All locales synced successfully!");
