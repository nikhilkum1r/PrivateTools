const fs = require('fs');
let content = fs.readFileSync('src/i18n/messages/en.json', 'utf8');
try {
  JSON.parse(content);
  console.log("Valid JSON");
} catch(e) {
  console.log(e.message);
  
  // The error is Extra data. We can find where the root object ends.
  // A quick way is to wrap everything in { "merged": [ ... ] } and see if that parses? No.
  
  // Let's just fix it manually using string manipulation.
  // We know the end of the file looks like:
  /*
    }
  }
},
"CommandPalette": {
  ...
}
  */
  // But wait, it's missing the closing } for the root object at the very end of the file!
  // AND the root object was closed too early before CommandPalette.
  // Let's remove the extra closing brace before CommandPalette and add one at the very end.
  
  let match = content.match(/\s*\},\s*"CommandPalette": \{/);
  if (match) {
    console.log("Found CommandPalette!");
    // replace `},\n"CommandPalette": {` with `,\n"CommandPalette": {`
    // Wait, if it was `  }\n},\n"CommandPalette": {`
    // Let's just replace `},\n"CommandPalette"` with `,\n"CommandPalette"`
    content = content.replace(/\},\s*"CommandPalette":/, ',\n"CommandPalette":');
    
    // Check if the end of the file has a closing brace.
    if (!content.trim().endsWith('}')) {
       content += '\n}';
    }
    
    try {
      JSON.parse(content);
      console.log("Fixed!");
      fs.writeFileSync('src/i18n/messages/en.json', content);
    } catch(e2) {
      console.log("Still failing:", e2.message);
    }
  } else {
    console.log("Could not find CommandPalette pattern");
  }
}
