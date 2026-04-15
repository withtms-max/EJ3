
import React, { useState } from 'react';
import { RefreshCw, KeyRound, X, Camera, FileText, User } from 'lucide-react';
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
                    <button onClick={() => onNavigate('HOME')} className="flex flex-col items-start group">
                        <h1 className="text-2xl font-black text-slate-900 tracking-tighter group-hover:text-orange-600 transition-colors">
                            BizCut
                        </h1>
                        <p className="text-[10px] text-slate-500 font-bold tracking-tight">
                            소상공인을 위한 AI 이미지 솔루션
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
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'EDITOR' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <Camera size={14} /> AI 사진
                            </button>
                            <button
                                onClick={() => onNavigate('SNS_CONTENT')}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'SNS_CONTENT' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <FileText size={14} /> SNS 콘텐츠
                            </button>
                            <button
                                onClick={() => onNavigate('PERSONA')}
                                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${currentView === 'PERSONA' ? 'text-orange-600' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <User size={14} /> 내 페르소나
                            </button>
                        </nav>

                        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

                        <button
                            onClick={handleOpenKeyModal}
                            className="px-3 py-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                            API키 설정
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

                        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

                        {/* 구글 로그인 UI */}
                        {!isLoading && (
                            user ? (
                                <div className="flex items-center gap-3 ml-2 group relative">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        {profile?.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div className="hidden sm:block text-left relative top-0.5">
                                            <p className="text-[11px] font-black text-slate-900 leading-none">{profile?.full_name || '사용자'}</p>
                                            <p className="text-[9px] text-slate-500">{user.email?.split('@')[0]}</p>
                                        </div>
                                    </div>
                                    
                                    {/* 드롭다운 (Hover) */}
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden z-50">
                                        <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                                            <p className="text-xs font-bold text-slate-900">{user.email}</p>
                                            {profile?.role === 'admin' && (
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-[9px] rounded-md font-black">관리자 계정</span>
                                            )}
                                        </div>
                                        {profile?.role === 'admin' && (
                                            <button 
                                                onClick={() => onNavigate('ADMIN')}
                                                className="w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 font-bold border-b border-slate-100"
                                            >
                                                관리자 대시보드
                                            </button>
                                        )}
                                        <button 
                                            onClick={handleOpenKeyModal}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 font-medium"
                                        >
                                            내 API 키 관리
                                        </button>
                                        <button 
                                            onClick={signOut}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold border-t border-slate-100"
                                        >
                                            로그아웃
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={signInWithGoogle}
                                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-bold text-xs rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                                    Google 로그인
                                </button>
                            )
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
                        <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                            <KeyRound size={20} className="text-orange-600" /> 마스터 비밀번호 & API 설정
                        </h3>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                            사장님이 알려주신 <strong>마스터 비밀번호 6자리</strong>를 입력해 주세요.
                        </p>
                        <form onSubmit={handleKeySubmit} className="space-y-4">
                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="비밀번호 6자리 또는 AIzaSy..."
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
                        <h4 className="text-xl font-black text-slate-900">BizCut</h4>
                        <p className="text-orange-600 font-black text-[11px] tracking-[0.3em]">AI IMAGE SOLUTION</p>
                    </div>
                    <p className="text-slate-400 font-bold text-sm leading-relaxed italic">
                        "사장님들의 정성을 가장 맛있는 한 컷으로 표현합니다."
                    </p>
                    <div className="flex justify-center gap-8 text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">
                        <span>Professional</span>
                        <span>Local Support</span>
                        <span>Digital Transformation</span>
                    </div>
                    <p className="text-[10px] text-slate-300 py-4">
                        © 2024 BizCut. All rights reserved.
                    </p>
                </div>
            </footer >
        </div >
    );
};

export default Layout;
