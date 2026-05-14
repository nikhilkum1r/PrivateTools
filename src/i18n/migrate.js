const fs = require('fs');
const path = require('path');

const locales = ['ar', 'de', 'en', 'es', 'fr', 'hi', 'ja', 'ru', 'zh'];
const messagesPath = '/home/nikhil/Startup/SafeTools/src/i18n/messages';

const mapping = {
  'common.json': ['Common', 'Navbar', 'Footer', 'CommandPalette', 'Trust'],
  'marketing.json': ['HomePage', 'Hero', 'Features', 'Guide', 'About', 'Pricing', 'FAQ'],
  'legal.json': ['Privacy', 'Terms'],
  'tools.json': ['Tools', 'imageHub', 'compressor', 'audio'],
  'security.json': ['steganography', 'passwordGenerator'],
  'devtools.json': ['Developers'],
  'studio.json': ['Studio']
};

locales.forEach(locale => {
  const filePath = path.join(messagesPath, `${locale}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${locale}, file not found.`);
    return;
  }

  console.log(`Processing ${locale}...`);
  let data;
  try {
    const content = fs.readFileSync(filePath, 'utf8').trim();
    data = content ? JSON.parse(content) : {};
  } catch (e) {
    console.warn(`Warning parsing ${locale}.json, using empty object.`, e.message);
    data = {};
  }
  
  const localeDir = path.join(messagesPath, locale);

  if (!fs.existsSync(localeDir)) {
    fs.mkdirSync(localeDir, { recursive: true });
  }

  Object.entries(mapping).forEach(([fileName, keys]) => {
    const fileContent = {};
    keys.forEach(key => {
      if (data[key]) {
        fileContent[key] = data[key];
      }
    });
    if (Object.keys(fileContent).length > 0) {
      fs.writeFileSync(path.join(localeDir, fileName), JSON.stringify(fileContent, null, 2));
    }
  });

  // Check for any leftover keys
  const allMappedKeys = Object.values(mapping).flat();
  const leftover = {};
  Object.keys(data).forEach(key => {
    if (!allMappedKeys.includes(key)) {
      leftover[key] = data[key];
    }
  });

  if (Object.keys(leftover).length > 0) {
    console.log(`Leftover keys for ${locale}:`, Object.keys(leftover));
    fs.writeFileSync(path.join(localeDir, 'other.json'), JSON.stringify(leftover, null, 2));
  }
  
  // Backup original instead of deleting
  fs.renameSync(filePath, path.join(messagesPath, `${locale}.json.bak`));
});

console.log('Migration complete.');
