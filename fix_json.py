import json
import re
import os
import glob
import subprocess

def fix_en_json():
    filepath = 'src/i18n/messages/en.json'
    with open(filepath, 'r', encoding='utf8') as f:
        content = f.read()
    
    # Let's try to parse it. If it fails, we know there's an issue.
    try:
        json.loads(content)
        print("JSON is already valid")
    except json.JSONDecodeError as e:
        print(f"JSON error at {e.pos}: {e.msg}")
        
        # There's duplicate stuff at the end of Studio.
        # It looks like the block from `"colorLab"` to the end of `"editor"` got duplicated or something.
        # The error is at position 98093. Let's truncate everything after position 98093 up to `"CommandPalette"`
        
        match = re.search(r'"CommandPalette": \{', content)
        if match:
            cmd_palette_idx = match.start()
            
            # Find the last valid closing brace before the error
            first_part = content[:e.pos]
            last_brace = first_part.rfind('}')
            if last_brace != -1:
                # Construct the fixed json
                fixed_content = content[:last_brace+1] + '\n,\n' + content[cmd_palette_idx:]
                
                try:
                    json.loads(fixed_content)
                    print("Fixed JSON successfully by truncating garbage!")
                    with open(filepath, 'w', encoding='utf8') as out:
                        out.write(fixed_content)
                except json.JSONDecodeError as e2:
                    print(f"Still invalid: {e2}")
                    # Try finding the last "CommandPalette" and just append }
                    pass

def find_and_fix_hardcoded():
    # Example logic to replace some known hardcoded strings in CompressorStudioClient
    # Since I already fixed the known ones, I will just do a quick scan
    print("Checking for hardcoded toasts in src/app/[locale]/image/compress/CompressorStudioClient.tsx...")
    target_file = 'src/app/[locale]/image/compress/CompressorStudioClient.tsx'
    if os.path.exists(target_file):
        with open(target_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        if 'toast.info("Switched to Manual Mode")' in content:
            content = content.replace('toast.info("Switched to Manual Mode")', 'toast.info(t("toast.manualMode"))')
            
        with open(target_file, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == '__main__':
    fix_en_json()
    find_and_fix_hardcoded()
    print("Running copy-locales...")
    subprocess.run(["node", "copy-locales.js"])
    print("Running npm run build...")
    subprocess.run(["npm", "run", "build"])
