const fs = require('fs');
const src = 'src/i18n/messages/en.json';
const dests = ['zh', 'ru', 'de', 'es', 'fr', 'hi', 'ja'];
const content = fs.readFileSync(src, 'utf8');
for (const dest of dests) {
  fs.writeFileSync(`src/i18n/messages/${dest}.json`, content);
}
console.log('Copied files');
