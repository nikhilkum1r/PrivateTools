import os
import re

directory = 'src/i18n/messages'

updated_count = 0
for root, dirs, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.json'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = re.sub(r'<br\s*/?>', '<br></br>', content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated {filepath}")
                updated_count += 1

print(f"Total files updated: {updated_count}")
