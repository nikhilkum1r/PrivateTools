import json
import os
import time
from deep_translator import GoogleTranslator

SOURCE_LOCALE = 'en'
LOCALES = ['hi', 'es', 'ar', 'fr', 'zh', 'ru', 'pt', 'de', 'ja']
MESSAGES_DIR = 'src/i18n/messages'

locale_map = {
    'zh': 'zh-CN',
}

def translate_value(val, translator, max_retries=3):
    if not isinstance(val, str) or not val.strip():
        return val
    
    # Don't translate placeholders exactly
    if val == "RISK {score}%":
        return val
        
    for _ in range(max_retries):
        try:
            return translator.translate(val)
        except Exception as e:
            time.sleep(1)
            continue
    return val

def translate_dict(d, translator):
    res = {}
    for k, v in d.items():
        if isinstance(v, dict):
            res[k] = translate_dict(v, translator)
        elif isinstance(v, list):
            res[k] = [translate_dict(i, translator) if isinstance(i, dict) else translate_value(i, translator) for i in v]
        elif isinstance(v, str):
            res[k] = translate_value(v, translator)
        else:
            res[k] = v
    return res

if __name__ == '__main__':
    with open(os.path.join(MESSAGES_DIR, SOURCE_LOCALE, 'metadata_cleaner.json'), 'r') as f:
        source_data = json.load(f)
    
    for loc in LOCALES:
        print(f"Translating to {loc}...")
        target_lang = locale_map.get(loc, loc)
        translator = GoogleTranslator(source='en', target=target_lang)
        
        target_path = os.path.join(MESSAGES_DIR, loc, 'metadata_cleaner.json')
        if os.path.exists(target_path):
            with open(target_path, 'r') as f:
                target_data = json.load(f)
        else:
            target_data = {}
            
        target_data["metadataCleaner"] = translate_dict(source_data["metadataCleaner"], translator)
        
        # Quick fix for placeholders just in case
        try:
            risk_val = target_data["metadataCleaner"]["engine"]["queue"]["status"]["risk"]
            if "{score}" not in risk_val:
                target_data["metadataCleaner"]["engine"]["queue"]["status"]["risk"] = "RISK {score}%"
        except KeyError:
            pass

        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(target_data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"Done {loc}")
