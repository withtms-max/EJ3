
import React, { useState } from 'react';
import { RefreshCw, KeyRound, X, Camera, FileText, User, Home, Lock } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import { MASTER_KEYS } from '../constants';
import { ViewState } from '../App';

interface LayoutProps {
    children: React.ReactNode;
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
    const { setApiKey, apiKey, isKeysLoaded } = useApiKey();
    const { user, profile, signInWithGoogle, signOut, isLoading } = useAuth();
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [inputKey, setInputKey] = useState("");

    const handleOpenKeyModal = () => {
        setInputKey(apiKey || "");
        setShowKeyModal(true);
    };

    const handleKeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedKey = inputKey.trim();
        if (trimmedKey.length > 0) {
            if (MASTER_KEYS[trimmedKey]) {
                setApiKey(MASTER_KEYS[trimmedKey]);
                alert("✅ 인증 성공! 전용 API 키가 적용되었습니다.");
            } else {
                setApiKey(trimmedKey);
            }
            setShowKeyModal(false);
            window.location.reload();
        }
    };

    if (!isKeysLoaded) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FFF9F2]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div></div>;
    }

    return (
        <div className="min-h-screen flex flex-col selection:bg-orange-200 bg-[#FFF9F2] text-slate-900 font-sans relative">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => onNavigate('HOME')} className="flex flex-col items-start group text-left pt-1">
                        <h1 className="text-[22px] md:text-[25px] font-black text-slate-900 tracking-tighter transition-colors uppercase leading-none mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            THE <span className="text-[#C8102E]">3</span> STUDIO
                        </h1>
                        <p className="text-[10px] md:text-[11px] text-slate-500 font-bold tracking-tight">
                            비즈컷 기반 THE3 전용 AI 솔루션
                        </p>
                    </button>

                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-6 mr-4 overflow-hidden">
                            <a
                                href="../index.html"
                                className={`flex items-center gap-1.5 text-sm font-black transition-colors text-slate-900 hover:text-[#C8102E]`}
                            >
                                <span className="text-[#C8102E]"><Home size={15} /></span> 사이트 메인
                            </a>
                            <button
                                onClick={() => onNavigate('HOME')}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'HOME' ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {currentView === 'HOME' ? <span className="text-[#C8102E]"><RefreshCw size={15} /></span> : <RefreshCw size={15} />}
                                스튜디오 홈
                            </button>
                            <button
                                onClick={() => onNavigate('EDITOR')}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'EDITOR' ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {currentView === 'EDITOR' ? <span className="text-[#C8102E]"><Camera size={15} /></span> : <Camera size={15} />}
                                AI 사진
                            </button>
                            <button
                                onClick={() => onNavigate('SNS_CONTENT')}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'SNS_CONTENT' ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {currentView === 'SNS_CONTENT' ? <span className="text-[#C8102E]"><FileText size={15} /></span> : <FileText size={15} />}
                                SNS 콘텐츠
                            </button>
                            <button
                                onClick={() => onNavigate('PERSONA')}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'PERSONA' ? 'text-[#C8102E]' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {currentView === 'PERSONA' ? <span className="text-[#C8102E]"><User size={15} /></span> : <User size={15} />}
                                내 페르소나
                            </button>
                        </nav>

                        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

                        <button
                            onClick={handleOpenKeyModal}
                            className="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-slate-400 bg-slate-50 rounded-full border border-slate-200 hover:bg-white hover:text-[#C8102E] hover:border-[#C8102E]/30 hover:shadow-sm transition-all duration-300"
                        >
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
                                <Lock size={10} className="text-slate-400 group-hover:text-orange-600" />
                            </div>
                            <span className="hidden sm:inline">보안 설정</span>
                        </button>

                        <button
                            onClick={() => window.location.href = '../index.html'}
                            className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            {/* Key Change Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowKeyModal(false)}
                            className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 animate-bounce">
                                <KeyRound size={32} />
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-center text-slate-900 mb-2">보안 설정 (PIN)</h3>
                        <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed font-bold">
                            스튜디오 마스터가 발급한<br />
                            <strong>6자리 접속 PIN</strong>을 입력하세요.
                        </p>

                        <form onSubmit={handleKeySubmit} className="space-y-4">
                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-extrabold text-center text-xl tracking-[0.1em] focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all shadow-inner"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-lg hover:bg-orange-700 active:scale-[0.98] transition-all shadow-xl shadow-orange-500/20 mt-4 flex items-center justify-center gap-2"
                            >
                                마스터 키 적용하기
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowKeyModal(false)}
                                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
                            >
                                돌아가기
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full relative">
                {children}
            </main>

        </div >
    );
};

export default Layout;
