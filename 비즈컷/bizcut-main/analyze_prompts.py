import json
import collections
import re

def analyze_prompts(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        all_text = ""
        for item in data:
            # Combine title (t) and description (d) for theme analysis
            all_text += (item.get('t', '') + " " + item.get('d', '')).lower() + " "
        
        # Simple word frequency analysis
        words = re.findall(r'\w+', all_text)
        # Exclude common stop words
        stop_words = set(['a', 'the', 'and', 'in', 'on', 'with', 'of', 'to', 'for', 'is', 'it', 'at', 'an', 'this', 'from', 'that', 'by', 'as', 'are', 'was', 'be', 'or', 'with', 'prompt', 'image', 'generation', 'nano', 'banana', 'pro', 'google', 'gemini', 'instructing', 'generate', 'highly', 'detailed', 'realistic', 'photorealistic', 'portrait', 'photo', 'style', 'background', 'features', 'including', 'atmosphere', 'cinematic', 'lighting'])
        
        filtered_words = [w for w in words if len(w) > 3 and w not in stop_words]
        
        counter = collections.Counter(filtered_words)
        common_words = counter.most_common(100)
        
        return common_words
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    result = analyze_prompts('c:/mannene/public/prompts.json')
    print(result)
