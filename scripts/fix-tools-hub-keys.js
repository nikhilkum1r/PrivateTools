const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');
const locales = fs.readdirSync(messagesDir).filter(f => fs.statSync(path.join(messagesDir, f)).isDirectory());

locales.forEach(locale => {
  const filePath = path.join(messagesDir, locale, 'tools_hub.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.categories) {
        if (data.categories.image && !data.categories.creative) {
          data.categories.creative = data.categories.image;
          delete data.categories.image;
        }
        if (data.categories.pdf && !data.categories.documents) {
          data.categories.documents = data.categories.pdf;
          delete data.categories.pdf;
        }
        if (data.categories.video && !data.categories.media) {
          data.categories.media = data.categories.video;
          delete data.categories.video;
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        console.log(`Updated ${locale}/tools_hub.json`);
      }
    } catch (e) {
      console.error(`Error processing ${locale}/tools_hub.json:`, e);
    }
  }
});
