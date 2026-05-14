const fs = require('fs');

const locales = fs.readdirSync('src/i18n/messages').filter(l => fs.statSync(`src/i18n/messages/${l}`).isDirectory());

locales.forEach(locale => {
  const file = `src/i18n/messages/${locale}/tools_hub.json`;
  if (fs.existsSync(file)) {
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (e) {
      return;
    }
    
    if (!data.categories) return;

    if (!data.categories.media) {
      data.categories.media = {
        name: "Media Studio",
        subtitle: "High-Performance Media Engine",
        tools: {}
      };
    }
    
    data.categories.media.tools.audio = {
      name: "Audio Studio",
      desc: "Master, trim, and convert audio files locally."
    };
    
    data.categories.media.tools.video = {
      name: "Video Studio",
      desc: "A comprehensive local video editing environment."
    };
    
    fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  }
});
console.log('Updated tools_hub.json across all locales');
