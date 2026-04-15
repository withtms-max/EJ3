
import React, { useState, useEffect } from 'react';
import { User, Sparkles, Save, CheckCircle2, Briefcase, Coffee, ShoppingBag, Utensils, Camera, Music, Info, ChevronDown, ChevronUp } from 'lucide-react';

export interface PersonaData {
    brandName: string;
    industry: string;
    tone: string;
    targetAudience: string;
    description: string;
}

const PERSONA_TEMPLATES = [
    {
        id: 'marketer',
        icon: <Briefcase size={28} />,
        name: '전문 마케터',
        tone: '전문적이고 신뢰감 있는',
        targetAudience: '비즈니스 오너 및 마케팅 담당자',
        description: '데이터 기반의 인사이트와 전문 용어를 활용하여 신뢰감 있는 콘텐츠를 만듭니다.',
    },
    {
        id: 'cafe',
        icon: <Coffee size={28} />,
        name: '카페 / 식음료',
        tone: '따뜻하고 감성적인',
        targetAudience: '20-40대 카페 & 맛집 탐방 애호가',
        description: '분위기 있는 감성 사진과 함께 먹고 싶게 만드는 입맛 자극 콘텐츠를 만듭니다.',
    },
    {
        id: 'fashion',
        icon: <ShoppingBag size={28} />,
        name: '패션 / 쇼핑몰',
        tone: '트렌디하고 세련된',
        targetAudience: '패션에 관심 있는 1020-30대',
        description: '최신 트렌드를 반영한 세련된 무드와 스타일리시한 카피를 작성합니다.',
    },
    {
        id: 'restaurant',
        icon: <Utensils size={28} />,
        name: '음식점 / 소상공인',
        tone: '친근하고 정겨운',
        targetAudience: '지역 주민 및 근처 직장인',
        description: '사장님의 정성과 음식의 맛을 생생하게 전달하는 친근한 콘텐츠를 만듭니다.',
    },
    {
        id: 'photographer',
        icon: <Camera size={28} />,
        name: '포토그래퍼 / 크리에이터',
        tone: '예술적이고 감각적인',
        targetAudience: '사진 & 디자인에 관심 있는 크리에이터',
        description: '시각적 스토리텔링과 감각적인 표현으로 작업물의 가치를 높이는 콘텐츠를 씁니다.',
    },
    {
        id: 'influencer',
        icon: <Music size={28} />,
        name: '인플루언서 / 라이프스타일',
        tone: '유쾌하고 공감 가는',
        targetAudience: '팔로워들과 소통하고 싶은 모든 이',
        description: '일상을 공유하며 팔로워와 진정성 있는 소통을 이끌어내는 콘텐츠를 만듭니다.',
    },
];

const TONE_OPTIONS = [
    '전문적이고 신뢰감 있는',
    '따뜻하고 감성적인',
    '트렌디하고 세련된',
    '친근하고 정겨운',
    '유쾌하고 에너지 넘치는',
    '예술적이고 감각적인',
    '진중하고 정보 중심의',
];

const PERSONA_KEY = 'bizcut_persona';

const PersonaSetup: React.FC = () => {
    const [persona, setPersona] = useState<PersonaData>({
        brandName: '',
        industry: '',
        tone: TONE_OPTIONS[0],
        targetAudience: '',
        description: '',
    });
    const [saved, setSaved] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(PERSONA_KEY);
        if (stored) {
            try {
                setPersona(JSON.parse(stored));
            } catch { }
        }
    }, []);

    const applyTemplate = (template: typeof PERSONA_TEMPLATES[0]) => {
        setSelectedTemplate(template.id);
        setPersona(prev => ({
            ...prev,
            tone: template.tone,
            targetAudience: template.targetAudience,
            description: template.description,
        }));
    };

    const handleSave = () => {
        localStorage.setItem(PERSONA_KEY, JSON.stringify(persona));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const isComplete = persona.brandName.trim() && persona.industry.trim() && persona.targetAudience.trim();

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-12">
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Header */}
                <div className="mb-12 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-full border border-orange-200">
                        <User size={12} /> 내 브랜드 페르소나
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                        AI가 당신의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">목소리</span>를 배웁니다
                    </h2>
                    <p className="text-slate-500 font-medium text-lg">
                        한 번 설정하면 모든 SNS 콘텐츠에 자동 적용됩니다.
                    </p>
                </div>

                {/* Guide Accordion */}
                <div className="mb-8 bg-indigo-50/50 rounded-2xl border border-indigo-100 overflow-hidden transition-all">
                    <button
                        onClick={() => setIsGuideOpen(!isGuideOpen)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-indigo-50 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                <Info size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-indigo-900">페르소나(Persona) 설정이 무엇인가요?</h3>
                                <p className="text-xs text-indigo-600/80 font-medium mt-0.5">상인분들을 위한 쉬운 가이드 (클릭해서 펼치기)</p>
                            </div>
                        </div>
                        {isGuideOpen ? <ChevronUp size={20} className="text-indigo-400" /> : <ChevronDown size={20} className="text-indigo-400" />}
                    </button>

                    {isGuideOpen && (
                        <div className="px-6 pb-6 pt-2 border-t border-indigo-100/50 flex flex-col gap-4 text-sm text-slate-700 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2">
                            <p>
                                🎯 <strong>혹시 매번 AI에게 "우리 가게는 당산역 돈까스 맛집 카츠메종이고, 친근한 말투로 20-30대를 겨냥해서 써줘"라고 지시하기 귀찮지 않으신가요?</strong>
                            </p>
                            <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm space-y-2">
                                <p><strong>💡 페르소나 설정이란?</strong></p>
                                <p>AI에게 <strong>'우리 브랜드(가게)의 정체성 명함'</strong>을 쥐어주는 기능입니다. 여기에 우리 가게의 이름, 주요 독자층, 말하는 스타일을 딱 한 번만 저장해 두면 됩니다.</p>
                                <p>그러면 블로그나 인스타그램 글을 새로 작성할 때마다 AI가 <strong>"아 맞다, 나는 지금부터 카츠메종 사장님이지!"</strong> 하고 똑똑하게 기억해서 찰떡같은 글을 써주게 됩니다.</p>
                            </div>
                            <ul className="list-disc list-inside space-y-1 ml-1 text-slate-600">
                                <li>잘 모르시겠다면, 아래의 <strong>[빠른 시작 템플릿]</strong> 중에서 내 업종과 비슷한 것을 꾹 눌러보세요!</li>
                                <li>나중에 언제든지 다시 수정할 수 있습니다.</li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Templates */}
                <section className="mb-8">
                    <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                        <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-black">1</span>
                        빠른 시작 — 템플릿 선택
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {PERSONA_TEMPLATES.map((tmpl) => (
                            <button
                                key={tmpl.id}
                                onClick={() => applyTemplate(tmpl)}
                                className={`p-5 rounded-[1.5rem] border-2 text-left transition-all hover:-translate-y-1 ${selectedTemplate === tmpl.id
                                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                                    : 'border-slate-100 bg-white hover:border-orange-200 hover:shadow-md'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${selectedTemplate === tmpl.id ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {tmpl.icon}
                                </div>
                                <div className="font-black text-sm text-slate-900">{tmpl.name}</div>
                                <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{tmpl.description.slice(0, 40)}...</div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Form */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <span className="w-7 h-7 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-black">2</span>
                        상세 설정
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">브랜드 / 가게 이름 *</label>
                            <input
                                type="text"
                                value={persona.brandName}
                                onChange={e => setPersona(p => ({ ...p, brandName: e.target.value }))}
                                placeholder="예: 홍씨네 카페, 스튜디오 MOY"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">업종 *</label>
                            <input
                                type="text"
                                value={persona.industry}
                                onChange={e => setPersona(p => ({ ...p, industry: e.target.value }))}
                                placeholder="예: 스페셜티 카페, 여성 의류 쇼핑몰"
                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">콘텐츠 톤 & 스타일</label>
                        <div className="flex flex-wrap gap-2">
                            {TONE_OPTIONS.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setPersona(p => ({ ...p, tone: t }))}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${persona.tone === t
                                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                                        : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">타겟 고객 *</label>
                        <input
                            type="text"
                            value={persona.targetAudience}
                            onChange={e => setPersona(p => ({ ...p, targetAudience: e.target.value }))}
                            placeholder="예: 20-30대 직장인 여성, 지역 주민 가족"
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">브랜드 소개 (선택)</label>
                        <textarea
                            value={persona.description}
                            onChange={e => setPersona(p => ({ ...p, description: e.target.value }))}
                            placeholder="AI에게 알려줄 브랜드 특징, 강점, 분위기를 자유롭게 적어주세요..."
                            rows={3}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all resize-none"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!isComplete}
                        className={`w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg ${saved
                            ? 'bg-emerald-500 text-white'
                            : isComplete
                                ? 'bg-slate-900 text-white hover:bg-orange-600 shadow-orange-500/20'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                            }`}
                    >
                        {saved ? (
                            <><CheckCircle2 size={22} /> 저장 완료!</>
                        ) : (
                            <><Save size={22} /> 페르소나 저장하기</>
                        )}
                    </button>
                    {!isComplete && (
                        <p className="text-center text-xs text-slate-400 font-bold">* 표시된 항목을 모두 입력해주세요</p>
                    )}
                </section>

                {/* Preview */}
                {persona.brandName && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-[2rem] border border-orange-100">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className="text-orange-600" />
                            <span className="text-xs font-black text-orange-600 uppercase tracking-widest">AI 페르소나 미리보기</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            "<span className="text-orange-600">{persona.brandName}</span>"는(은) {persona.industry && `${persona.industry} 업종으로, `}
                            {persona.tone} 어조로 소통하며, {persona.targetAudience && `${persona.targetAudience}를 타겟으로 합니다.`}
                            {persona.description && ` ${persona.description}`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { PERSONA_KEY };
export type { PersonaData as PersonaDataType };
export default PersonaSetup;
