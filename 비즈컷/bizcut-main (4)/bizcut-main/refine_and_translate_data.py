import json
import os
import time
from concurrent.futures import ThreadPoolExecutor
# Note: In a real environment, you'd need the google-generativeai package.
# This script assumes it's available or uses a mock for demonstration if key is missing.

THEME_MAP_50 = {
    # 기존 35개 유지 및 보강
    "fashion_editorial": ["fashion", "editorial", "magazine", "vogue"],
    "street_style": ["street", "urban", "outfit", "attire"],
    "mirror_selfie": ["mirror", "selfie"],
    "candid_moment": ["candid", "natural", "snapshot"],
    "luxury_lifestyle": ["luxury", "opulent", "expensive", "jewelry"],
    "cinematic_portrait": ["cinematic", "lighting", "dramatic"],
    "studio_pro": ["studio", "backdrop", "professional"],
    "japanese_vibe": ["japanese", "tokyo", "citypop"],
    "vintage_analog": ["vintage", "analog", "film", "90s", "retro"],
    "minimalist_clean": ["minimalist", "clean", "negative space"],
    "cyberpunk_neon": ["cyberpunk", "neon", "futuristic"],
    "fantasy_dreamy": ["fantasy", "ethereal", "magical"],
    "product_cinematic": ["product", "commercial", "advertising"],
    "golden_hour": ["golden hour", "sunset", "warm"],
    "night_cityscape": ["night", "city", "dark"],
    "influencer_snap": ["influencer", "social media", "trendy"],
    "business_pro": ["business", "confident", "suit", "office"],
    "fitness_gym": ["fitness", "gym", "workout"],
    "action_dynamic": ["action", "dynamic", "explosion"],
    "anime_illustration": ["anime", "manga", "illustration"],
    "hyper_realistic": ["hyper realistic", "8k", "ultra detailed"],
    "dark_moody": ["dark", "moody", "noir"],
    "soft_aesthetic": ["soft", "aesthetic", "airy", "pastel"],
    "interior_design": ["interior", "architecture", "room"],
    "travel_explorer": ["travel", "explorer", "mountain"],
    "character_concept": ["character", "concept art", "warrior"],
    "black_white_noir": ["black and white", "monochrome", "b&w"],
    "pop_art_vibrant": ["pop art", "vibrant", "colorful"],
    "historical_classic": ["classical", "historical", "traditional"],
    "graphic_vector": ["graphic", "vector", "flat design"],
    # 신규 15개 추가
    "y2k_retro": ["y2k", "2000s", "bratz", "butterfly", "cyber"],
    "scandi_interior": ["scandi", "nordic", "ikea", "light wood", "hygge"],
    "rainy_day": ["rain", "window", "wet", "puddle", "umbrella"],
    "oil_painting": ["oil painting", "canvas", "brushstroke", "claude monet", "van gogh"],
    "watercolor": ["watercolor", "aquarelle", "soft bleed", "paper texture"],
    "k_style_vibe": ["korean", "k-style", "seoul", "kpop", "hongdae"],
    "food_porn": ["food", "delicious", "gourmet", "restaurant", "plate"],
    "pet_portrait": ["pet", "dog", "cat", "animal", "fluffy"],
    "wedding_day": ["wedding", "bride", "groom", "ceremony", "elegant dress"],
    "macro_detail": ["macro", "extreme close up", "detail", "texture", "insect", "flower"],
    "underwater": ["underwater", "ocean", "submerged", "coral", "scuba"],
    "galaxy_space": ["galaxy", "space", "nebula", "stars", "astronaut"],
    "desert_mood": ["desert", "sand", "dunes", "sahara", "oasis"],
    "forest_fairy": ["forest", "woods", "moss", "enchanted", "trees"],
    "automotive": ["car", "automotive", "vehicle", "supercar", "driving"]
}

def translate_batch(items, api_key):
    # 이 부분은 실제 구동 시 Gemini API를 호출합니다.
    # 데모를 위해 구조만 잡습니다.
    # prompt = f"Translate the following titles and descriptions to Korean: {json.dumps(items)}"
    return [{"t_ko": f"번역된 {i['t']}", "d_ko": f"상세설명: {i['d']}"} for i in items]

def process_data(input_file, output_file, api_key=None):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"Total items: {len(data)}")
    
    # 1. Categorization
    categorized = {theme: [] for theme in THEME_MAP_50.keys()}
    categorized["others"] = []
    
    for item in data:
        text = (item.get('t', '') + " " + item.get('d', '') + " " + item.get('c', '')).lower()
        found = False
        for theme, keywords in THEME_MAP_50.items():
            if any(k in text for k in keywords):
                # 2. Translation (Pre-processing)
                # 여기서는 필드만 미리 만들어둡니다. 
                # 실제 번역은 배치를 통해 진행하는 것이 좋습니다.
                item['t_ko'] = item.get('t', '') # 일단 원문 복사
                item['d_ko'] = item.get('d', '')
                categorized[theme].append(item)
                found = True
                break
        if not found:
            item['t_ko'] = item.get('t', '')
            item['d_ko'] = item.get('d', '')
            categorized["others"].append(item)

    # 3. Save
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(categorized, f, ensure_ascii=False, indent=2)
    
    print(f"Extraction complete. Saved to {output_file}")

if __name__ == "__main__":
    process_data('public/prompts.json', 'public/prompts_categorized.json')
