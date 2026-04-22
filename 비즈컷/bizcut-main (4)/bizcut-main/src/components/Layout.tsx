
import React, { useState } from 'react';
import { RefreshCw, LayoutGrid, Home as HomeIcon, KeyRound, X } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';

interface LayoutProps {
    children: React.ReactNode;
    currentView: 'HOME' | 'EDITOR';
    onNavigate: (view: 'HOME' | 'EDITOR') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
    const { setApiKey, apiKey } = useApiKey();
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [inputKey, setInputKey] = useState("");

    const handleOpenKeyModal = () => {
        setInputKey(apiKey || "");
        setShowKeyModal(true);
    };

    const handleKeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim().length > 0) {
            setApiKey(inputKey.trim());
            setShowKeyModal(false);
            window.location.reload(); // Reload to ensure clean state with new key
        }
    };

    return (
        <div className="min-h-screen flex flex-col selection:bg-orange-200 bg-[#FFF9F2] text-slate-900 font-sans relative">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => onNavigate('HOME')} className="flex flex-col items-start group">
                        <h1 className="text-lg font-black text-slate-900 tracking-tighter group-hover:text-orange-600 transition-colors">
                            성남시상권활성화재단
                        </h1>
                        <p className="text-[10px] text-orange-600 font-black tracking-widest uppercase">
                            FOOD PRO MASTER AI
                        </p>
                    </button>

                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-6 mr-6 overflow-hidden">
                            <button
                                onClick={() => onNavigate('HOME')}
                                className={`text-sm font-bold transition-colors ${currentView === 'HOME' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                홈
                            </button>
                            <button
                                onClick={() => onNavigate('EDITOR')}
                                className={`text-sm font-bold transition-colors ${currentView === 'EDITOR' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                AI 스튜디오
                            </button>
                        </nav>

                        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

                        <button
                            onClick={handleOpenKeyModal}
                            className="px-3 py-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                            API Key 변경
                        </button>

                        {currentView === 'EDITOR' && (
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-bold text-white bg-slate-900 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
                            >
                                <RefreshCw size={12} />
                                <span className="hidden sm:inline">새로고침</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Key Change Modal */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowKeyModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                            <KeyRound size={20} className="text-orange-600" /> API Key 변경
                        </h3>
                        <form onSubmit={handleKeySubmit} className="space-y-4">
                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="새로운 API Key 입력"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-500 transition-all"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md"
                            >
                                변경하고 새로고침
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main className="flex-1 w-full relative">
                {children}
            </main>

            <footer className="w-full py-16 px-6 text-center border-t border-slate-100 bg-white">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex flex-col items-center gap-2">
                        <h4 className="text-xl font-black text-slate-900">성남시상권활성화재단</h4>
                        <p className="text-orange-600 font-black text-[11px] tracking-[0.3em]">FOOD PRO MASTER AI STUDIO</p>
                    </div>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed italic">
                        "성남시 사장님들의 정성을 가장 맛있는 한 컷으로 표현합니다."
                    </p>
                    <div className="flex justify-center gap-8 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                        <span>Professional</span>
                        <span>Local Support</span>
                        <span>Digital Transformation</span>
                    </div>
                    <p className="text-[10px] text-slate-300 py-4">
                        © 2024 Seongnam Commercial Area Revitalization Foundation. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
