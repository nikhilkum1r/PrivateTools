const fs = require('fs');
let content = fs.readFileSync('src/i18n/messages/en.json', 'utf8');

// The file currently has:
// "CommandPalette": {
//   ...
// }

// If we try to parse it, it will complain about unexpected end of file because the root object wasn't closed.
// Let's just append `\n}` and check if it parses.

content += '\n}';

try {
  JSON.parse(content);
  console.log("Fixed by adding closing brace!");
  fs.writeFileSync('src/i18n/messages/en.json', content);
} catch (e) {
  console.log("Still failing:", e.message);
}
