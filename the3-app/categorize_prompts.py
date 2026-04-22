import json
import re

# Define 30 Themes and their keywords
THEME_MAP = {
    "fashion_editorial": ["fashion", "editorial", "high-fashion", "magazine", "vogue"],
    "street_style": ["street", "urban", "outfit", "attire", "sneakers"],
    "mirror_selfie": ["mirror", "selfie", "holding phone", "smartphone"],
    "candid_moment": ["candid", "natural", "snapshot", "laughing", "smile"],
    "luxury_lifestyle": ["luxury", "opulent", "expensive", "car", "penthouse", "jewelry"],
    "cinematic_portrait": ["cinematic", "lighting", "dramatic", "filmic", "movie"],
    "studio_pro": ["studio", "backdrop", "softbox", "professional", "flash"],
    "japanese_vibe": ["japanese", "tokyo", "osaka", "suburban", "citypop", "anime"],
    "vintage_analog": ["vintage", "analog", "film", "grain", "90s", "retro", "disposable"],
    "minimalist_clean": ["minimalist", "clean", "negative space", "simple", "white background"],
    "cyberpunk_neon": ["cyberpunk", "neon", "futuristic", "glow", "night city", "techwear"],
    "fantasy_dreamy": ["fantasy", "ethereal", "magical", "dreamy", "glowing", "fairy"],
    "product_cinematic": ["product", "cinematic", "commercial", "advertising", "bottle", "watch"],
    "golden_hour": ["golden hour", "sunset", "warm", "sunlight", "dusk"],
    "night_cityscape": ["night", "city", "street lights", "dark", "urban landscape"],
    "influencer_snap": ["influencer", "social media", "trendy", "vlog", "instagram"],
    "business_pro": ["business", "professional", "confident", "suit", "office", "headshot"],
    "fitness_gym": ["fitness", "gym", "workout", "activewear", "muscle", "running"],
    "action_dynamic": ["action", "dynamic", "explosion", "flying", "running", "jumping"],
    "anime_illustration": ["anime", "manga", "illustration", "stylized", "drawing"],
    "hyper_realistic": ["hyper realistic", "8k", "ultra detailed", "skin pores", "4k"],
    "dark_moody": ["dark", "moody", "noir", "high contrast", "shadows"],
    "soft_aesthetic": ["soft", "aesthetic", "airy", "light", "pastel", "vaporwave"],
    "interior_design": ["interior", "architecture", "room", "house", "decor", "living room"],
    "travel_explorer": ["travel", "explorer", "backpack", "mountain", "ocean", "landscape"],
    "character_concept": ["character", "concept art", "rpg", "armor", "costume", "warrior"],
    "black_white_noir": ["black and white", "monochrome", "b&w", "noir", "grayscale"],
    "pop_art_vibrant": ["pop art", "vibrant", "colorful", "saturation", "vivid"],
    "historical_classic": ["classical", "historical", "antique", "traditional", "museum"],
    "graphic_vector": ["graphic", "vector", "flat design", "poster", "typography"]
}

def categorize_prompts(input_path, output_path):
    print(f"Reading {input_path}...")
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    categorized = {theme: [] for theme in THEME_MAP.keys()}
    categorized["others"] = []
    
    for item in data:
        text = (item.get('t', '') + " " + item.get('d', '') + " " + item.get('c', '')).lower()
        found_theme = False
        for theme, keywords in THEME_MAP.items():
            if any(k in text for k in keywords):
                categorized[theme].append(item)
                found_theme = True
                break # Only assign to the first matching theme
        
        if not found_theme:
            categorized["others"].append(item)
            
    # Print statistics
    print("\nCategorization Stats:")
    for theme, items in categorized.items():
        print(f" - {theme}: {len(items)}")
        
    print(f"\nWriting to {output_path}...")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(categorized, f, ensure_ascii=False, indent=2)
    print("Done!")

if __name__ == "__main__":
    categorize_prompts('c:/mannene/public/prompts.json', 'c:/mannene/public/prompts_categorized.json')
