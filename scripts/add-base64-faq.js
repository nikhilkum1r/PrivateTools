const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');
const locales = fs.readdirSync(messagesDir).filter(f => fs.statSync(path.join(messagesDir, f)).isDirectory());

const faq = {
  "items": [
    {
      "q": "What is Base64 encoding?",
      "a": "Base64 encoding is a method of converting binary data (like images or documents) into a text string format. This is commonly used to embed images directly into HTML/CSS or transmit data securely without corruption."
    },
    {
      "q": "Is my data secure when using this tool?",
      "a": "Yes! All encoding and decoding processes happen entirely locally in your browser. We never upload your text, images, or files to any external servers."
    },
    {
      "q": "Can I convert images to Base64?",
      "a": "Absolutely. You can drop JPG, PNG, SVG, or other image files into the tool, and it will generate a Data URI format string that you can use directly in your web projects."
    },
    {
      "q": "What are the limitations?",
      "a": "Because the tool runs in your browser, performance is dependent on your device. Very large files might take a moment to encode, but standard images and text strings process instantly."
    }
  ],
  "title": "Frequently Asked Questions",
  "description": "Learn more about Base64 encoding and our secure browser-based tool."
};

locales.forEach(locale => {
  const filePath = path.join(messagesDir, locale, 'base64.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.base64.faq) {
      data.base64.faq = faq;
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`Updated ${locale}/base64.json`);
    } else {
        console.log(`Skipped ${locale}/base64.json (FAQ already exists)`);
    }
  }
});
