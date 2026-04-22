
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Loader2, Download, RefreshCw, Eye, Sparkles, ArrowLeft, Clipboard, Upload, CheckCircle2, Trash2, MessageSquareText, Search, KeyRound, Lock, X } from 'lucide-react';
import { SHOP_CATEGORIES, PHOTO_STYLES, PORTRAIT_STYLES_MALE, PORTRAIT_STYLES_FEMALE, BEAUTY_STYLES_MALE, BEAUTY_STYLES_FEMALE, ShopCategory, MASTER_KEYS } from '../constants';
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

interface PhotoEditorProps {
    onGoHome?: () => void;
}

const PhotoEditor: React.FC<PhotoEditorProps> = ({ onGoHome }) => {
    const { apiKey, setApiKey, isPinVerified, verifyPin } = useApiKey();
    const [step, setStep] = useState<EditorStep>('CATEGORY');
    const [selectedCategory, setSelectedCategory] = useState<ShopCategory | null>(null);
    const [slots, setSlots] = useState<SlotData[]>([
        { id: 1, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" },
        { id: 2, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" },
    ]);
    const [activeSlotId, setActiveSlotId] = useState<number>(1);
    const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
    const [showOriginalMap, setShowOriginalMap] = useState<Record<number, boolean>>({});
    const [showExplorer, setShowExplorer] = useState(false);
    const [isProcessingAll, setIsProcessingAll] = useState(false);
    
    // PIN 인증 관련 상태
    const [showPINModal, setShowPINModal] = useState(false);
    const [inputPIN, setInputPIN] = useState("");
    const [pendingAction, setPendingAction] = useState<{ type: 'SINGLE' | 'ALL', id?: number } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // [클리닝] 사장님 화면의 지저분한 자동 생성 텍스트 자동 청소 효과
    useEffect(() => {
        setSlots(prev => prev.map(slot => {
            if (slot.localRequest && slot.localRequest.includes("Style applied:")) {
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
        if (onGoHome) {
            onGoHome();
        } else {
            setStep('CATEGORY');
            setSelectedCategory(null);
            setSlots(slots.map(s => ({ ...s, original: null, generated: null, isGenerating: false, styleId: PHOTO_STYLES[0].id, localRequest: "" })));
            setActiveSlotId(1);
        }
    };

    // [안전장치] 실수로 새로고침하거나 페이지를 나가는 것 방지
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            const hasWork = slots.some(s => s.original);
            if (hasWork) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [slots]);

    // 보안 모달 핸들러
    const handleActionWithAuth = (type: 'SINGLE' | 'ALL', id?: number) => {
        if (isPinVerified) {
            if (type === 'SINGLE' && id) executeProcessSlot(id);
            else executeProcessAll();
        } else {
            setPendingAction({ type, id });
            setShowPINModal(true);
        }
    };

    const handlePINSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const val = inputPIN.trim();
        if (!val) return;

        // 1. PIN 인증 (6자리 숫자)
        if (val.length === 6 && verifyPin(val)) {
            setShowPINModal(false);
            if (pendingAction?.type === 'SINGLE' && pendingAction.id) {
                executeProcessSlot(pendingAction.id);
            } else if (pendingAction?.type === 'ALL') {
                executeProcessAll();
            }
            setPendingAction(null);
            setInputPIN("");
            return;
        }

        // 2. 마스터 키 별칭 (constants의 MASTER_KEYS 확인)
        if (MASTER_KEYS[val]) {
            setApiKey(MASTER_KEYS[val]);
            alert("✅ 마스터 키가 적용되었습니다.");
            setShowPINModal(false);
            setInputPIN("");
            return;
        }

        // 3. 직접 API 키 입력 (긴 텍스트)
        if (val.length > 20) {
            setApiKey(val);
            alert("✅ 새로운 API 키가 등록되었습니다.");
            setShowPINModal(false);
            setInputPIN("");
            return;
        }

        alert("❌ 올바른 PIN 번호나 API 키가 아닙니다.");
        setInputPIN("");
    };

    const executeProcessSlot = async (slotId: number) => {
        const slot = slots.find(s => s.id === slotId);
        if (!slot || !slot.original || !selectedCategory) return;

        if (!apiKey) {
            alert("⚠️ API Key가 등록되지 않았습니다.");
            return;
        }

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
            const ai = new GoogleGenAI({ apiKey: apiKey, apiVersion: 'v1beta' });
            const base64Data = slot.original.split(',')[1];

            const combinedRequest = slot.localRequest.trim();

            const bgSuffix = isBeauty
                ? `\n\n[BACKGROUND] MANDATORY: Pure solid WHITE background only. Clean white studio portrait.`
                : '';
            
            const basePrompt = slot.customPrompt || style.prompt;

            const styleDirective = `
                I have provided an image as a structural foundation. 
                Your task is to RE-RETOUCH and PROFESSIONALLY EDIT this photo by applying the specific "ARTISTIC STYLE" and "MOOD" described below.
                
                TARGET STYLE & PROMPT: "${basePrompt}${bgSuffix}"
                
                CRITICAL CORE DIRECTIVE (Business Photography):
                - MANDATORY: Keep the RESULT as a HIGH-RESOLUTION REALISTIC PHOTOGRAPH. 
                - ENVIRONMENTAL RE-CREATION: Feel free to SIGNIFICANTLY CHANGE the background and environment to perfectly match the "TARGET STYLE".
                - STRIKING RESEMBLANCE: The person/product in the original image MUST remain exactly as they are.
                - PROFESSIONALISM: Enhance lighting, skin texture, and color grading to a premium gallery level.
                
                Business Category: ${selectedCategory.name}
                User Custom Request: ${combinedRequest || 'None'}
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

            if (!genUrl) throw new Error("Generated image not found");

            setSlots(prev => prev.map(s => s.id === slotId ? { ...s, generated: genUrl, isGenerating: false } : s));
        } catch (err: any) {
            console.error(err);
            setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isGenerating: false } : s));
            alert("보정 중 오류가 발생했습니다: " + String(err));
        }
    };

    const executeProcessAll = async () => {
        const targetSlots = slots.filter(s => s.original && !s.isGenerating);
        if (targetSlots.length === 0) return;

        setIsProcessingAll(true);
        try {
            await Promise.all(targetSlots.map(slot => executeProcessSlot(slot.id)));
        } finally {
            setIsProcessingAll(false);
        }
    };

    const downloadImage = (url: string, id: number) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `THE3_CUT_${id}_${Date.now()}.png`;
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
        <div className="w-full max-w-6xl mx-auto px-4 py-12 relative">
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

            {step === 'CATEGORY' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="mb-20 text-center space-y-6">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                            어떤 종류의 <br />
                            <span className="highlight-underline">가게를 운영하시나요?</span>
                        </h2>
                        <div className="space-y-2">
                            <p className="text-slate-600 font-bold text-lg">업종에 딱 맞는 AI 비즈니스 보정을 시작합니다.</p>
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
                                className="bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-sm hover:border-[#C8102E] hover:shadow-xl hover:-translate-y-2 active:scale-95 transition-all flex flex-col items-center gap-5 text-center group"
                            >
                                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:bg-[#C8102E] group-hover:text-white transition-all">
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

                    {/* Toolbar */}
                    <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">CATEGORY:</span>
                            <span className="text-sm font-black text-[#C8102E]">{selectedCategory?.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowPINModal(true)} className="text-[#C8102E] font-black flex items-center gap-2 hover:bg-red-50 transition-colors text-xs bg-white px-4 py-2 rounded-lg border-2 border-[#C8102E]/20 hover:border-[#C8102E]">
                                <KeyRound size={14} /> API Key 설정
                            </button>
                            <button onClick={reset} className="text-slate-500 font-black flex items-center gap-2 hover:text-[#C8102E] transition-colors text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                                <RefreshCw size={12} /> 처음으로
                            </button>
                        </div>
                    </div>

                    {/* Style Selector */}
                    <section className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-[#C8102E] text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">01</div>
                                <h3 className="text-2xl font-black text-slate-900">
                                    {selectedCategory?.id === 'portrait' ? '화보 스타일' : selectedCategory?.id === 'style_master' ? '1만 개 전문가 테마' : `${activeSlotId}번 사진 테마`} <span className="text-[#C8102E] ml-1">선택</span>
                                </h3>
                            </div>
                            {selectedCategory?.id === 'style_master' && (
                                <button onClick={() => setShowExplorer(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-[#C8102E] transition-all">
                                    <Search size={18} /> 스타일 탐색기
                                </button>
                            )}
                        </div>

                        {(selectedCategory?.id === 'portrait' || selectedCategory?.id === 'beauty') && (
                            <div className="flex gap-3 mb-6">
                                <button onClick={() => setSelectedGender('male')} className={`px-6 py-3 rounded-2xl font-black text-sm border-2 transition-all ${selectedGender === 'male' ? 'bg-[#C8102E] text-white border-[#C8102E]' : 'bg-white text-slate-500 border-slate-200'}`}>🧔 남성</button>
                                <button onClick={() => setSelectedGender('female')} className={`px-6 py-3 rounded-2xl font-black text-sm border-2 transition-all ${selectedGender === 'female' ? 'bg-[#C8102E] text-white border-[#C8102E]' : 'bg-white text-slate-500 border-slate-200'}`}>👩 여성</button>
                            </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {(selectedCategory?.id === 'portrait' ? (selectedGender === 'male' ? PORTRAIT_STYLES_MALE : PORTRAIT_STYLES_FEMALE) : selectedCategory?.id === 'beauty' ? (selectedGender === 'male' ? BEAUTY_STYLES_MALE : BEAUTY_STYLES_FEMALE) : PHOTO_STYLES).map((style) => {
                                const isActive = slots.find(s => s.id === activeSlotId)?.styleId === style.id;
                                return (
                                    <button key={style.id} onClick={() => updateSlotStyle(style.id)} className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${isActive ? 'border-[#C8102E] bg-red-50' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-red-200'}`}>
                                        <div className={isActive ? 'text-[#C8102E]' : 'text-slate-300'}>{style.icon}</div>
                                        <span className="text-[11px] font-black">{style.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                    
                    {/* Workspace */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#C8102E] text-white w-10 h-10 rounded-full flex items-center justify-center font-black shadow-lg">02</div>
                            <h3 className="text-2xl font-black text-slate-900">사진 등록 및 보정</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {slots.map((slot) => (
                                <div key={slot.id} onClick={() => setActiveSlotId(slot.id)} className={`group relative flex flex-col bg-white rounded-[3rem] border-[3px] transition-all duration-500 overflow-hidden ${activeSlotId === slot.id ? 'border-[#C8102E] shadow-[0_40px_100px_rgba(200,16,46,0.12)] -translate-y-2' : 'border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-slate-200'}`}>
                                    {/* Number Badge */}
                                    <div className={`absolute top-6 left-6 z-20 w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg transition-all ${activeSlotId === slot.id ? 'bg-[#C8102E] text-white scale-110' : 'bg-white text-slate-300'}`}>{slot.id}</div>
                                    
                                    {/* Top Right Actions */}
                                    {slot.original && (
                                        <div className="absolute top-6 right-6 flex gap-2 z-20">
                                            {slot.generated && (
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setShowOriginalMap(p => ({...p, [slot.id]: !p[slot.id]})); }} 
                                                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${showOriginalMap[slot.id] ? 'bg-[#C8102E] border-[#C8102E] text-white' : 'bg-white border-slate-100 text-slate-400 hover:border-[#C8102E] hover:text-[#C8102E]'}`}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setSlots(prev => prev.map(s => s.id === slot.id ? {...s, original: null, generated: null} : s)); }} 
                                                className="w-10 h-10 bg-white border-2 border-slate-100 text-slate-300 rounded-xl hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="aspect-[4/5] bg-slate-50 relative overflow-hidden">
                                        {slot.isGenerating && (
                                            <div className="absolute inset-0 z-30 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
                                                <div className="relative">
                                                    <div className="absolute inset-0 animate-ping bg-[#C8102E]/20 rounded-full"></div>
                                                    <Loader2 className="animate-spin text-[#C8102E] relative z-10" size={48} />
                                                </div>
                                                <span className="font-black text-slate-900 tracking-tighter text-lg">AI가 명품으로 보정 중...</span>
                                            </div>
                                        )}

                                        {slot.original ? (
                                            <div className="w-full h-full relative group/img">
                                                <img src={(slot.generated && !showOriginalMap[slot.id]) ? slot.generated : slot.original} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" alt="Work" />
                                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none" />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-[#f1f5f9] flex flex-col items-center justify-center p-8 transition-colors group-hover:bg-[#ebf0f5]">
                                                <div className="flex gap-4 mb-2">
                                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#C8102E] transition-transform hover:scale-110 active:scale-95 cursor-pointer" onClick={(e) => { e.stopPropagation(); setActiveSlotId(slot.id); fileInputRef.current?.click(); }}>
                                                        <Upload size={32} />
                                                    </div>
                                                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-400 transition-transform hover:scale-110 active:scale-95 cursor-pointer hover:text-[#C8102E]" onClick={(e) => { e.stopPropagation(); handleManualPaste(slot.id); }}>
                                                        <Clipboard size={32} />
                                                    </div>
                                                </div>
                                                <span className="mt-4 text-[13px] font-black text-slate-300 tracking-[0.2em]">SELECT IMAGE OR CTRL+V</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 space-y-6 bg-white relative z-10">
                                        <div className="relative">
                                            <MessageSquareText size={18} className="absolute left-4 top-4 text-slate-300" />
                                            <textarea
                                                value={slot.localRequest}
                                                onChange={(e) => updateSlotLocalRequest(slot.id, e.target.value)}
                                                placeholder="추가로 수정하고 싶은 내용이 있다면 적어주세요 (예: 배경을 더 환하게)"
                                                className="w-full bg-slate-50 p-4 pl-12 rounded-2xl text-[13px] font-bold border-2 border-transparent focus:border-[#C8102E]/20 focus:bg-white focus:ring-0 transition-all resize-none h-24 placeholder:text-slate-300"
                                            />
                                        </div>
                                        
                                        <div className="flex items-end justify-between gap-4">
                                            <div className="space-y-1">
                                                <span className="block text-[11px] font-black text-slate-300 tracking-wider">적용 테마</span>
                                                <span className="block text-[15px] font-black text-[#C8102E] truncate leading-none">
                                                    {slot.customStyleName || PHOTO_STYLES.find(s => s.id === slot.styleId)?.name || '미설정'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {slot.original && !slot.isGenerating && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleActionWithAuth('SINGLE', slot.id); }} 
                                                        className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl hover:bg-[#C8102E] transition-all hover:-translate-y-1 active:translate-y-0"
                                                    >
                                                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                                        <span>보정 가동</span>
                                                    </button>
                                                )}
                                                {slot.generated && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); downloadImage(slot.generated!, slot.id); }} 
                                                        className="bg-slate-50 text-slate-900 p-3 rounded-2xl border-2 border-slate-100 hover:bg-white hover:border-[#C8102E]/20 transition-all shadow-sm"
                                                    >
                                                        <Download size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {showExplorer && <StyleExplorer onClose={() => setShowExplorer(false)} onSelect={applyExplorerStyle} />}

            {/* PIN 보안 모달 */}
            {showPINModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
                        <button onClick={() => setShowPINModal(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-[#C8102E]"><Lock size={36} /></div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">보안 인증</h3>
                                <p className="text-slate-500 text-sm font-bold">API 키를 직접 입력하거나<br/>사장님 전용 PIN번호 6자리를 입력해주세요.</p>
                            </div>
                            <form onSubmit={handlePINSubmit} className="space-y-4">
                                <input type="text" value={inputPIN} onChange={(e) => setInputPIN(e.target.value)} placeholder="PIN번호 또는 API Key" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-sm font-black tracking-normal focus:outline-none focus:border-[#C8102E] focus:bg-white transition-all" autoFocus />
                                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#C8102E] transition-all">확인 및 가동</button>
                            </form>
                        </div>
                    </div>
                </div>
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
