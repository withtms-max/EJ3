import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, Grid, List, Sparkles, Image as ImageIcon, CheckCircle2, ChevronRight, Info, Languages } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';
import { GoogleGenAI } from "@google/genai";

interface PromptItem {
  id: string | number;
  t: string; // title
  d: string; // description
  c: string; // content/prompt
  img?: string; // image url
  t_ko?: string;
  d_ko?: string;
}

interface CategorizedPrompts {
  [key: string]: PromptItem[];
}

interface StyleExplorerProps {
  onClose: () => void;
  onSelect: (prompt: string, title: string) => void;
}

const THEME_LIST = [
  { id: "mirror_selfie", label: "거울 셀카", icon: "🤳" },
  { id: "fashion_editorial", label: "패션 에디토리얼", icon: "👗" },
  { id: "street_style", label: "스트릿 스타일", icon: "👟" },
  { id: "candid_moment", label: "자연스러운 찰나", icon: "📸" },
  { id: "luxury_lifestyle", label: "럭셔리 라이프", icon: "💎" },
  { id: "cinematic_portrait", label: "영화적 인물화", icon: "🎬" },
  { id: "studio_pro", label: "스튜디오 프로", icon: "🏢" },
  { id: "japanese_vibe", label: "일본 감성", icon: "🗾" },
  { id: "vintage_analog", label: "빈티지 아날로그", icon: "🎞️" },
  { id: "minimalist_clean", label: "미니멀 클린", icon: "🧊" },
  { id: "cyberpunk_neon", label: "사이버펑크 네온", icon: "🧬" },
  { id: "fantasy_dreamy", label: "판타지 몽환", icon: "✨" },
  { id: "product_cinematic", label: "제품 시네마틱", icon: "⌚" },
  { id: "golden_hour", label: "골든 아워", icon: "🌇" },
  { id: "night_cityscape", label: "도시 야경", icon: "🌃" },
  { id: "influencer_snap", label: "인플루언서 스냅", icon: "🤳" },
  { id: "business_pro", label: "비즈니스 프로", icon: "💼" },
  { id: "fitness_gym", label: "피트니스 & 헬스", icon: "💪" },
  { id: "action_dynamic", label: "액션 다이내믹", icon: "🔥" },
  { id: "anime_illustration", label: "애니메이션", icon: "🎨" },
  { id: "hyper_realistic", label: "하이퍼 리얼리스틱", icon: "👁️" },
  { id: "dark_moody", label: "다크 & 무디", icon: "🖤" },
  { id: "soft_aesthetic", label: "소프트 에스테틱", icon: "🌸" },
  { id: "interior_design", label: "인테리어 디자인", icon: "🏠" },
  { id: "travel_explorer", label: "여행 & 탐험", icon: "🌍" },
  { id: "character_concept", label: "캐릭터 컨셉", icon: "⚔️" },
  { id: "black_white_noir", label: "흑백 느와르", icon: "🌗" },
  { id: "pop_art_vibrant", label: "팝아트 바이브", icon: "💥" },
  { id: "historical_classic", label: "클래식 역사", icon: "🏛️" },
  { id: "graphic_vector", label: "그래픽 벡터", icon: "📐" },
  { id: "y2k_retro", label: "Y2K 레트로", icon: "🦋" },
  { id: "scandi_interior", label: "북유럽 인테리어", icon: "🪵" },
  { id: "rainy_day", label: "비오는 날 감성", icon: "☔" },
  { id: "oil_painting", label: "유화 스타일", icon: "🖼️" },
  { id: "watercolor", label: "수채화 몽환", icon: "🎨" },
  { id: "k_style_vibe", label: "K-스타일 (서울)", icon: "🇰🇷" },
  { id: "food_porn", label: "음식 화보", icon: "🥘" },
  { id: "pet_portrait", label: "반려동물 초상화", icon: "🐶" },
  { id: "wedding_day", label: "웨딩 엘레강스", icon: "👰" },
  { id: "macro_detail", label: "매크로 초점", icon: "🔍" },
  { id: "underwater", label: "언더워터", icon: "🐳" },
  { id: "galaxy_space", label: "우주 & 은하", icon: "🚀" },
  { id: "desert_mood", label: "사막 무드", icon: "🏜️" },
  { id: "forest_fairy", label: "숲속의 요정", icon: "🧚" },
  { id: "automotive", label: "자동차 & 속도", icon: "🏎️" },
  { id: "others", label: "기타 스타일", icon: "🏷️" },
];
// [전역 캐시] 대용량 데이터를 한 번만 불러오고 재사용하여 로딩 속도 최적화
let cachedData: any = null;

const StyleExplorer: React.FC<StyleExplorerProps> = ({ onClose, onSelect }) => {
  const { apiKey } = useApiKey();
  const [categorizedData, setCategorizedData] = useState<CategorizedPrompts | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState<string>("mirror_selfie");
  const [loading, setLoading] = useState(true);
  const [translatedItems, setTranslatedItems] = useState<Record<string | number, { t_ko: string; d_ko: string }>>({});

  useEffect(() => {
    if (cachedData) {
      setCategorizedData(cachedData);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch('/prompts_categorized.json')
      .then(res => res.json())
      .then(data => {
        const shuffledData: CategorizedPrompts = {};
        Object.keys(data).forEach(key => {
          shuffledData[key] = [...data[key]].sort(() => Math.random() - 0.5);
        });
        cachedData = shuffledData;
        setCategorizedData(shuffledData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load prompts:", err);
        setLoading(false);
      });
  }, []);

  const filteredPrompts = useMemo(() => {
    if (!categorizedData) return [];
    
    if (searchTerm.trim()) {
      // Global search across all themes
      const allItems = Object.values(categorizedData as CategorizedPrompts).flat() as PromptItem[];
      return allItems.filter((item: PromptItem) => 
        (item.t + item.d + item.c).toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 100); // Limit results for performance
    }

    
    return (categorizedData[selectedTheme] || []).map(p => ({
      ...p,
      t_ko: translatedItems[p.id]?.t_ko,
      d_ko: translatedItems[p.id]?.d_ko
    }));
  }, [categorizedData, searchTerm, selectedTheme, translatedItems]);

  // 실시간 번역 로직 추가 (상위 12개)
  useEffect(() => {
    if (!apiKey || filteredPrompts.length === 0) return;

    const translateTopResults = async () => {
      // 이미 번역된 항목 제외하고 상위 12개만
      const toTranslate = filteredPrompts
        .slice(0, 12)
        .filter(p => !p.t_ko);

      if (toTranslate.length === 0) return;

      try {
        const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
        const prompt = `
          다음 이미지 프롬프트 데이터(제목과 설명)를 자연스러운 한국어로 번역해줘. 
          JSON 배열 형식으로만 응답해.
          데이터: ${JSON.stringify(toTranslate.map(p => ({ id: p.id, t: p.t, d: p.d })))}
          응답 형식: [{"id": "ID", "t_ko": "번역된 제목", "d_ko": "번역된 설명"}, ...]
        `;

        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt
        });
        
        const text = res.text || res.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const translations = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        
        const newTranslations = { ...translatedItems };
        translations.forEach((tr: any) => {
          newTranslations[tr.id] = { t_ko: tr.t_ko, d_ko: tr.d_ko };
        });
        setTranslatedItems(newTranslations);
      } catch (e: any) {
        console.error("StyleExplorer Translation Error:", e);
        const msg = String(e);
        if (msg.includes('403') || msg.includes('leaked') || msg.includes('PERMISSION_DENIED')) {
          alert('🔐 보안 이슈: 현재 사용 중인 API 키가 외부에 유출되어 차단되었습니다.\n\n새로운 개인 API 키를 발급받아 홈 화면에서 다시 입력해 주세요.');
        }
      }

    };

    const timer = setTimeout(translateTopResults, 1000);
    return () => clearTimeout(timer);
  }, [filteredPrompts, apiKey]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#C8102E] rounded-3xl flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Search size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">AI 스타일 익스플로러</h2>
              <p className="text-slate-500 font-bold text-sm">1만 개의 프롬프트 중 사장님만의 스타일을 찾아보세요.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar - Themes */}
          <div className="w-full md:w-80 border-r border-slate-100 bg-white flex flex-col">
            <div className="p-6 pb-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">50 Master Concepts</span>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-1 custom-scrollbar">
              {THEME_LIST.map((info) => (
                <button
                  key={info.id}
                  onClick={() => { setSelectedTheme(info.id); setSearchTerm(""); }}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all ${
                    selectedTheme === info.id && !searchTerm 
                    ? 'bg-[#C8102E] text-white shadow-lg shadow-red-100 scale-[1.02]' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{info.icon}</span>
                  <span className="text-sm">{info.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main List */}
          <div className="flex-1 flex flex-col bg-slate-50/30 overflow-hidden">
            
            {/* Search Bar Inner */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C8102E] transition-colors" size={24} />
                <input 
                  type="text"
                  placeholder="원하는 분위기나 키워드를 입력하세요... (예: 90s retro, cinematic, urban street)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-white border border-slate-200 rounded-[2rem] text-lg font-bold shadow-sm focus:outline-none focus:border-[#C8102E] focus:ring-4 focus:ring-red-100 transition-all placeholder:text-slate-300"
                />
              </div>

              {searchTerm && (
                <div className="flex items-center gap-2 text-sm font-bold text-[#C8102E] animate-in fade-in slide-in-from-left-4">
                  <Sparkles size={16} /> '{searchTerm}' 검색 결과 (최대 100개 노출)
                </div>
              )}
            </div>

            {/* Grid Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-10 custom-scrollbar">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="animate-spin text-[#C8102E]">
                    <Sparkles size={48} />
                  </div>
                  <span className="font-black text-slate-400 uppercase tracking-widest">Loading Library...</span>
                </div>
              ) : filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPrompts.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col"
                    >
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        {item.img ? (
                          <img src={item.img} alt={item.t} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-200">
                            <ImageIcon size={48} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <h4 className="font-black text-slate-800 text-base leading-tight group-hover:text-[#C8102E] transition-colors">
                            {item.t_ko || item.t || "Untitled Style"}
                          </h4>
                          <p className="text-slate-500 text-[11px] font-medium line-clamp-2 leading-relaxed">
                            {item.d_ko || item.d || "No description provided."}
                          </p>
                        </div>
                        
                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <button 
                            onClick={() => onSelect(item.c, item.t_ko || item.t)}
                            className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg hover:bg-[#C8102E] active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={14} /> 스타일 적용
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                    <Info size={40} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-800 text-lg">검색 결과가 없습니다.</h4>
                    <p className="text-slate-400 font-bold text-sm">다른 키워드로 검색하거나 테마를 선택해 보세요.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StyleExplorer;
