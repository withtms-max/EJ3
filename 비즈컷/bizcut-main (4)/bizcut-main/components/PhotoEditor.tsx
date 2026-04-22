
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Loader2, Download, RefreshCw, Eye, Sparkles, ArrowLeft, Clipboard, Upload, CheckCircle2, Trash2, MessageSquareText, Search } from 'lucide-react';
import { SHOP_CATEGORIES, PHOTO_STYLES, PORTRAIT_STYLES_MALE, PORTRAIT_STYLES_FEMALE, BEAUTY_STYLES_MALE, BEAUTY_STYLES_FEMALE, ShopCategory } from '../constants';
import { GoogleGenAI } from "@google/genai";
import { useApiKey } from '../context/ApiKeyContext';
import StyleExplorer from './StyleExplorer';

interface SlotData {
    id: number;
    original: string | null;
    generated: string | null;
    isGenerating: boolean;
    styleId: string;
    localRequest: string;
    customPrompt?: string; 
    customStyleName?: string; // 스타일의 한국어 이름 저장
}

type EditorStep = 'CATEGORY' | 'MAIN';
// [전역 캐시] 추천 스타일 로딩 속도 최적화
let cachedPromptData: any = null;

const PhotoEditor: React.FC = () => {
    const { apiKey } = useApiKey();
    const [step, setStep] = useState<EditorStep>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<ShopCategory | null>(null);
    const [slots, setSlots] = useState<SlotData[]>([
        { id: 1, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" },
        { id: 2, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" },
        { id: 3, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" },
        { id: 4, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" },
    ]);
    const [activeSlotId, setActiveSlotId] = useState<number>(1);
    const [specialRequest, setSpecialRequest] = useState("");
    const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
    const [showOriginalMap, setShowOriginalMap] = useState<Record<number, boolean>>({});
    const [showExplorer, setShowExplorer] = useState(false);
    const [isProcessingAll, setIsProcessingAll] = useState(false);

    // [삭제] 더 이상 추천 스타일을 내부적으로 불러오거나 관리하지 않습니다.


    const fileInputRef = useRef<HTMLInputElement>(null);

    // [클리닝] 사장님 화면의 지저분한 자동 생성 텍스트 자동 청소 효과
    useEffect(() => {
        setSlots(prev => prev.map(slot => {
            if (slot.localRequest && slot.localRequest.includes("Style applied:")) {
                // "Style applied: ... ." 형태의 패턴을 찾아서 삭제 (정규식 활용)
                const cleaned = slot.localRequest.replace(/Style applied:.*?\.\s?/g, '').trim();
                if (cleaned !== slot.localRequest) {
                    return { ...slot, localRequest: cleaned };
                }
            }
            return slot;
        }));
    }, []);

    useEffect(() => {
        const handleGlobalPaste = async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            updateSlotImage(activeSlotId, event.target?.result as string);
                            const nextEmpty = slots.find(s => s.id > activeSlotId && !s.original);
                            if (nextEmpty) setActiveSlotId(nextEmpty.id);
                        };
                        reader.readAsDataURL(blob);
                    }
                }
            }
        };

        window.addEventListener('paste', handleGlobalPaste);
        return () => window.removeEventListener('paste', handleGlobalPaste);
    }, [activeSlotId, slots]);

    const updateSlotImage = (id: number, data: string) => {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, original: data, generated: null } : s));
    };

    const updateSlotStyle = (styleId: string, name?: string) => {
        setSlots(prev => prev.map(s => s.id === activeSlotId ? { ...s, styleId, customPrompt: undefined, customStyleName: undefined } : s));
    };

    const applyExplorerStyle = (prompt: string, title: string) => {
        setSlots(prev => prev.map(s => s.id === activeSlotId ? { ...s, customPrompt: prompt, customStyleName: title } : s));
        setShowExplorer(false);
    };

    const updateSlotLocalRequest = (id: number, text: string) => {
        setSlots(prev => prev.map(s => s.id === id ? { ...s, localRequest: text } : s));
    };

    const reset = () => {
        setStep('CATEGORY');
        setSelectedCategory(null);
        setSlots(slots.map(s => ({ ...s, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" })));
        setSpecialRequest("");
        setActiveSlotId(1);
    };

    const processSlot = async (slotId: number) => {
        const slot = slots.find(s => s.id === slotId);
        if (!slot || !slot.original || !selectedCategory) return;

        if (!apiKey) {
            alert("⚠️ API Key 또는 비밀번호가 등록되지 않았습니다.\n\n홈 화면의 '무료로 시작하기' 버튼을 눌러 사장님이 알려주신 비밀번호 6자리를 먼저 입력해 주세요!");
            return;
        }

        // 포트레이트 / 헤어뷰티 모드에서는 성별별 스타일 배열 사용
        const isPortrait = selectedCategory.id === 'portrait';
        const isBeauty = selectedCategory.id === 'beauty';
        let allStyles;
        if (isPortrait) {
            allStyles = selectedGender === 'male' ? PORTRAIT_STYLES_MALE : PORTRAIT_STYLES_FEMALE;
        } else if (isBeauty) {
            allStyles = selectedGender === 'male' ? BEAUTY_STYLES_MALE : BEAUTY_STYLES_FEMALE;
        } else {
            allStyles = PHOTO_STYLES;
        }
        const style = allStyles.find(ps => ps.id === slot.styleId) || allStyles[0];


        setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isGenerating: true } : s));

        try {
            console.log("BizCut: Initializing Gemini SDK v1beta with gemini-3.1-flash-image-preview");
            // @ts-ignore
            const ai = new GoogleGenAI({ apiKey: apiKey, apiVersion: 'v1beta' });
            const base64Data = slot.original.split(',')[1];

            const combinedRequest = [
                specialRequest.trim(),
                slot.localRequest.trim()
            ].filter(Boolean).join(". Also, ");

            // 포트레이트 / 뷰티 모드: 상세 프롬프트를 직접 사용
            const bgSuffix = isBeauty
                ? `\n\n[BACKGROUND] MANDATORY: Pure solid WHITE background only. NO colored backgrounds, NO outdoor scenes, NO artistic backgrounds, NO patterns. Clean white studio portrait. Head and shoulders crop, person only.`
                : '';
            
            const basePrompt = slot.customPrompt || style.prompt;

            // [고도화] Image-to-Image 스타일 전송 엔진 프롬프트 (High-End Photo Focus)
            const styleDirective = `
                I have provided an image as a structural foundation. 
                Your task is to RE-RETOUCH and PROFESSIONALLY EDIT this photo by applying the specific "ARTISTIC STYLE" and "MOOD" described below.
                
                TARGET STYLE & PROMPT: "${basePrompt}${bgSuffix}"
                
                CRITICAL CORE DIRECTIVE (Business Photography):
                - MANDATORY: Keep the RESULT as a HIGH-RESOLUTION REALISTIC PHOTOGRAPH. 
                - ENVIRONMENTAL RE-CREATION: Feel free to SIGNIFICANTLY CHANGE the background and the environment of the original image to perfectly match the "TARGET STYLE". Re-imagine the settings, add complementary props, and create a masterpiece scene around the original subject.
                - If the Target Style implies drawing/sketching/illustration, IGNORE those medium formats. Instead, interpret only the "COLOR PALETTE", "LIGHTING", and "ATMOSPHERE" from that style and apply it to a REAL PHOTOGRAPH.
                - STRIKING RESEMBLANCE: The person/product in the original image MUST remain exactly as they are in terms of facial features, body structure, and details.
                - PROFESSIONALISM: Enhance lighting, skin texture, and color grading to a premium gallery level.
                
                Additional Context:
                - Business Category: ${selectedCategory.name}
                - Technical Instructions: Ensure professional lighting, high-end texture, and commercial-grade quality.
                - User Custom Request: ${combinedRequest || 'None'}
                
                IMPORTANT RULES:
                1. DO NOT add any text, typography, letters, or watermarks.
                2. Keep the original subject recognizable but aesthetically transformed into a masterpiece photo.
                3. NO CARTOON, NO ANIME, NO DRAWING. ALWAYS REALISTIC PHOTO OUTPUT.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3.1-flash-image-preview',
                contents: {
                    parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/png' } },
                        { text: styleDirective },
                    ],
                },
                generationConfig: {
                    // @ts-ignore
                    responseModalities: ["IMAGE"]
                }
            });


            let genUrl = null;
            // @ts-ignore
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        genUrl = `data:image/png;base64,${part.inlineData.data}`;
                        break;
                    }
                }
            }

            if (!genUrl) throw new Error("Generated image not found in response");

            setSlots(prev => prev.map(s => s.id === slotId ? { ...s, generated: genUrl, isGenerating: false } : s));
        } catch (err: any) {
            console.error("BizCut Core Error Object:", err);
            if (err.response) {
                try {
                    console.error("API Response Data:", await err.response.json());
                } catch(e) {}
            }
            setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isGenerating: false } : s));

            let message = "이미지 생성 중 오류가 발생했습니다.";
            const errStr = String(err);

            if (errStr.includes("403") || errStr.includes("leaked") || errStr.includes("PERMISSION_DENIED")) {
                message = "🔐 보안 이슈: 현재 사용 중인 API 키가 외부에 유출되어 Google에 의해 차단되었습니다.\n\n새로운 개인 API 키를 발급받아 홈 화면에서 다시 입력해 주세요.\n(무료 발급: aistudio.google.com/app/apikey)";
            } else if (errStr.includes("400") || errStr.includes("API_KEY_INVALID") || errStr.includes("not valid")) {
                message = "🔑 비밀번호(혹은 API 키)가 올바르지 않습니다.\n홈 화면에서 사장님이 알려주신 비밀번호를 다시 확인해 주세요.";
            } else if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED")) {
                message = "☕ 현재 이용자가 많아 할당량이 초과되었습니다.\n1~2분 뒤에 다시 시도해 주시면 감사하겠습니다.";
            } else if (errStr.includes("safety") || errStr.includes("SAFETY")) {
                message = "⚠️ AI가 부적절한 이미지나 요청으로 판단하여 노출을 제한했습니다.\n다른 사진이나 요청 사항으로 시도해 주세요.";
            } else {
                message = "이미지 생성 중 알 수 없는 오류가 발생했습니다.\n다른 사진을 사용해 보시거나 잠시 후 다시 시도해 주세요.";
            }

            alert(`[알림]\n\n${message}\n\n상세 정보: ${errStr.substring(0, 100)}...`);
        }
    };

    const processAll = async () => {
        const targetSlots = slots.filter(s => s.original && !s.isGenerating);
        if (targetSlots.length === 0) return;

        setIsProcessingAll(true);
        try {
            // Run all slot processing in parallel
            await Promise.all(targetSlots.map(slot => processSlot(slot.id)));
        } finally {
            setIsProcessingAll(false);
        }
    };

    const downloadImage = (url: string, id: number) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `BizCut_${id}_${Date.now()}.png`;
        link.click();
    };

    const handleManualPaste = async (id: number) => {
        setActiveSlotId(id);
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                for (const type of item.types) {
                    if (type.startsWith('image/')) {
                        const blob = await item.getType(type);
                        const reader = new FileReader();
                        reader.onloadend = () => updateSlotImage(id, reader.result as string);
                        reader.readAsDataURL(blob);
                        return;
                    }
                }
            }
            alert("이미지를 복사한 뒤 눌러주세요.");
        } catch (e) {
            alert("Ctrl+V 키를 직접 눌러주세요.");
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-12">
            {step === 'CATEGORY' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="mb-20 text-center space-y-6">
                        <div className="inline-block px-4 py-1 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full border border-orange-200 mb-2">
                            소상공인 전용 AI 사진 보정 서비스
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                            어떤 종류의 <br />
                            <span className="highlight-underline">가게를 운영하시나요?</span>
                        </h2>
                        <div className="space-y-2">
                            <p className="text-slate-600 font-bold text-lg">업종에 딱 맞는 AI 모델을 준비해드립니다.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {SHOP_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => { 
                                    setSelectedCategory(cat); 
                                    setStep('MAIN'); 
                                    if (cat.id === 'style_master') setShowExplorer(true);
                                }}
                                className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:border-orange-500 hover:shadow-xl hover:-translate-y-2 active:scale-95 transition-all flex flex-col items-center gap-5 text-center group"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                    {cat.icon}
                                </div>
                                <div className="font-black text-xl text-slate-800">{cat.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'MAIN' && (
                <div className="animate-in fade-in duration-500 space-y-12">

                    {/* Toolbar for Editor */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">CATEGORY:</span>
                            <span className="text-sm font-black text-slate-900">{selectedCategory?.name}</span>
                        </div>
                        <button onClick={reset} className="text-slate-500 font-black flex items-center gap-2 hover:text-orange-600 transition-colors text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <RefreshCw size={12} /> 처음으로 / 카테고리 변경
                        </button>
                    </div>

                    {/* Style Selector */}
                    <section className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">01</div>
                                <h3 className="text-2xl font-black text-slate-900">
                                    {selectedCategory?.id === 'portrait'
                                        ? <><span className="text-orange-600">화보 스타일</span> 선택</>
                                        : selectedCategory?.id === 'style_master'
                                            ? <><span className="text-orange-600">1만 개 전문가 테마</span> 라이브러리</>
                                            : <><span className="text-orange-600">{activeSlotId}번 사진</span> 테마 설정</>
                                    }
                                </h3>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedCategory?.id === 'style_master' && (
                                    <button
                                        onClick={() => setShowExplorer(true)}
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-orange-600 transition-all active:scale-95"
                                    >
                                        <Search size={18} /> 1만 개 스타일 전체 탐색
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 추천 스타일 리스트 제거됨 */}

                        {/* 사장님컷 / 헤어뷰티 전용: 남/여 성별 토글 */}
                        {(selectedCategory?.id === 'portrait' || selectedCategory?.id === 'beauty') && (
                            <div className="flex gap-3 mb-6">
                                <button
                                    onClick={() => { setSelectedGender('male'); updateSlotStyle((selectedCategory?.id === 'beauty' ? BEAUTY_STYLES_MALE : PORTRAIT_STYLES_MALE)[0].id); }}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm border-2 transition-all ${selectedGender === 'male' ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300'}`}
                                >
                                    {selectedCategory?.id === 'beauty' ? '✂️ 남성 스타일' : '🧔 남성'}
                                </button>
                                <button
                                    onClick={() => { setSelectedGender('female'); updateSlotStyle((selectedCategory?.id === 'beauty' ? BEAUTY_STYLES_FEMALE : PORTRAIT_STYLES_FEMALE)[0].id); }}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm border-2 transition-all ${selectedGender === 'female' ? 'bg-orange-600 text-white border-orange-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-orange-300'}`}
                                >
                                    {selectedCategory?.id === 'beauty' ? '💇 여성 스타일' : '👩 여성'}
                                </button>
                                <span className="ml-2 text-xs font-bold text-slate-400 self-center">{selectedCategory?.id === 'beauty' ? '원하는 헤어 스타일 성별을 선택하세요' : '인물 성별을 선택하면 최적화된 스타일이 표시됩니다'}</span>
                            </div>
                        )}

                        {/* 스타일 그리드 */}
                        <div className={`grid gap-4 ${(selectedCategory?.id === 'portrait' || selectedCategory?.id === 'beauty') ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-5'}`}>
                            {(selectedCategory?.id === 'portrait'
                                ? (selectedGender === 'male' ? PORTRAIT_STYLES_MALE : PORTRAIT_STYLES_FEMALE)
                                : selectedCategory?.id === 'beauty'
                                    ? (selectedGender === 'male' ? BEAUTY_STYLES_MALE : BEAUTY_STYLES_FEMALE)
                                    : PHOTO_STYLES
                            ).map((style) => {
                                const currentSlot = slots.find(s => s.id === activeSlotId);
                                const isActiveForCurrent = !currentSlot?.customPrompt && currentSlot?.styleId === style.id;
                                return (
                                    <button
                                        key={style.id}
                                        onClick={() => updateSlotStyle(style.id)}
                                        className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center text-center gap-3 group ${isActiveForCurrent
                                            ? 'border-orange-500 bg-orange-50/50 shadow-md'
                                            : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-orange-200'
                                            } ${currentSlot?.customPrompt ? 'opacity-40 grayscale-[0.5]' : ''}`} // 커스텀 스타일 선택 시 그리드 시각적 비활성화
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${isActiveForCurrent ? 'text-orange-600 bg-white shadow-sm' : 'text-slate-300 group-hover:text-orange-400'}`}>
                                            {style.icon}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[11px] font-black leading-tight ${isActiveForCurrent ? 'text-orange-700' : 'text-slate-600'}`}>
                                                {style.name}
                                            </span>
                                            {'description' in style && (
                                                <span className="text-[9px] text-slate-400 leading-tight">{(style as any).description}</span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 선택된 커스텀 스타일 미리보기 유도 */}
                        {slots.find(s => s.id === activeSlotId)?.customPrompt && (
                            <div className="mt-6 p-6 bg-orange-50 rounded-3xl border border-orange-100 flex items-center justify-between animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden border-4 border-white shadow-lg shrink-0">
                                        <div className="w-full h-full p-4 text-orange-500 bg-white flex items-center justify-center">
                                            <Sparkles size={32} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-black text-orange-700 text-lg">아래 사진에 입힐 전문가 스타일이 선택되었습니다!</h4>
                                        <p className="text-sm text-slate-500 font-bold opacity-70">이제 02번 섹션에서 사진을 올리고 '보정하기'를 눌러보세요.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSlots(prev => prev.map(s => s.id === activeSlotId ? { ...s, customPrompt: undefined } : s))}
                                    className="px-4 py-2 bg-white text-slate-400 rounded-xl text-xs font-bold hover:text-red-500 transition-colors"
                                >
                                    초기화
                                </button>
                            </div>
                        )}
                    </section>

                    {/* Photo Workspace */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">02</div>
                            <h3 className="text-2xl font-black text-slate-900">사진 등록 및 정밀 보정</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {slots.map((slot) => {
                                const allStylesForSlot =
                                    selectedCategory?.id === 'portrait'
                                        ? (selectedGender === 'male' ? PORTRAIT_STYLES_MALE : PORTRAIT_STYLES_FEMALE)
                                        : selectedCategory?.id === 'beauty'
                                            ? (selectedGender === 'male' ? BEAUTY_STYLES_MALE : BEAUTY_STYLES_FEMALE)
                                            : PHOTO_STYLES;
                                const currentStyle = allStylesForSlot.find(ps => ps.id === slot.styleId);

                                return (
                                    <div
                                        key={slot.id}
                                        onClick={() => setActiveSlotId(slot.id)}
                                        className={`relative flex flex-col bg-white rounded-[3rem] border-4 transition-all overflow-hidden ${activeSlotId === slot.id ? 'border-orange-500 shadow-2xl scale-[1.01]' : 'border-white shadow-sm'
                                            }`}
                                    >
                                        <div className="relative aspect-[4/3] bg-slate-50 group">
                                            <div className={`absolute top-6 left-6 z-30 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl transition-all ${activeSlotId === slot.id ? 'bg-orange-600 text-white rotate-3' : 'bg-white text-slate-300'
                                                }`}>
                                                {slot.id}
                                            </div>

                                            {slot.isGenerating && (
                                                <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
                                                    <div className="relative mb-6">
                                                        <Loader2 className="animate-spin text-orange-600" size={64} />
                                                        <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
                                                    </div>
                                                    <span className="font-black text-2xl text-slate-900 tracking-tighter">전문가용 엔진 가동 중...</span>
                                                    <p className="text-slate-500 text-xs mt-2 font-bold uppercase tracking-widest">Optimizing for Business</p>
                                                </div>
                                            )}

                                            {slot.original ? (
                                                <>
                                                    <img
                                                        src={(slot.generated && !showOriginalMap[slot.id]) ? slot.generated : slot.original}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-6 right-6 flex gap-3 z-30">
                                                        {slot.generated && (
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setShowOriginalMap(prev => ({ ...prev, [slot.id]: !prev[slot.id] })); }}
                                                                title={showOriginalMap[slot.id] ? '보정 후 보기' : '원본 보기'}
                                                                className={`backdrop-blur px-4 py-3 rounded-2xl shadow-2xl active:scale-90 transition-all border ${showOriginalMap[slot.id] ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/95 text-slate-800 hover:bg-white border-slate-100'}`}
                                                            >
                                                                 <Eye size={22} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, original: null, generated: null, localRequest: "" } : s)); }}
                                                            className="bg-white/95 backdrop-blur px-4 py-3 rounded-2xl text-red-500 shadow-2xl hover:bg-red-50 active:scale-90 transition-all border border-slate-100"
                                                        >
                                                            <Trash2 size={22} />
                                                        </button>
                                                    </div>
                                                    {slot.generated && (
                                                        <div className="absolute bottom-6 left-6 bg-orange-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black text-sm shadow-2xl animate-in slide-in-from-left-4 duration-500">
                                                            <CheckCircle2 size={18} /> 보정 완료
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-slate-300">
                                                    <div className="flex gap-6">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setActiveSlotId(slot.id); fileInputRef.current?.click(); }}
                                                            className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center hover:text-orange-500 hover:scale-110 transition-all border border-slate-100"
                                                        >
                                                            <Upload size={36} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleManualPaste(slot.id); }}
                                                            className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center hover:text-orange-500 hover:scale-110 transition-all border border-slate-100"
                                                        >
                                                            <Clipboard size={36} />
                                                        </button>
                                                    </div>
                                                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Image or Ctrl+V</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 space-y-6 bg-white">
                                            <div className="relative">
                                                <div className="absolute left-4 top-4 text-slate-300">
                                                    <MessageSquareText size={20} />
                                                </div>
                                                <textarea
                                                    value={slot.localRequest}
                                                    onChange={(e) => updateSlotLocalRequest(slot.id, e.target.value)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    placeholder={`추가로 수정하고 싶은 내용이 있다면 적어주세요 (예: 주황색 배경으로 바꿔줘)`}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none h-20"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">적용 테마</span>
                                                    <span className="text-base font-black text-orange-600">{slot.customStyleName || currentStyle?.name}</span>
                                                </div>

                                                <div className="flex gap-3">
                                                    {slot.original && (
                                                        <button
                                                            disabled={slot.isGenerating}
                                                            onClick={(e) => { e.stopPropagation(); processSlot(slot.id); }}
                                                            className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                                                        >
                                                            <Sparkles size={16} /> {slot.generated ? '다시 보정' : '보정하기'}
                                                        </button>
                                                    )}
                                                    {slot.generated && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); downloadImage(slot.generated!, slot.id); }}
                                                            className="bg-white border-2 border-slate-200 text-slate-900 px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 hover:bg-slate-50 transition-all shadow-md active:scale-95"
                                                        >
                                                            <Download size={16} /> 저장
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Global Requests Section */}
                    <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">03</div>
                            <h3 className="text-2xl font-black text-slate-900">전체 공통 요청</h3>
                        </div>
                        <textarea
                            value={specialRequest}
                            onChange={(e) => setSpecialRequest(e.target.value)}
                            placeholder="모든 사진에 공통적으로 적용할 내용을 적어주세요 (예: 가게 분위기를 더 따뜻하게 해주세요)"
                            className="w-full h-32 bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-sm font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-500 focus:bg-white transition-all resize-none shadow-inner"
                        />
                    </section>

                    <div className="h-40"></div>

                    {/* Bottom Action Bar */}
                    <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
                        <div className="max-w-3xl mx-auto flex gap-4">
                            <button
                                onClick={() => setStep('CATEGORY')}
                                className="bg-white text-slate-900 p-6 rounded-[2rem] shadow-2xl active:scale-95 transition-all hover:bg-slate-50 border border-slate-200"
                            >
                                <ArrowLeft size={32} />
                            </button>
                            <button
                                disabled={!slots.some(s => s.original && !s.isGenerating) || isProcessingAll}
                                onClick={processAll}
                                className="flex-1 warm-gradient text-white py-6 rounded-[2rem] text-2xl font-black shadow-2xl flex items-center justify-center gap-4 disabled:opacity-40 disabled:grayscale active:scale-[0.98] transition-all"
                            >
                                {isProcessingAll ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={32} />}
                                <span>{isProcessingAll ? '전체 사진 보정 중...' : '전체 사진 한꺼번에 보정하기'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExplorer && (
                <StyleExplorer 
                    onClose={() => setShowExplorer(false)} 
                    onSelect={applyExplorerStyle} 
                />
            )}

            <input type="file" ref={fileInputRef} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => updateSlotImage(activeSlotId, ev.target?.result as string);
                    reader.readAsDataURL(file);
                }
                e.target.value = '';
            }} accept="image/*" className="hidden" />
        </div>
    );
};

export default PhotoEditor;
