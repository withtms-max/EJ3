import re

with open(r'C:\THE3studio\비즈컷\bizcut-main\constants.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_array(arr_name):
    pattern = rf'export const {arr_name}.*?=\s*(\[.*?\]);'
    match = re.search(pattern, content, re.DOTALL)
    if not match: return '[]'
    val = match.group(1)
    val = re.sub(r'icon:\s*<[^>]+>,?', '', val)
    return val

js_content = f"""
const SHOP_CATEGORIES = {extract_array('SHOP_CATEGORIES')};
const PHOTO_STYLES = {extract_array('PHOTO_STYLES')};
const PORTRAIT_STYLES_MALE = {extract_array('PORTRAIT_STYLES_MALE')};
const PORTRAIT_STYLES_FEMALE = {extract_array('PORTRAIT_STYLES_FEMALE')};
const BEAUTY_STYLES_MALE = {extract_array('BEAUTY_STYLES_MALE')};
const BEAUTY_STYLES_FEMALE = {extract_array('BEAUTY_STYLES_FEMALE')};

window.THE3CUT_DATA = {{
    SHOP_CATEGORIES,
    PHOTO_STYLES,
    PORTRAIT_STYLES_MALE,
    PORTRAIT_STYLES_FEMALE,
    BEAUTY_STYLES_MALE,
    BEAUTY_STYLES_FEMALE
}};
"""

with open(r'c:\THE3studio\js\the3cut-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Created the3cut-data.js successfully.")
