
import React, { useState, useEffect, useRef } from 'react';
import {
    FileText, Image, BookOpen, Sparkles, Copy, CheckCircle2,
    Loader2, Clock, Trash2, ChevronDown, ChevronUp, Instagram, Camera, Download, Upload, X, Check, Search, Lock, KeyRound
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import * as htmlToImage from 'html-to-image';
import { useApiKey } from '../context/ApiKeyContext';
import { MASTER_KEYS } from '../constants';
import { PERSONA_KEY } from './PersonaSetup';
import type { PersonaData } from './PersonaSetup';
import StyleExplorer from './StyleExplorer';

interface PromptItem {
    id: string | number;
    t: string; // title
    d: string; // description
    c: string; // content/prompt
    img?: string; // image url
    t_ko?: string; // translated title
    d_ko?: string; // translated description
}

// ─── 탭 타입 ──────────────────────────────────────────────────
export type ContentTab = 'caption' | 'cardnews' | 'blog';

// ─── 히스토리 항목 ─────────────────────────────────────────────
interface HistoryItem {
    id: string;
    tab: ContentTab;
    topic: string;
    result: string;
    platform?: string;
    createdAt: number;
}

const HISTORY_KEY = 'the3studio_content_history';
const MAX_HISTORY = 10;

// ─── 플랫폼 ────────────────────────────────────────────────────
const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', emoji: '📷', maxLen: 2200, hashtagCount: '20-30개' },
    { id: 'threads', label: 'Threads', emoji: '🧵', maxLen: 500, hashtagCount: '3-5개' },
    { id: 'x', label: 'X (트위터)', emoji: '🐦', maxLen: 280, hashtagCount: '2-3개' },
    { id: 'tiktok', label: 'TikTok', emoji: '🎵', maxLen: 300, hashtagCount: '5-10개' },
    { id: 'linkedin', label: 'LinkedIn', emoji: '💼', maxLen: 3000, hashtagCount: '3-5개' },
    { id: 'blog', label: '블로그 캡션', emoji: '✍️', maxLen: 5000, hashtagCount: '없음' },
];

// ─── 카드뉴스 슬라이드 수 ──────────────────────────────────────
const SLIDE_OPTIONS = [4, 5, 6, 7, 8];

// ─── 카드뉴스 설정 상수 ──────────────────────────────
const CARDNEWS_RATIOS = [
    { id: '1:1', label: '1:1 (정사각형)', ratio: '1/1', w: 1080, h: 1080, desc: '인스타그램 피드 기본' },
    { id: '4:5', label: '4:5 (인스타그램 권장)', ratio: '4/5', w: 1080, h: 1350, desc: '피드 최적화' },
    { id: '16:9', label: '16:9 (PPT/YouTube)', ratio: '16/9', w: 1920, h: 1080, desc: '와이드형' },
    { id: '9:16', label: '9:16 (릴스/스토리)', ratio: '9/16', w: 1080, h: 1920, desc: '전체 세로형' },
    { id: '3:4', label: '3:4 (세로형)', ratio: '3/4', w: 1080, h: 1440, desc: '일반 세로형' },
];

// ─── 카드뉴스 디자인 프리셋 (템플릿) ─────────────────────────
const CARDNEWS_DESIGN_PRESETS = [
    {
        id: 'new_menu', name: '오늘의 신메뉴', emoji: '🍳',
        basePrompt: "Warm orange (#FF6B00) + Gold + Bright Beige background, food large in center, ultra-large bold title at the top",
        strength: 0.85,
        font: 'font-black tracking-tight', color: 'text-orange-600',
        filter: 'brightness(1.0) contrast(1.1) saturate(1.2)',
        overlay: 'rgba(255,248,240,0.1)',
        thumbnail: '/templates/today_menu.png',
        style: { fontFamily: "'Black Han Sans', sans-serif", textShadow: '0 4px 12px rgba(0,0,0,0.1)' }
    },
    {
        id: 'daily_life', name: '소소한 일상', emoji: '🌿',
        basePrompt: "Soft pastel beige + Light green, photo 70% in center, transparent overlay",
        strength: 0.85,
        font: 'font-serif font-bold italic', color: 'text-slate-700',
        filter: 'sepia(0.1) brightness(1.05) contrast(0.95)',
        overlay: 'rgba(255,255,255,0.4)',
        thumbnail: '/templates/daily_life.png',
        style: { fontFamily: "'Nanum Myeongjo', serif", letterSpacing: '-0.01em' }
    },
    {
        id: 'big_sale', name: '역대급 할인', emoji: '🚨',
        basePrompt: "Intense Red + Black + Gold, ultra-large title at the top + Red badge",
        strength: 0.9,
        font: 'font-black uppercase tracking-tighter', color: 'text-white',
        filter: 'contrast(1.4) saturate(1.3) brightness(0.8)',
        overlay: 'rgba(220,38,38,0.3)',
        thumbnail: '/templates/big_sale.png',
        style: { fontFamily: "'Black Han Sans', sans-serif", textShadow: '0 8px 16px rgba(0,0,0,0.6)' }
    },
    {
        id: 'simple_beauty', name: '심플한 아름다움', emoji: '🤍',
        basePrompt: "White + Pale green, lots of whitespace, minimal lines",
        strength: 0.8,
        font: 'font-light tracking-widest', color: 'text-emerald-900',
        filter: 'brightness(1.02) saturate(0.9)',
        overlay: 'rgba(255,255,255,0.2)',
        thumbnail: '/templates/simple_beauty.png',
        style: { letterSpacing: '0.15em', fontWeight: 300 }
    },
    {
        id: 'premium', name: '품격 있는 선택', emoji: '👑',
        basePrompt: "Deep Navy + Gold + Black, Gold frame + gloss effect",
        strength: 0.85,
        font: 'font-black tracking-tight italic', color: 'text-amber-200',
        filter: 'brightness(0.7) contrast(1.2) grayscale(0.2)',
        overlay: 'rgba(10,15,40,0.7)',
        thumbnail: '/templates/premium.png',
        style: { textShadow: '0 4px 20px rgba(0,0,0,0.8)', borderColor: '#fbbf24', borderWidth: '1px' }
    },
];

// ─── 메인 컴포넌트 ─────────────────────────────────────────────
type BlogWizardStep = 'INIT' | 'RESEARCHING' | 'OUTLINING' | 'OUTLINE_CONFIRM' | 'DRAFTING' | 'DONE';
export type BlogTheme = 'influencer' | 'expert' | 'essay' | 'humour';

const BLOG_THEMES = [
    { id: 'expert', label: '신뢰감 100% 정보/꿀팁', emoji: '🧐' },
    { id: 'essay', label: '차분한 감성 에세이', emoji: '☕' },
    { id: 'influencer', label: '친근한 파워 인플루언서', emoji: '✨' },
    { id: 'humour', label: '도파민 뿜뿜 B급 유머', emoji: '🤣' },
];

interface SnsContentCreatorProps {
    initialTab?: ContentTab;
    onGoHome?: () => void;
}

const SnsContentCreator: React.FC<SnsContentCreatorProps> = ({ initialTab, onGoHome }) => {
    const { apiKey, naverClientId, naverClientSecret, isPinVerified, verifyPin } = useApiKey();
    const [tab, setTab] = useState<ContentTab>(initialTab || 'cardnews');
    const [topic, setTopic] = useState('');
    const [topicDetails, setTopicDetails] = useState('');
    const [platform, setPlatform] = useState('instagram');
    const [slideCount, setSlideCount] = useState(5);

    const [result, setResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzeResult, setAnalyzeResult] = useState('');
    const [colorIntensity, setColorIntensity] = useState<number>(3);
    const [isMobileOpt, setIsMobileOpt] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [persona, setPersona] = useState<PersonaData | null>(null);

    // AI 사진 및 카드뉴스 배경 상태
    const [aiPhotoPrompts, setAiPhotoPrompts] = useState<PromptItem[]>([]);
    const [recommendedPrompts, setRecommendedPrompts] = useState<PromptItem[]>([]);
    const [selectedPhotoPrompt, setSelectedPhotoPrompt] = useState<PromptItem | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]); // 카드뉴스 전용 업로드 이미지
    const [selectedRatio, setSelectedRatio] = useState('1:1');
    const [selectedTextTheme, setSelectedTextTheme] = useState('default');
    const [customInstructions, setCustomInstructions] = useState('');
    const [showExplorer, setShowExplorer] = useState(false);
    const [isGeneratingImages, setIsGeneratingImages] = useState(false);
    const [slideImages, setSlideImages] = useState<Record<number, string>>({});

    // 블로그 마법사 상태
    const [blogTheme, setBlogTheme] = useState<BlogTheme>('expert');
    const [blogStep, setBlogStep] = useState<BlogWizardStep>('INIT');
    const [researchData, setResearchData] = useState('');
    const [outlineData, setOutlineData] = useState('');
    const [showPINModal, setShowPINModal] = useState(false);
    const [inputPIN, setInputPIN] = useState("");
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);



    // 페르소나 로드
    useEffect(() => {
        const stored = localStorage.getItem(PERSONA_KEY);
        if (stored) {
            try { setPersona(JSON.parse(stored)); } catch { }
        }
    }, []);

    // 히스토리 로드
    useEffect(() => {
        const stored = localStorage.getItem(HISTORY_KEY);
        if (stored) {
            try { setHistory(JSON.parse(stored)); } catch { }
        }
    }, []);

    // AI 사진 프롬프트 데이터 로드 (photo 또는 cardnews 탭 최초 진입 시)
    useEffect(() => {
        if ((tab === 'photo' || tab === 'cardnews') && aiPhotoPrompts.length === 0) {
            fetch('/prompts_categorized.json')
                .then(res => res.json())
                .then(data => {
                    // Flatten the categorized data into a single array for search
                    const allPrompts = Object.values(data).flat() as PromptItem[];
                    setAiPhotoPrompts(allPrompts);
                })
                .catch(err => console.error("Failed to load AI photo prompts", err));
        }
    }, [tab]);

    // AI 사진 & 카드뉴스 실시간 검색 및 자동 추천 로직
    useEffect(() => {
        const updateRecommendations = async () => {
            if (tab === 'photo' && aiPhotoPrompts.length > 0) {
                const keyword = topic.trim().toLowerCase();
                try {
                    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
                    let searchKeywords = keyword;

                    if (keyword) {
                        const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(keyword);
                        if (hasKorean) {
                            const kwPrompt = `
                                다음 한글 주제에 대해, 이미지 데이터셋에서 가장 연관성 높은 영문 검색어 3~5개를 뽑아줘. 콤마(,)로만 출력해.
                                주제: ${keyword}
                            `;
                            const kwRes = await ai.models.generateContent({
                                model: 'gemini-2.5-flash',
                                contents: kwPrompt,
                            });
                            const kwText = kwRes.text || kwRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
                            searchKeywords = kwText.trim().toLowerCase();
                        }
                    }

                    // 필터링 로직
                    let matched: PromptItem[] = [];
                    if (searchKeywords) {
                        const searchTerms = searchKeywords.split(',').map(t => t.trim());
                        matched = aiPhotoPrompts.filter(p => {
                            const content = ((p.t || '') + ' ' + (p.d || '') + ' ' + (p.c || '')).toLowerCase();
                            return searchTerms.some(term => content.includes(term));
                        });
                    }

                    let finalPrompts: PromptItem[] = [];
                    if (matched.length > 0) {
                        finalPrompts = [...matched].sort(() => 0.5 - Math.random()).slice(0, 5);
                    } else {
                        finalPrompts = aiPhotoPrompts.sort(() => 0.5 - Math.random()).slice(0, 5);
                    }

                    // [추가] 선택된 5개 프롬프트 한글 번역 로직
                    const translatePrompt = `
                        다음 5개의 영어 이미지 프롬프트 데이터(제목과 설명)를 자연스러운 한국어로 번역해줘. 
                        JSON 배열 형식으로만 응답해. 각 객체는 원래의 index를 유지해.
                        데이터: ${JSON.stringify(finalPrompts.map((p, i) => ({ index: i, t: p.t, d: p.d })))}
                        응답 형식: [{"index": 0, "t_ko": "번역된 제목", "d_ko": "번역된 설명"}, ...]
                    `;

                    const transRes = await ai.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: translatePrompt,
                    });
                    const transText = transRes.text || transRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    
                    try {
                        const translations = JSON.parse(transText.replace(/```json/g, '').replace(/```/g, '').trim());
                        finalPrompts = finalPrompts.map((p, i) => {
                            const trans = translations.find((t: any) => t.index === i);
                            return trans ? { ...p, t_ko: trans.t_ko, d_ko: trans.d_ko } : p;
                        });
                    } catch (pe) {
                        console.error("Translation parsing failed", pe);
                    }

                    setRecommendedPrompts(finalPrompts);
                } catch (e) {
                    console.error("Search/Translation failed", e);
                    setRecommendedPrompts(aiPhotoPrompts.sort(() => 0.5 - Math.random()).slice(0, 5));
                }
            } else {
                setRecommendedPrompts([]);
            }
        };

        const timer = setTimeout(updateRecommendations, 800);
        return () => clearTimeout(timer);
    }, [topic, tab, aiPhotoPrompts, apiKey]);

    // 결과 초기화
    useEffect(() => {
        setResult('');
        if (tab !== 'blog') {
            setBlogStep('INIT');
            setResearchData('');
            setOutlineData('');
        }
    }, [tab, platform]);

    // ─── 네이버 검색 API 호출 ─────────────────────────────────────
    const fetchNaverSearch = async (query: string) => {
        if (!naverClientId || !naverClientSecret) return null;
        try {
            // 블로그 검색 데이터 수집량을 늘려 구체적인 팩트(메뉴명 등) 확보력 강화 (5 -> 15)
            const res = await fetch(`/v1/search/blog.json?query=${encodeURIComponent(query)}&display=15&sort=sim`, {
                headers: {
                    'X-Naver-Client-Id': naverClientId,
                    'X-Naver-Client-Secret': naverClientSecret
                }
            });
            const data = await res.json();
            if (data.items) {
                return data.items.map((i: any) => `${i.title.replace(/<[^>]+>/g, '')}: ${i.description.replace(/<[^>]+>/g, '')}`).join('\n\n');
            }
        } catch (e) {
            console.error('네이버 블로그 검색 실패:', e);
        }
        return null;
    };

    // ─── 프롬프트 생성 ──────────────────────────────────────────
    const buildPersonaContext = () => {
        if (!persona?.brandName) return '';
        return `
[브랜드 페르소나]
- 브랜드명: ${persona.brandName}
- 업종: ${persona.industry}
- 톤/스타일: ${persona.tone}
- 타겟 고객: ${persona.targetAudience}
${persona.description ? `- 브랜드 소개: ${persona.description}` : ''}
위 페르소나를 반영하여 작성해주세요.
    `.trim();
    };

    const buildCaptionPrompt = () => {
        const p = PLATFORMS.find(pl => pl.id === platform)!;
        return `
당신은 SNS 마케팅 전문 카피라이터입니다.
${buildPersonaContext()}

[주제]: ${topic}
[사용자가 직접 입력한 핵심 팩트(최우선 반영)]:
${topicDetails ? topicDetails : '없음'}
[플랫폼]: ${p.label}
[글자 수 제한]: 최대 ${p.maxLen}자
[해시태그]: ${p.hashtagCount} 추천

다음 형식으로 작성해주세요:
1. 첫 줄은 시선을 잡는 강렬한 훅 문장
2. 본문 (스토리텔링 또는 핵심 메시지)
3. CTA (행동 유도 문구)
4. 해시태그

[작성 상세 가이드라인]
※ 팩트 기반 (할루시네이션 절대 차단): [주제]와 [핵심 팩트]에 텍스트로 명확히 적혀있지 않은 고유명사(특정 메뉴 이름, 가격, 위치, 이벤트, 운영 연수 등)는 **절대, 네버(Never)** 지어내지 마세요. 팩트 없이 길이를 늘리기 위해 소설을 쓰지 마세요.
※ 한국어로 작성하고, ${p.label} 특성에 최적화해주세요. 마크다운 없이 텍스트만 출력해주세요.
    `.trim();
    };

    const buildCardNewsPrompt = (overrideSlideCount?: number) => {
        const finalSlideCount = overrideSlideCount || slideCount;
        const imageContext = uploadedImages.length > 0
            ? `[중요: 사용자가 업로드한 사진 정보]
- 현재 카드뉴스 배경으로 사용할 핵심 내용과 관련된 실제 사진이 ${uploadedImages.length}장 업로드되어 있습니다.
- 문구를 작성할 때, 업로드된 사진(인물, 장소, 제품 등)이 텍스트와 잘 어울리도록 맥락에 맞는 신뢰감 있는 톤을 설정하세요.
` : `[참고: 배경 이미지는 업로드되지 않았습니다. 깔끔한 단색이나 그라디언트 배경에 어울리는 문구를 작성하세요.]`;

        const ratioInfo = CARDNEWS_RATIOS.find(r => r.id === selectedRatio);
        const ratioContext = `\n[이미지 비율]: ${ratioInfo?.label} (${ratioInfo?.ratio})`;

        const themeInfo = CARDNEWS_DESIGN_PRESETS.find(t => t.id === selectedTextTheme);
        const themeContext = themeInfo 
            ? `\n[디자인 컨셉]: ${themeInfo.name} (${themeInfo.basePrompt}). 이 무드와 어울리는 문구로 작성하세요.`
            : '';

        const instructionContext = customInstructions
            ? `\n[사용자 특별 지시사항 (반드시 반영)]: ${customInstructions}`
            : '';

        return `
당신은 SNS 카드뉴스 전문 기획자 및 카피라이터입니다.
${buildPersonaContext()}
${imageContext}
${ratioContext}
${themeContext}
${instructionContext}

[주제]: ${topic}
[사용자가 직접 입력한 핵심 팩트(최우선 반영)]:
${topicDetails ? topicDetails : '없음'}
[슬라이드 수]: ${finalSlideCount}장

다음 형식으로 ${finalSlideCount}장의 카드뉴스 스크립트를 작성해주세요. 반드시 아래의 [JSON 형식]에 맞춰 배열로 반환하세요. 다른 텍스트는 일절 출력하지 마세요.

[
  { "slide": 1, "title": "[짧고 강렬한 표지 제목]", "content": "[표지 부제, 20자 이내]" },
  { "slide": 2, "title": "[본문 1 제목]", "content": "[본문 1 내용, 50-80자]" },
  ...
  { "slide": ${finalSlideCount}, "title": "[마무리 제목]", "content": "[행동 유도 문구]", "hashtags": "#태그1 #태그2" }
]

[작성 상세 가이드라인]
※ 팩트 기반 (할루시네이션 절대 차단): [주제]와 [핵심 팩트]에 텍스트로 명확히 적혀있지 않은 고유명사(특정 메뉴 이름, 가격, 위치, 이벤트 등)는 **절대, 네버(Never)** 지어내지 마세요.
※ 문구 스타일: 실제 사진이 배경으로 깔리므로, 너무 화려한 수식어보다는 솔직하고 담백하면서도 신뢰감을 주는 문구를 선호합니다.
※ 비율 최적화: ${selectedRatio} 비율에 맞춰 제목과 본문 길이를 적절히 조절하세요. (예: 9:16 세로형은 텍스트가 위아래로 여유 있게 배치되도록 구성)
※ 반드시 JSON 배열 객체 시작(\`[\`)과 끝(\`]\`)으로만 응답하세요. 마크다운 백틱(\`\`\`json)도 포함하지 말고 순수 JSON만 반환하세요.
    `.trim();
    };

    const buildPhotoPrompt = (hasImage: boolean) => {
        if (!selectedPhotoPrompt) return '';
        
        if (hasImage) {
            return `
                I have provided an image as a structural foundation. 
                Your task is to REDESIGN this image by applying the specific "ARTISTIC STYLE" and "MOOD" described below, while strictly preserving the original pose, layout, and subject composition.
                
                TARGET STYLE & PROMPT: "${selectedPhotoPrompt.c}"
                
                Additional Context:
                - Target Topic: ${topic}
                - Technical Instructions: Ensure professional lighting, high-end texture, and commercial-grade quality.
                - Detail: ${topicDetails || 'None'}
                
                IMPORTANT RULES:
                1. DO NOT add any text, typography, letters, or watermarks.
                2. Keep the original subject recognizable but aesthetically transformed.
                3. The result must be a clean, high-resolution image.
            `.trim();
        }

        return `
            Act as a world-class AI Image Prompt Engineer. 
            Create a highly detailed, professional English prompt for an image based on the following reference and topic.
            
            REFERENCE STYLE: "${selectedPhotoPrompt.c}"
            SUBJECT TOPIC: "${topic}"
            EXTRA DETAILS: "${topicDetails || 'None'}"
            
            The prompt should focus on lighting, camera angle, texture, and mood. 
            Output ONLY the finalized English prompt, followed by a brief Korean explanation.
        `.trim();
    };

    // ─── 블로그 단계별 프롬프트 ───────────────────────────────────
    const getThemeDescription = (themeId: string) => {
        switch (themeId) {
            case 'influencer': return `친근하고 소통을 좋아하는 네이버 파워 인플루언서입니다.
[인플루언서체 작성 가이드라인]
1. 말투와 감정표현: "안녕하세요~ 00입니다!", "진짜 기절할 뻔 ㅠ", "너무 맛있었어요 ㅎㅎ" 같이 친근한 대화체, 감탄사, 이모지(🥰, ✨ 등), ㅋㅋ/ㅎㅎ/ㅠㅠ 등을 섞어 쓰세요.
2. 기계적이고 딱딱한 정보 나열, 요약(TL;DR), FAQ 등은 철저히 배제하세요.`;
            case 'expert': return `해당 분야의 꼼꼼하고 신뢰감 있는 전문가/리뷰어입니다.
[전문가체 작성 가이드라인]
1. 이모지는 최소화하고, 문단 구분을 깔끔하게 하며 정돈된 존댓말을 사용하세요.
2. 필요하다면 핵심 요약, 장단점 비교, 정보성 꿀팁 등 체계적이고 구조화된 형태를 적극 활용해 가독성을 높이세요.`;
            case 'essay': return `감수성이 풍부하고 문장력이 뛰어난 에세이 작가입니다.
[에세이체 작성 가이드라인]
1. 감정선이 돋보이는 시적이고 차분한 문체를 사용하세요.
2. 공간의 분위기, 그날의 기분 등 여운이 남는 묘사를 통해 한 편의 글귀처럼 작성하세요.`;
            case 'humour': return `MZ세대 트렌드를 잘 알고 도파민 터지는 B급 유머의 달인입니다.
[B급 유머체 작성 가이드라인]
1. 최신 유행어, 밈, 과장된 리액션, 직설적이고 솔직한 맛 표현 ("이거 안 먹으면 유죄", "돌은 맛") 등을 거침없이 사용하세요.
2. 숏폼 대본을 보듯 빠르고 경쾌한 호흡과 솔직담백한 재미를 추구하세요.`;
            default: return '';
        }
    };

    const buildBlogOutlinePrompt = (researchText: string) => {
        return `
당신은 네이버 블로그 포스팅의 뼈대(목차)를 기획하는 전문가입니다.
${buildPersonaContext()}

[주제]: ${topic}
[사용자가 강조한 핵심 팩트(메뉴, 특징 등)]:
${topicDetails ? topicDetails : '없음 (아래 참고 자료 의존)'}
[참고 자료(네이버 블로그 검색 결과)]: 
${researchText ? researchText : '참고 자료 없음.'}

위 자료를 바탕으로, 해당 장소/주제의 '구체적인 매력 포인트(메뉴, 분위기 등)'가 잘 드러나는 블로그 글의 목차를 짜주세요.
사용자가 강조한 팩트가 있다면, 그것을 최우선으로 목차에 반영하세요.
**본문(줄글 형태의 후기나 감상평)은 절대 작성하지 마세요.** 오직 아래 예시와 같은 '구조 개요'만 출력해야 합니다. 대화체나 감탄사도 모두 배제하세요.

[출력 양식 예시]
1. 프롤로그: 방문 계기 및 첫인상 요약
   - (여기에 작성할 내용의 핵심 키워드나 요약을 1~2줄로 건조하게 작성)
2. 가장 인상 깊었던 시그니처 메뉴 [A]
   - ([A] 메뉴의 식감, 맛특징, 비주얼 등 요약)
3. 곁들여 먹기 좋은 서브 메뉴 [B]
   - ([B] 메뉴의 특징 요약)
4. 분위기 및 공간 매력 포인트
   - (매장 인테리어, 조명, 좌석 등 요약)
5. 마무리 및 방문 꿀팁
   - (재방문 의사, 예약/주차 등 실질적인 팁 요약)

※ 주의: 출력 시 무조건 위와 같은 '건조한 요약 구조'만 유지하세요. 진짜 사람이 쓴 것 같은 줄글 후기는 다음 단계에서 작성할 예정이므로, 여기서는 무조건 뼈대만 잡아야 합니다.
    `.trim();
    }

    const buildBlogDraftPrompt = (outlineText: string, researchText: string) => {
        const themeInfo = getThemeDescription(blogTheme);
        return `
당신은 ${BLOG_THEMES.find(t => t.id === blogTheme)?.label} 컨셉의 블로거입니다.
${themeInfo}
${buildPersonaContext()}

[주제]: ${topic}
[사용자가 직접 입력한 핵심 팩트(최우선 반영)]:
${topicDetails ? topicDetails : '없음'}
[참고 자료(네이버 블로그 검색 결과 - 반드시 이 안의 팩트를 활용하세요)]: 
${researchText ? researchText : '(일반 지식 활용)'}

[확정된 블로그 기획안(목차)]:
${outlineText}

위 '확정된 블로그 기획안(목차)'의 흐름에 따라 전체 본문을 작성해 주세요. 
기획안에 담긴 핵심 내용과 [사용자가 입력한 팩트] 및 [참고 자료]에 있는 구체적인 팩트(메뉴명, 특징 등)를 내용에 자연스럽게 녹여내야 합니다.

[작성 상세 가이드라인]
1. 분량 및 여백: 모바일로 읽기 편하도록 한 문장은 너무 길지 않게 쓰고, 두세 문장마다 반드시 빈 줄(엔터 2번)을 넣어 여백을 아주 넉넉하게 주세요.
2. 팩트 기반 (할루시네이션 절대 차단): [참고 자료]에 텍스트로 명확히 적혀있지 않은 고유명사(특정 메뉴 이름, 가격, 위치, 이벤트 등)는 **절대, 네버(Never)** 지어내지 마세요. (예: 대창 덮밥, 감자전 등 가짜 메뉴 창조 금지!) 
   - 참고 자료에 메뉴 이름(예: 짜장면, 짬뽕, 된장짜장 등)이 있으면 그것만 쓰시고, 만약 메뉴 정보가 아예 없다면 임의로 메뉴를 묘사하지 말고 '맛있는 시그니처 음식', '정갈한 요리' 등으로 뭉뚱그려 표현하세요.
3. 마무리: 글 끝에는 재방문 의사나 방문 시 꿀팁을 남기고, 이웃 추가나 댓글을 유도하는 다정한 인사로 마무리하세요. 하단에 추천 해시태그 5~10개를 추가해주세요.

마크다운을 활용해 한국어로 출력해 주세요.
    `.trim();
    }

    // ─── 생성 실행 ──────────────────────────────────────────────
    const handleGenerate = async (e?: React.MouseEvent | undefined, overrideSlideCount?: number) => {
        if (!topic.trim()) {
            alert('주제를 입력해주세요!');
            return;
        }
        if (!isPinVerified) {
            setPendingAction(() => () => handleGenerate(e, overrideSlideCount));
            setShowPINModal(true);
            return;
        }

        setIsLoading(true);
        setResult('');

        try {
            const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });

            // 일반 생성 (캡션, 카드뉴스)
            if (tab !== 'blog') {
                const prompt = tab === 'caption' ? buildCaptionPrompt() : buildCardNewsPrompt(overrideSlideCount);

                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                });

                const text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (!text) throw new Error("AI가 빈 응답을 반환했습니다.");

                setResult(text);
                saveHistory(text);
                setIsLoading(false);
                return;
            }

            // AI 사진 생성 기능 삭제됨 (사용자 요청)

            // 블로그 파이프라인 (STEP 1: 자료 조사 & STEP 2: 구성)
            if (blogStep === 'INIT' || blogStep === 'RESEARCHING' || blogStep === 'OUTLINE_CONFIRM') {
                setBlogStep('RESEARCHING');

                // 1. 네이버 검색 API로 기초 자료 수집
                let researchText = "";
                if (naverClientId && naverClientSecret) {
                    const searchResult = await fetchNaverSearch(topic);
                    if (searchResult) researchText = searchResult;
                }
                setResearchData(researchText);

                // 2. 목차 생성
                setBlogStep('OUTLINING');
                const outlineResponse = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: buildBlogOutlinePrompt(researchText),
                });

                const outlineText = outlineResponse.text || outlineResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (!outlineText) throw new Error("목차 생성 실패");

                setOutlineData(outlineText);
                setBlogStep('OUTLINE_CONFIRM');
                setIsLoading(false);
                return;
            }

        } catch (err: any) {
            console.error("SnsContentCreator Error:", err);
            handleError(err);
        }
        setIsLoading(false);
    };

    // 블로그 STEP 3: 본문 작성
    const handleDraftBlog = async () => {
        if (!isPinVerified) {
            setPendingAction(() => handleDraftBlog);
            setShowPINModal(true);
            return;
        }
        setBlogStep('DRAFTING');
        try {
            const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: buildBlogDraftPrompt(outlineData, researchData),
            });

            const text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (!text) throw new Error("본문 생성 실패");

            setResult(text);
            saveHistory(text);
            setBlogStep('DONE');
        } catch (err) {
            handleError(err);
        }
    };

    // ─── AI 이미지 생성 (무료 버전 - Pollinations.ai) ──────────────────
    const handleGenerateSlideImages = async () => {
        if (!result || !apiKey) {
            alert('먼저 콘텐츠를 생성하고 API 키를 설정해주세요.');
            return;
        }
        setIsGeneratingImages(true);

        try {
            const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1' });
            const text = result.replace(/```json/g, '').replace(/```/g, '').trim();
            const slides = JSON.parse(text);
            const newImages: Record<number, string> = {};
            const themeInfo = CARDNEWS_DESIGN_PRESETS.find(t => t.id === selectedTextTheme);

            for (const slide of slides) {
                // 1. 제미나이를 이용한 고품질 영문 프롬프트 생성
                const promptEnhanceReq = `
                    Act as a professional AI Image Prompt Engineer for card news. 
                    Create a high-quality, vivid, and detailed English image prompt based on the following context.
                    
                    [Slide Title]: ${slide.title}
                    [Slide Content]: ${slide.content}
                    [Design Theme]: ${themeInfo?.name} (${themeInfo?.basePrompt})
                    [User Photo Context]: ${analyzeResult || 'General high-quality commercial photography'}
                    
                    RULES:
                    - Output ONLY the English prompt text. No quotes, no intro.
                    - DO NOT include any text, letters, or words in the image itself.
                    - Aesthetic: Cinematic lighting, professional composition, 8k resolution, commercial grade.
                    - Tone: ${themeInfo?.name} style.
                `.trim();

                const genRes = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: promptEnhanceReq,
                });
                
                const enhancedPrompt = genRes.text || genRes.candidates?.[0]?.content?.parts?.[0]?.text || slide.title;
                const cleanPrompt = enhancedPrompt.replace(/["']/g, '').trim();
                const encodedPrompt = encodeURIComponent(cleanPrompt);
                
                // 2. Pollinations.ai API (Free, No Auth needed)
                const seed = Math.floor(Math.random() * 1000000);
                const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;
                
                newImages[slide.slide] = imageUrl;
            }

            setSlideImages(newImages);
            alert('🎨 무료 AI 모델(Flux/SDXL)을 통해 모든 이미지가 성공적으로 재창조되었습니다!');
        } catch (err: any) {
            console.error('이미지 생성 실패:', err);
            alert(`이미지 생성 중 오류가 발생했습니다: ${err.message}`);
        } finally {
            setIsGeneratingImages(false);
        }
    };

    const saveHistory = (text: string) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            tab,
            topic,
            result: text,
            platform: tab === 'caption' ? platform : undefined,
            createdAt: Date.now(),
        };
        
        setHistory(prev => {
            // 결과물이 동일하거나 제목이 동일한 최근 항목이 바로 상단에 있으면 중복 저장 방지
            if (prev.length > 0 && prev[0].result === text && prev[0].topic === topic) {
                return prev;
            }
            const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    }

    const handleError = (err: any) => {
        console.error('THE3 Studio Content Error Object:', err);
        if (err.status) console.error('Error Status:', err.status);
        if (err.message) console.error('Error Message:', err.message);
        
        const msg = String(err);
        if (msg.includes('403') || msg.includes('leaked') || msg.includes('PERMISSION_DENIED')) {
            alert('🔐 보안 이슈: 현재 사용 중인 API 키가 외부에 유출되어 Google에 의해 차단되었습니다.\n\n새로운 개인 API 키를 발급받아 홈 화면에서 다시 입력해 주세요.\n(무료 발급: aistudio.google.com/app/apikey)');
        } else if (msg.includes('400') || msg.includes('API_KEY_INVALID')) {
            alert('🔑 API 키가 올바르지 않습니다. 홈에서 다시 설정해주세요.');
        } else if (msg.includes('429')) {
            alert('☕ 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
        } else {
            alert(`콘텐츠 생성 중 오류가 발생했습니다.\n상세 에러: ${msg}`);
        }
        setBlogStep('INIT');
    }

    const deleteHistory = (id: string) => {
        const updated = history.filter(h => h.id !== id);
        setHistory(updated);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePINSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (verifyPin(inputPIN.trim())) {
            setShowPINModal(false);
            if (pendingAction) {
                pendingAction();
                setPendingAction(null);
            }
        } else {
            alert("정확한 PIN을 입력해주세요.");
        }
    };

    const tabLabel = {
        'caption': 'SNS 캡션',
        'cardnews': '카드뉴스',
        'blog': '블로그',
        'photo': 'AI 사진'
    };


    const cardRef = useRef<HTMLDivElement>(null);
    const downloadCardNews = async () => {
        if (!cardRef.current) return;
        try {
            const ratioInfo = CARDNEWS_RATIOS.find(r => r.id === selectedRatio);
            const dataUrl = await htmlToImage.toPng(cardRef.current, { 
                quality: 1, 
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
            const link = document.createElement('a');
            link.download = `the3studio-all-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('이미지 다운로드 실패', err);
            alert('이미지 생성 중 오류가 발생했습니다.');
        }
    };

    const downloadSingleSlide = async (index: number) => {
        const el = document.getElementById(`card-slide-${index}`);
        if (!el) return;
        
        try {
            const ratioInfo = CARDNEWS_RATIOS.find(r => r.id === selectedRatio) || CARDNEWS_RATIOS[0];
            const dataUrl = await htmlToImage.toPng(el, {
                width: ratioInfo.w,
                height: ratioInfo.h,
                style: {
                    transform: 'none',
                    borderRadius: '0',
                    boxShadow: 'none',
                    border: 'none'
                },
                pixelRatio: 2,
                backgroundColor: '#000000'
            });
            
            const link = document.createElement('a');
            link.download = `the3studio-slide-${index + 1}-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('개별 다운로드 실패', err);
            alert('이미지 저장 중 오류가 발생했습니다.');
        }
    };

    const renderCardNews = () => {
        if (tab !== 'cardnews' || !result) return null;

        let slides = [];
        try {
            const text = result.replace(/```json/g, '').replace(/```/g, '').trim();
            slides = JSON.parse(text);
        } catch (e) {
            // 파싱 실패시 텍스트 모드로 표시되도록 처리
            return null;
        }

        const ratioInfo = CARDNEWS_RATIOS.find(r => r.id === selectedRatio) || CARDNEWS_RATIOS[0];
        const themeInfo = CARDNEWS_DESIGN_PRESETS.find(t => t.id === selectedTextTheme) || CARDNEWS_DESIGN_PRESETS[0];

        return (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                {/* AI 사진 결과물을 위한 PIN 모달 (필요시) */}
                {showPINModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
                            <button
                                onClick={() => setShowPINModal(false)}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#C8102E] animate-bounce">
                                    <KeyRound size={32} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-black text-center text-slate-900 mb-2">보안 설정 (PIN)</h3>
                            <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
                                이 기능은 유료 AI 엔진을 사용합니다.<br />
                                <strong>6자리 접속 PIN</strong>을 입력하고 잠금을 해제하세요.
                            </p>

                            <form onSubmit={handlePINSubmit} className="space-y-4">
                                <input
                                    type="password"
                                    value={inputPIN}
                                    onChange={(e) => setInputPIN(e.target.value)}
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-red-100 transition-all"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#C8102E] text-white rounded-xl font-extrabold text-[16px] hover:bg-[#E63946] transition-all shadow-lg mt-6"
                                >
                                    잠금 해제 및 생성 시작
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                        <Image className="text-[#C8102E]" /> AI 디자인 완성본
                    </h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleGenerateSlideImages} 
                            disabled={isGeneratingImages}
                            className={`flex items-center gap-2 px-4 py-2 ${isGeneratingImages ? 'bg-slate-200 text-slate-400' : 'bg-[#C8102E] text-white hover:bg-red-700'} rounded-xl text-sm font-black shadow-lg shadow-red-500/20 transition-all`}
                        >
                            {isGeneratingImages ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                            {isGeneratingImages ? 'AI 이미지 생성 중...' : 'AI 이미지 재창조 (무료)'}
                        </button>
                        <button onClick={downloadCardNews} className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-colors">
                            <Download size={16} /> 이미지로 다운로드 (전체)
                        </button>
                    </div>
                </div>

                <div
                    ref={cardRef}
                    className="w-full max-w-[400px] mx-auto bg-slate-100 p-4 rounded-xl flex flex-col gap-4 overflow-hidden shadow-inner"
                >
                    {slides.map((slide: any, idx: number) => {
                        const backgroundImageUrl = slideImages[slide.slide] || (uploadedImages.length > 0 ? uploadedImages[idx % uploadedImages.length] : null);
                        return (
                            <div
                                key={idx}
                                id={`card-slide-${idx}`}
                                className="w-full relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-white/10 group"
                                style={{ aspectRatio: ratioInfo?.ratio || '1/1' }}
                            >
                                <div
                                    className="absolute inset-0 z-0"
                                    style={{
                                        backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        filter: themeInfo?.filter || 'none',
                                        backgroundColor: backgroundImageUrl ? 'transparent' : '#1e293b'
                                    }}
                                />
                                <div
                                    className="absolute inset-0 z-10 pointer-events-none"
                                    style={{ backgroundColor: backgroundImageUrl ? (themeInfo?.overlay || 'rgba(0,0,0,0.5)') : 'transparent' }}
                                />
                                <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-10 text-center">
                                    <div className="absolute top-8 left-8 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full font-black text-sm border border-white/20 text-white">
                                        {String(slide.slide).padStart(2, '0')}
                                    </div>
                                    <button
                                        onClick={() => downloadSingleSlide(idx)}
                                        className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-orange-500 backdrop-blur-md rounded-full text-white border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-30"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <div className="space-y-6 w-full animate-in fade-in zoom-in-95 duration-500">
                                        <h2
                                            className={`tracking-tighter leading-[1.1] break-keep drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] ${themeInfo?.font || 'font-black'} ${themeInfo?.color || 'text-white'} text-3xl lg:text-4xl`}
                                            style={(themeInfo as any)?.style}
                                        >
                                            {slide.title}
                                        </h2>
                                        <div className="w-16 h-1.5 mx-auto rounded-full bg-orange-500/80" />
                                        <p className="font-bold break-keep leading-relaxed text-lg drop-shadow-md px-2 text-white/95">
                                            {slide.content}
                                        </p>
                                        {slide.hashtags && (
                                            <div className="pt-6 flex flex-wrap justify-center gap-2">
                                                {slide.hashtags.split(' ').map((tag: string, i: number) => (
                                                    <span key={i} className="inline-block px-3 py-1 bg-white/10 text-white/80 rounded-lg text-[10px] font-bold backdrop-blur-sm border border-white/10">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };



    return (
        <div className="w-full">
            <div className="w-full max-w-5xl mx-auto px-4 py-12 relative">
                {/* Home Exit Button */}
                <div className="absolute top-6 right-6 z-50">
                    <button
                        onClick={onGoHome}
                        className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-[#C8102E] rounded-full text-slate-400 hover:text-white transition-all shadow-sm border border-slate-200 group"
                        title="홈으로 돌아가기"
                    >
                        <X size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">

                    {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full border border-orange-200">
                        <Sparkles size={12} /> AI 콘텐츠 마법사
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        상상하고 입력하면 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8102E] to-red-400">완성</span>되는 콘텐츠
                    </h2>
                    {persona?.brandName && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> {persona.brandName} 페르소나 적용 중
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
{/* Tab Switcher */}
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    {([
                        { id: 'blog', icon: <BookOpen size={16} />, label: '📖 단계별 블로그 작성' },
                        { id: 'caption', icon: <FileText size={16} />, label: '📝 캡션 생성' },
                        { id: 'cardnews', icon: <Image size={16} />, label: '🗞 카드뉴스 스크립트' },
                    ] as const).map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as ContentTab)}
                            className={`flex-1 py-3 px-4 rounded-xl font-black text-sm transition-all ${tab === t.id
                                ? 'bg-white text-[#C8102E] shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* 블로그 마법사 진행 바 */}
                {tab === 'blog' && blogStep !== 'INIT' && (
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200 px-4">
                        <div className={`flex flex-col items-center gap-1 ${['RESEARCHING', 'OUTLINING', 'OUTLINE_CONFIRM', 'DRAFTING', 'DONE'].includes(blogStep) ? 'text-[#C8102E] font-bold' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${blogStep === 'RESEARCHING' ? 'border-[#C8102E] animate-pulse' : 'border-[#C8102E] bg-red-50'}`}>1</div>
                            <span className="text-xs">자료 조사</span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-2 ${['OUTLINING', 'OUTLINE_CONFIRM', 'DRAFTING', 'DONE'].includes(blogStep) ? 'bg-[#C8102E]' : 'bg-slate-200'}`}></div>
                        <div className={`flex flex-col items-center gap-1 ${['OUTLINING', 'OUTLINE_CONFIRM', 'DRAFTING', 'DONE'].includes(blogStep) ? 'text-[#C8102E] font-bold' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${blogStep === 'OUTLINING' ? 'border-[#C8102E] animate-pulse' : ['OUTLINE_CONFIRM', 'DRAFTING', 'DONE'].includes(blogStep) ? 'border-[#C8102E] bg-red-50' : 'border-slate-300'}`}>2</div>
                            <span className="text-xs">글 구성</span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-2 ${['DRAFTING', 'DONE'].includes(blogStep) ? 'bg-[#C8102E]' : 'bg-slate-200'}`}></div>
                        <div className={`flex flex-col items-center gap-1 ${['DRAFTING', 'DONE'].includes(blogStep) ? 'text-[#C8102E] font-bold' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${blogStep === 'DRAFTING' ? 'border-[#C8102E] animate-pulse' : blogStep === 'DONE' ? 'border-[#C8102E] bg-red-50' : 'border-slate-300'}`}>3</div>
                            <span className="text-xs">본문 작성</span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-2 ${blogStep === 'DONE' ? 'bg-[#C8102E]' : 'bg-slate-200'}`}></div>
                        <div className={`flex flex-col items-center gap-1 ${blogStep === 'DONE' ? 'text-[#C8102E] font-bold' : 'text-slate-300'}`}>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${blogStep === 'DONE' ? 'border-[#C8102E] bg-red-50' : 'border-slate-300'}`}>4</div>
                            <span className="text-xs">완성</span>
                        </div>
                    </div>
                )}

                {/* Input Area */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">

                    {/* 플랫폼 선택 (캡션 탭만) */}
                    {tab === 'caption' && (
                        <div className="space-y-3">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">플랫폼 선택</label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map(p =>
                                    p.id !== 'blog' ? (
                                        <button
                                            key={p.id}
                                            onClick={() => setPlatform(p.id)}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${platform === p.id
                                                ? 'border-[#C8102E] bg-red-50 text-[#C8102E]'
                                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-red-200'
                                                }`}
                                        >
                                            {p.emoji} {p.label}
                                        </button>
                                    ) : null
                                )}
                            </div>
                        </div>
                    )}

                    {/* 블로그 테마 선택 (블로그 탭만) */}
                    {tab === 'blog' && (
                        <div className="space-y-3 animate-in fade-in">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">블로그 글쓰기 테마</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {BLOG_THEMES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setBlogTheme(t.id as BlogTheme)}
                                        disabled={blogStep !== 'INIT' && blogStep !== 'DONE'}
                                        className={`p-4 rounded-xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2 ${blogTheme === t.id
                                            ? 'border-[#C8102E] bg-red-50 text-[#C8102E]'
                                            : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed'
                                            }`}
                                    >
                                        <span className="text-2xl">{t.emoji}</span>
                                        <span>{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 사진 업로드 UI (AI 사진 및 카드뉴스 탭 공통) */}
                    {(tab === 'photo' || tab === 'cardnews') && (
                        <div className="space-y-6 animate-in fade-in py-2">
                            <div className="space-y-3">
                                <label className="block text-xs font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                                    <Camera size={14} /> 소스 이미지 업로드 {tab === 'cardnews' ? '(최대 10장)' : '(1장)'}
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group">
                                        <Upload className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
                                        <span className="text-[10px] text-slate-400 mt-1">사진 추가</span>
                                        <input
                                            type="file"
                                            multiple={tab === 'cardnews'}
                                            accept="image/*"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const files = Array.from(e.target.files || []) as File[];
                                                const base64Files = await Promise.all(
                                                    files.map(file => new Promise<string>((resolve) => {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => resolve(reader.result as string);
                                                        reader.readAsDataURL(file);
                                                    }))
                                                );
                                                if (tab === 'photo') {
                                                    setUploadedImages(base64Files.slice(0, 1));
                                                } else {
                                                    setUploadedImages(prev => [...prev, ...base64Files].slice(0, 10));
                                                }
                                            }}
                                        />
                                    </label>
                                    {uploadedImages.map((url, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                                            <img src={url} alt="upload" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-white/80 rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} className="text-slate-600" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 italic">
                                    {tab === 'photo' ? '* 사진을 올리면 AI가 선택한 스타일로 변환해줍니다.' : '* 업로드된 사진들이 카드뉴스 각 장의 배경으로 순차 적용됩니다.'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">슬라이드 수</label>
                                <div className="flex gap-2">
                                    {SLIDE_OPTIONS.map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setSlideCount(num)}
                                            className={`w-14 h-14 rounded-2xl font-black text-lg border-2 transition-all ${slideCount === num
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200'
                                                }`}
                                        >
                                            {num}장
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 설정 섹션: 비율, 테마, 커스텀 지시사항 (1회만 노출) */}
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                                <div className="flex items-center gap-2 text-slate-800 font-black text-sm">
                                    <Clock size={16} className="text-indigo-500" /> 고급 설정
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">이미지 비율</label>
                                    <div className="flex flex-wrap gap-2">
                                        {CARDNEWS_RATIOS.map(r => (
                                            <button
                                                key={r.id}
                                                onClick={() => setSelectedRatio(r.id)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${selectedRatio === r.id
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                                    : 'border-white bg-white text-slate-400 hover:border-indigo-100'
                                                    }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">디자인 템플릿 프리셋 (미리보기)</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                        {CARDNEWS_DESIGN_PRESETS.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTextTheme(t.id)}
                                                className={`relative group overflow-hidden rounded-2xl border-2 transition-all flex flex-col ${selectedTextTheme === t.id
                                                    ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-lg scale-[1.02]'
                                                    : 'border-slate-100 bg-white hover:border-orange-200'
                                                    }`}
                                            >
                                                {/* 썸네일 미리보기 */}
                                                <div className="aspect-square w-full relative overflow-hidden bg-slate-100">
                                                    <img
                                                        src={(t as any).thumbnail}
                                                        alt={t.name}
                                                        className={`w-full h-full object-cover transition-transform duration-500 ${selectedTextTheme === t.id ? 'scale-110' : 'group-hover:scale-110'}`}
                                                    />
                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                                    {selectedTextTheme === t.id && (
                                                        <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-1 shadow-md">
                                                            <Check size={12} strokeWidth={4} />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* 테마 라벨 */}
                                                <div className={`p-2.5 text-center transition-colors ${selectedTextTheme === t.id ? 'bg-orange-50' : 'bg-white'}`}>
                                                    <span className="block text-[10px] font-black leading-tight text-slate-800 break-keep">
                                                        {t.emoji} {t.name}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                                        <span>커스텀 지시사항 <span className="text-slate-400 font-medium normal-case">(선택)</span></span>
                                    </label>
                                    <textarea
                                        value={customInstructions}
                                        onChange={e => setCustomInstructions(e.target.value)}
                                        rows={2}
                                        placeholder="예: 배경 이미지는 무시하고, 텍스트 레이아웃과 색상만 참고해주세요."
                                        className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all resize-none text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
                            {tab === 'caption' ? '콘텐츠 주제' : tab === 'cardnews' ? '카드뉴스 주제' : tab === 'photo' ? '어떤 사진을 원하시나요?' : '블로그 포스팅 키워드 및 주제'}
                        </label>
                        <textarea
                            value={topic}
                            onChange={e => {
                                setTopic(e.target.value);
                                if (tab === 'blog') { setBlogStep('INIT'); setOutlineData(''); setResult(''); }
                            }}
                            rows={3}
                            disabled={tab === 'blog' && blogStep !== 'INIT' && blogStep !== 'DONE'}
                            placeholder={
                                tab === 'caption'
                                    ? '예: 오늘 출시한 신메뉴 딸기 크림 라떼 소개'
                                    : tab === 'cardnews'
                                        ? '예: 우리 가게만의 특별한 레시피나 신메뉴 개발 뒷이야기'
                                        : tab === 'photo'
                                            ? '예: 따뜻한 햇살이 드는 감성 카페의 우드톤 인테리어'
                                            : '예: 강남역 맛집 추천, 분위기 좋은 데이트 장소'
                            }
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all resize-none text-lg disabled:opacity-50"
                        />
                    </div>

                    {/* 핵심 팩트 입력 (모든 탭에서 사용 가능) */}
                    <div className="space-y-2 animate-in fade-in">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest flex items-center justify-between">
                            <span>핵심 팩트 직접 입력 <span className="text-indigo-400 normal-case font-medium">(할루시네이션 완벽 방지용)</span></span>
                        </label>
                        <textarea
                            value={topicDetails}
                            onChange={e => setTopicDetails(e.target.value)}
                            rows={2}
                            disabled={tab === 'blog' && blogStep !== 'INIT' && blogStep !== 'DONE'}
                            placeholder="예: 카드뉴스 각 장에 꼭 들어갔으면 하는 핵심 문구(가격, 특징 등)를 적어주세요. 할루시네이션이 방지됩니다!"
                            className="w-full px-5 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-indigo-900 font-medium placeholder:text-indigo-300 focus:outline-none focus:border-indigo-400 focus:bg-white transition-all resize-none text-sm disabled:opacity-50"
                        />
                    </div>

                    {/* AI 사진 및 카드뉴스 스타일 추천 프롬프트 (photo & cardnews 탭 전용) */}
                    {(tab === 'photo' || tab === 'cardnews') && recommendedPrompts.length > 0 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 py-4">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                    <Sparkles size={16} />
                                    {tab === 'photo' ? '이런 사진 느낌은 어떠세요? (1만 개 테마 중 추천)' : '카드뉴스에 딱 맞는 디자인 테마를 골라보세요!'}
                                </label>
                                <button 
                                    onClick={() => setShowExplorer(true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-[10px] font-black hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                >
                                    <Search size={12} /> 전체 스타일 탐색 (1만개+)
                                </button>
                            </div>
                            <div className="grid gap-3">
                                {recommendedPrompts.map((p, idx) => (
                                    <button
                                        key={p.id || idx}
                                        onClick={() => setSelectedPhotoPrompt(p)}
                                        className={`p-4 text-left rounded-xl border-2 transition-all group ${selectedPhotoPrompt?.id === p.id
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-slate-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex gap-4 items-start">
                                            {p.img && (
                                                <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                                                    <img src={p.img} alt="reference" className="w-full h-full object-cover" loading="lazy" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`font-bold text-sm truncate ${selectedPhotoPrompt?.id === p.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                    {p.t_ko || p.t || '전문가 템플릿'}
                                                </h4>
                                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                                                    {p.d_ko || p.d || p.c?.substring(0, 100) + '...'}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* 일반 탭 버튼 */}
                    {tab !== 'blog' && (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-[0.98] shadow-xl shadow-orange-500/10 disabled:opacity-40 disabled:grayscale"
                        >
                            {isLoading ? (
                                <><Loader2 size={24} className="animate-spin" /> 콘텐츠를 생성 중입니다...</>
                            ) : (
                                <><Sparkles size={24} /> 콘텐츠 생성하기</>
                            )}
                        </button>
                    )}

                    {/* 블로그 마법사 진행 버튼 */}
                    {tab === 'blog' && (blogStep === 'INIT' || blogStep === 'DONE') && (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !topic.trim()}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/20 disabled:opacity-40 disabled:grayscale"
                        >
                            <Sparkles size={24} /> 자료 조사 및 글 구성 시작
                        </button>
                    )}

                    {/* 블로그 마법사 로딩 표시 */}
                    {tab === 'blog' && (blogStep === 'RESEARCHING' || blogStep === 'OUTLINING' || blogStep === 'DRAFTING') && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                            <Loader2 size={40} className="animate-spin text-indigo-500" />
                            <p className="font-bold text-slate-600">
                                {blogStep === 'RESEARCHING' && '네이버 검색을 통해 관련 최신 자료를 조사 중입니다...'}
                                {blogStep === 'OUTLINING' && '조사된 자료를 바탕으로 글의 뼈대를 세우고 있습니다...'}
                                {blogStep === 'DRAFTING' && '승인된 목차에 살을 붙여 상세한 본문을 작성 중입니다...'}
                            </p>
                        </div>
                    )}

                    {/* 목차 컨펌 화면 */}
                    {tab === 'blog' && blogStep === 'OUTLINE_CONFIRM' && (
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 animate-in fade-in space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="text-indigo-600" size={20} />
                                <h3 className="text-lg font-black text-slate-900">블로그 뼈대 구성 완료!</h3>
                            </div>
                            <p className="text-sm text-slate-600 font-medium mb-4">아래 기획안을 확인하고 필요시 수정 창에서 직접 수정한 후 본문 작성을 진행해주세요.</p>

                            <textarea
                                value={outlineData}
                                onChange={(e) => setOutlineData(e.target.value)}
                                className="w-full min-h-[500px] p-4 bg-white border border-indigo-200 rounded-xl text-sm font-medium leading-relaxed resize-y focus:outline-none focus:border-indigo-500"
                            />

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => { setBlogStep('INIT'); setOutlineData(''); }}
                                    className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    주제 다시 입력
                                </button>
                                <button
                                    onClick={handleDraftBlog}
                                    className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FileText size={18} /> 이대로 본문 작성 진행
                                </button>
                            </div>
                        </div>
                    )}
                </div>


                {/* Result */}
                {
                    result && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 size={20} className="text-emerald-500" />
                                    <span className="font-black text-slate-900">생성 완료!</span>
                                    <span className="text-xs text-slate-400 font-bold">
                                        {tab === 'caption' && PLATFORMS.find(p => p.id === platform)?.label}
                                        {tab === 'cardnews' && `${slideCount}장 카드뉴스`}
                                        {tab === 'blog' && '블로그 포스트 (최종)'}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all border-2 ${copied
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'
                                        }`}
                                >
                                    {copied ? <><CheckCircle2 size={14} /> 복사됨!</> : <><Copy size={14} /> 복사</>}
                                </button>
                            </div>
                            {/* 카드뉴스 렌더러가 있으면 그것을 표시, 사진 결과가 있으면 이미지를 표시, 아니면 기본 텍스트 박스 */}
                            {renderCardNews() || (
                                <pre className="whitespace-pre-wrap font-bold text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[500px] max-h-[800px] overflow-y-auto">
                                    {result}
                                </pre>
                            )}

                        </div>
                    )
                }

                {/* History */}
                {
                    history.length > 0 && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <Clock size={18} className="text-slate-400" />
                                    <span className="font-black text-slate-700">최근 생성 히스토리</span>
                                    <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{history.length}</span>
                                </div>
                                {showHistory ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                            </button>

                            {showHistory && (
                                <div className="px-6 pb-6 mt-2">
                                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth p-1">
                                        {history.map(item => (
                                            <div 
                                                key={item.id} 
                                                className="shrink-0 w-[280px] md:w-[calc((100%-32px)/3)] p-5 bg-slate-50 rounded-3xl border border-slate-100 group snap-start hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-[10px] font-black px-2.5 py-1 bg-orange-100 text-orange-600 rounded-full uppercase tracking-tighter">
                                                            {tabLabel[item.tab]}
                                                            {item.platform && ` · ${PLATFORMS.find(p => p.id === item.platform)?.label}`}
                                                        </span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); deleteHistory(item.id); }}
                                                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                    <h4 className="text-xs font-black text-slate-800 line-clamp-1 mb-2">{item.topic}</h4>
                                                    <p className="text-[11px] text-slate-500 font-medium line-clamp-3 leading-relaxed mb-4">{item.result}</p>
                                                </div>
                                                <button
                                                    onClick={() => { setResult(item.result); setTopic(item.topic); }}
                                                    className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-orange-500 hover:bg-orange-50 hover:border-orange-200 transition-all"
                                                >
                                                    불러오기 →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center mt-2 gap-1.5 overflow-hidden h-1">
                                        {history.slice(0, 5).map((_, i) => (
                                            <div key={i} className="w-1 h-1 rounded-full bg-slate-200" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }
            </div>

            {showExplorer && (
                <StyleExplorer 
                    onClose={() => setShowExplorer(false)} 
                    onSelect={(prompt, title) => {
                        setSelectedPhotoPrompt({ id: 'explorer', t: title, d: 'Explorer Style', c: prompt, t_ko: title });
                        setShowExplorer(false);
                    }} 
                />
            )}
                </div>
            </div>
        </div>
    );
};

export default SnsContentCreator;
