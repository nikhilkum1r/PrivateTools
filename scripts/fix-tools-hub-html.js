const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');
const locales = fs.readdirSync(messagesDir).filter(f => fs.statSync(path.join(messagesDir, f)).isDirectory());

locales.forEach(locale => {
  const filePath = path.join(messagesDir, locale, 'tools_hub.json');
  if (fs.existsSync(filePath)) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('<br/>')) {
        content = content.replace(/<br\/>/g, '<br></br>');
        fs.writeFileSync(filePath, content);
        console.log(`Updated <br/> to <br></br> in ${locale}/tools_hub.json`);
      }
    } catch (e) {
      console.error(`Error processing ${locale}/tools_hub.json:`, e);
    }
  }
});
