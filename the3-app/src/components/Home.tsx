
import React, { useState } from 'react';
import { Zap, Utensils, Smartphone, ArrowRight, KeyRound, X, ExternalLink } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';

interface HomeProps {
    onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
    const { apiKey, setApiKey } = useApiKey();
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [inputKey, setInputKey] = useState("");

    const handleStartClick = () => {
        if (apiKey) {
            onStart();
        } else {
            setShowKeyModal(true);
        }
    };

    const handleKeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim().length > 10) {
            setApiKey(inputKey.trim());
            setShowKeyModal(false);
            onStart();
        } else {
            alert("유효한 API Key를 입력해주세요.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen relative">
            {/* API Key Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowKeyModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 animate-bounce">
                                <KeyRound size={32} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-center text-slate-900 mb-2">Google API Key가 필요해요</h3>
                        <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
                            AI 이미지 생성을 위해 Google AI Studio에서 발급받은 무료 API Key를 입력해주세요. <br />
                            (Key는 브라우저에만 저장되며 서버로 전송되지 않습니다)
                        </p>

                        <form onSubmit={handleKeySubmit} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    value={inputKey}
                                    onChange={(e) => setInputKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg"
                            >
                                입력하고 시작하기
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <a
                                href="https://aistudio.google.com/app/apikey"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-orange-600 transition-colors border-b border-transparent hover:border-orange-600"
                            >
                                <ExternalLink size={12} /> Google API Key 발급받기 (무료)
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32 px-6">
                <div className="absolute inset-0 bg-orange-50/50 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-100 via-transparent to-transparent opacity-70"></div>
                <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-orange-200 shadow-sm text-xs font-black text-orange-600 mb-4 hover:scale-105 transition-transform cursor-default">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        AI Powered Photography Studio
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                        사진 한 장으로 시작되는 <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                            매출 상승의 기적
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        전문 포토그래퍼 없이도, 스튜디오 없이도 <br className="hidden md:block" />
                        <span className="font-bold text-slate-800">단 3초 만에</span> 고객의 시선을 사로잡는 고퀄리티 사진을 완성하세요.
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={handleStartClick}
                            className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all active:scale-95 w-full sm:w-auto overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                무료로 시작하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-600 rounded-2xl font-bold text-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors w-full sm:w-auto">
                            자세히 알아보기
                        </button>
                    </div>

                    <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto opacity-80">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">100+</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Shops</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 border-x border-slate-200">
                            <span className="text-3xl font-black text-slate-900">0.5s</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing Time</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-3xl font-black text-slate-900">4.9/5</span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Rating</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white px-6">
                <div className="max-w-6xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">왜 사장님 만능 사진관일까요?</h2>
                        <p className="text-slate-500 font-medium">복잡한 설정 없이, 클릭 몇 번으로 전문가 수준의 결과물을 만듭니다.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="text-amber-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">즉각적인 퀄리티 향상</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">흐린 사진, 어두운 조명도 AI가 자동으로 분석하여 선명하고 화사하게 보정합니다.</p>
                        </div>
                        <div className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Utensils className="text-orange-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">업종별 맞춤 스타일</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">음식점, 카페, 의류 매장 등 사장님의 업종에 딱 맞는 분위기를 제안합니다.</p>
                        </div>
                        <div className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Smartphone className="text-blue-500" size={32} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-3">모바일 최적화</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">배달앱, 스마트스토어, 인스타그램에 바로 올릴 수 있는 최적의 비율과 해상도를 지원합니다.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24 bg-slate-900 text-white px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500 rounded-full blur-[128px]"></div>
                    <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500 rounded-full blur-[128px]"></div>
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-6 max-w-md">
                            <span className="text-orange-500 font-black tracking-widest text-sm uppercase">Easy Process</span>
                            <h2 className="text-4xl md:text-5xl font-black leading-tight">
                                복잡한 과정은 <br />
                                <span className="text-slate-400">이제 그만.</span>
                            </h2>
                            <p className="text-slate-400 font-medium text-lg">
                                단 3단계면 충분합니다. <br />
                                나머지는 AI에게 맡기세요.
                            </p>
                            <button onClick={handleStartClick} className="mt-8 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-colors">
                                지금 바로 시작하기
                            </button>
                        </div>

                        <div className="grid gap-6 w-full max-w-lg">
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-3xl font-black text-orange-500">01</span>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">업종 선택</h4>
                                    <p className="text-slate-400 text-sm">운영하시는 가게의 종류를 선택하세요.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-3xl font-black text-orange-500">02</span>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">사진 업로드</h4>
                                    <p className="text-slate-400 text-sm">휴대폰으로 찍은 사진을 그대로 올리세요.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <span className="text-3xl font-black text-orange-500">03</span>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">AI 자동 변환</h4>
                                    <p className="text-slate-400 text-sm">원하는 스타일을 고르면 3초 만에 완성!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
