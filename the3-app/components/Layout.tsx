
import React, { useState, useEffect } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import { MASTER_KEYS } from '../constants';
import { ViewState } from '../App';
import { Lock, Settings, RefreshCw, X } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    currentView: ViewState;
    onNavigate: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
    const { setApiKey, apiKey } = useApiKey();
    const { user, profile, signInWithGoogle, signOut } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [inputKey, setInputKey] = useState("");

    const [isIframe, setIsIframe] = useState(false);

    useEffect(() => {
        setIsIframe(window.self !== window.top);
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollSection = (id: string) => {
        if (currentView !== 'HOME') {
            onNavigate('HOME');
            setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 100);
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleKeySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputKey.trim()) {
            if (MASTER_KEYS[inputKey.trim()]) setApiKey(MASTER_KEYS[inputKey.trim()]);
            else setApiKey(inputKey.trim());
            setShowKeyModal(false);
            window.location.reload();
        }
    };

    return (
        <div className="layout-8080-replica min-h-screen flex flex-col bg-[#F4F6F8] text-slate-900">
            <style dangerouslySetInnerHTML={{ __html: `
                .active-nav {
                    color: #C8102E !important;
                    font-weight: 900 !important;
                    position: relative;
                }
                .active-nav::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background-color: #C8102E;
                }
                nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; transition: .3s; background: white; border-bottom: 1px solid rgba(0,0,0,0.05); }
                nav.scrolled { padding: 1rem 3rem; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
                .nav-logo { font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 900; letter-spacing: -.05em; text-transform: uppercase; color: #C8102E; cursor: pointer; }
                .nav-logo span { color: #111; }
                .nav-links { display: flex; gap: 2.5rem; list-style: none; align-items: center; margin: 0; padding: 0; }
                .nav-links button { color: #444; font-weight: 700; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.05em; transition: .3s; background: none; border: none; cursor: pointer; }
                .nav-links button:hover { color: #C8102E; }
                .nav-cta { background: #C8102E; color: white !important; padding: 0.8rem 1.8rem; border-radius: 100px; font-weight: 900; box-shadow: 0 10px 20px rgba(200, 16, 46, 0.2); transition: .3s; border: none; cursor: pointer; }
                .nav-cta:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(200, 16, 46, 0.3); }
                
                @media (max-width: 768px) {
                    nav { padding: 1.2rem 1.5rem; }
                    .nav-links { display: none; }
                }
            `}} />

            {/* Navigation removed to prevent overlap with host header as per user request */}

            <main className="flex-1">
                {children}
            </main>

            {/* Key Modal - 8080 Style */}
            {showKeyModal && (
                <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white border border-black/5 rounded-[2rem] p-10 max-w-sm w-full relative shadow-2xl">
                        <button onClick={() => setShowKeyModal(false)} className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"><X size={20} /></button>
                        <h3 className="text-xl font-black text-center mb-6 text-slate-900">SECURE ACCESS</h3>
                        <form onSubmit={handleKeySubmit} className="space-y-4">
                            <input
                                type="password"
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="ENTER PIN"
                                maxLength={6}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-black text-center text-3xl tracking-[0.3em] outline-none focus:border-[#C8102E] transition-all"
                                autoFocus
                            />
                            <button type="submit" className="w-full py-4 bg-[#C8102E] text-white rounded-xl font-black shadow-lg">ACTIVATE</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
