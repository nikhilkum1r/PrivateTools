const fs = require('fs');
const files = [
  'src/app/[locale]/audio/page.tsx',
  'src/app/[locale]/video/page.tsx',
  'src/app/[locale]/security/page.tsx',
  'src/app/[locale]/privacy/password-generator/page.tsx',
  'src/app/[locale]/privacy/secure-notes/page.tsx',
  'src/app/[locale]/devtools/data-converter/page.tsx',
  'src/app/[locale]/developers/page.tsx',
  'src/app/[locale]/cookies/page.tsx',
  'src/app/[locale]/blog/page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/title:\s*t\("title"\)/g, 'title: t("seo.title")');
    content = content.replace(/description:\s*t\("description"\)/g, 'description: t("seo.description")');
    fs.writeFileSync(f, content);
    console.log('Fixed', f);
  }
});
