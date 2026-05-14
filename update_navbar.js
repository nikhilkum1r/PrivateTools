const fs = require('fs');
const path = require('path');

const locales = fs.readdirSync('src/i18n/messages').filter(l => fs.statSync(`src/i18n/messages/${l}`).isDirectory());

locales.forEach(locale => {
  const file = `src/i18n/messages/${locale}/navbar.json`;
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    
    if (!data.navbar.categories.media) data.navbar.categories.media = "Media Studio";
    if (!data.navbar.items.audioStudio) data.navbar.items.audioStudio = "Audio Studio";
    if (!data.navbar.items.audioStudioDesc) data.navbar.items.audioStudioDesc = "Process & Convert Audio";
    if (!data.navbar.items.videoStudio) data.navbar.items.videoStudio = "Video Studio";
    if (!data.navbar.items.videoStudioDesc) data.navbar.items.videoStudioDesc = "Compress & Convert Video";
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  }
});
console.log('Updated navbar.json across all locales');
