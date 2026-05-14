import json
import os
import time
import concurrent.futures
from deep_translator import GoogleTranslator

SOURCE_LOCALE = 'en'
LOCALES = ['hi', 'es', 'ar', 'fr', 'zh', 'ru', 'pt', 'de', 'ja']
MESSAGES_DIR = 'src/i18n/messages'

locale_map = {
    'zh': 'zh-CN',
}

def translate_value_worker(val, target_lang):
    if not isinstance(val, str) or not val.strip():
        return val
    if val == "RISK {score}%":
        return val

    translator = GoogleTranslator(source='en', target=target_lang)
    for _ in range(3):
        try:
            return translator.translate(val)
        except Exception:
            time.sleep(1)
            continue
    return val

def flat_dict(d, prefix=''):
    items = []
    for k, v in d.items():
        new_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            items.extend(flat_dict(v, new_key).items())
        elif isinstance(v, list):
            for i, item in enumerate(v):
                if isinstance(item, dict):
                    items.extend(flat_dict(item, f"{new_key}[{i}]").items())
                elif isinstance(item, str):
                    items.append((f"{new_key}[{i}]", item))
        elif isinstance(v, str):
            items.append((new_key, v))
    return dict(items)

def set_nested_value(d, key, val):
    parts = key.split('.')
    current = d
    for part in parts[:-1]:
        if '[' in part:
            name, idx = part.split('[')
            idx = int(idx[:-1])
            if name not in current:
                current[name] = []
            while len(current[name]) <= idx:
                current[name].append({})
            current = current[name][idx]
        else:
            if part not in current:
                current[part] = {}
            current = current[part]
    
    last_part = parts[-1]
    if '[' in last_part:
        name, idx = last_part.split('[')
        idx = int(idx[:-1])
        if name not in current:
            current[name] = []
        while len(current[name]) <= idx:
            current[name].append(None)
        current[name][idx] = val
    else:
        current[last_part] = val

if __name__ == '__main__':
    with open(os.path.join(MESSAGES_DIR, SOURCE_LOCALE, 'metadata_cleaner.json'), 'r') as f:
        source_data = json.load(f)
    
    eng_metadata_cleaner = source_data.get("metadataCleaner", {})
    flat_eng = flat_dict(eng_metadata_cleaner)

    for loc in LOCALES:
        print(f"Translating to {loc}...")
        target_lang = locale_map.get(loc, loc)
        
        translated_flat = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
            futures = {executor.submit(translate_value_worker, v, target_lang): k for k, v in flat_eng.items()}
            for future in concurrent.futures.as_completed(futures):
                k = futures[future]
                try:
                    translated_flat[k] = future.result()
                except Exception as exc:
                    translated_flat[k] = flat_eng[k]

        target_path = os.path.join(MESSAGES_DIR, loc, 'metadata_cleaner.json')
        if os.path.exists(target_path):
            with open(target_path, 'r') as f:
                target_data = json.load(f)
        else:
            target_data = {}

        new_dict = {}
        for k, v in translated_flat.items():
            set_nested_value(new_dict, k, v)
        
        # fix formatting tags
        try:
            risk_val = new_dict["engine"]["queue"]["status"]["risk"]
            if "{score}" not in risk_val:
                new_dict["engine"]["queue"]["status"]["risk"] = "RISK {score}%"
        except Exception:
            pass

        target_data["metadataCleaner"] = new_dict

        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(target_data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"Done {loc}")
