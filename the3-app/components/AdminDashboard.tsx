
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { 
  Users, AlertCircle, RefreshCw, Key, Layout, Settings, 
  Clapperboard, Users2, Rocket, MessageSquare, Quote, Save, 
  Trash2, Plus, ShieldCheck, Database
} from 'lucide-react';

type AdminTab = 'USERS' | 'AI_CONFIG' | 'HOME_EDITOR' | 'PORTFOLIO';

interface UserData {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
    created_at: string;
}

const AdminDashboard: React.FC = () => {
    const { profile, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('USERS');
    const [users, setUsers] = useState<UserData[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [aiConfig, setAiConfig] = useState({ api_key: '', pin: '' });
    const [heroData, setHeroData] = useState({ subtitle: '', main_copy: '', accent_copy: '', description: '' });
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoadingData(true);
        try {
            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchAiConfig = async () => {
        setLoadingData(true);
        try {
            const snap = await getDoc(doc(db, 'settings', 'the3cut'));
            if (snap.exists()) setAiConfig(snap.data() as any);
        } catch (err) {
            console.error('Error fetching AI config:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const fetchHeroData = async () => {
        setLoadingData(true);
        try {
            const snap = await getDoc(doc(db, 'settings', 'hero'));
            if (snap.exists()) setHeroData(snap.data() as any);
        } catch (err) {
            console.error('Error fetching Hero:', err);
        } finally {
            setLoadingData(false);
        }
    };

    const saveAiConfig = async () => {
        try {
            await setDoc(doc(db, 'settings', 'the3cut'), aiConfig);
            alert('✅ AI 보안 설정이 서버에 안전하게 저장되었습니다!');
        } catch (err) {
            alert('❌ 저장 실패!');
        }
    };

    const saveHeroData = async () => {
        try {
            await setDoc(doc(db, 'settings', 'hero'), heroData);
            alert('✅ 홈 사이트 정보가 업데이트되었습니다!');
        } catch (err) {
            alert('❌ 저장 실패!');
        }
    };

    useEffect(() => {
        if (profile?.role === 'admin') {
            if (activeTab === 'USERS') fetchUsers();
            if (activeTab === 'AI_CONFIG') fetchAiConfig();
            if (activeTab === 'HOME_EDITOR') fetchHeroData();
        }
    }, [profile, activeTab]);

    if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[60vh]"><RefreshCw className="animate-spin text-[#C8102E]" /></div>;

    if (profile?.role !== 'admin') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <ShieldCheck className="w-16 h-16 text-red-500 mb-4 opacity-80" />
                <h2 className="text-2xl font-black text-slate-900 mb-2">접근 권한이 없습니다</h2>
                <p className="text-slate-500">Master Level 이상의 권한이 필요한 구역입니다.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="p-8 border-b border-white/5">
                    <h2 className="text-xl font-black tracking-tighter flex items-center gap-2">
                        <Database className="text-[#C8102E]" />
                        MASTER PANEL
                    </h2>
                </div>
                <nav className="p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('USERS')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'USERS' ? 'bg-[#C8102E] text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Users size={18} /> 가입자 관리
                    </button>
                    <button 
                        onClick={() => setActiveTab('AI_CONFIG')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'AI_CONFIG' ? 'bg-[#C8102E] text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Key size={18} /> THE3컷 보안/인증
                    </button>
                    <button 
                        onClick={() => setActiveTab('HOME_EDITOR')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'HOME_EDITOR' ? 'bg-[#C8102E] text-white' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Layout size={18} /> 홈 사이트 마스터
                    </button>
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    {/* Tab 1: AI Config (Most Important) */}
                    {activeTab === 'AI_CONFIG' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500">
                           <div className="mb-10">
                                <h1 className="text-3xl font-black text-slate-900 mb-2">THE3 컷 AI 보안 설정</h1>
                                <p className="text-slate-500 font-medium">스튜디오 접속용 PIN과 핵심 API 키를 관리합니다.</p>
                           </div>

                           <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
                                <div className="grid grid-cols-1 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black text-[#C8102E] uppercase tracking-widest">Master API Key (Gemini)</label>
                                        <input 
                                            type="password"
                                            value={aiConfig.api_key}
                                            onChange={(e) => setAiConfig({...aiConfig, api_key: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold focus:border-[#C8102E] outline-none"
                                            placeholder="AIzaSy..."
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black text-[#C8102E] uppercase tracking-widest">Client Access PIN (6 Digits)</label>
                                        <input 
                                            type="text"
                                            maxLength={6}
                                            value={aiConfig.pin}
                                            onChange={(e) => setAiConfig({...aiConfig, pin: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-6 font-black text-3xl text-center tracking-[0.5em] focus:border-[#C8102E] outline-none"
                                            placeholder="000000"
                                        />
                                        <p className="text-slate-400 text-xs font-bold text-center italic">고객이 스튜디오에 접속할 때 사용하는 6자리 숫자입니다.</p>
                                    </div>

                                    <button 
                                        onClick={saveAiConfig}
                                        className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-lg"
                                    >
                                        <Save size={20} /> 설정값 서버에 영구 저장
                                    </button>
                                </div>
                           </div>
                        </div>
                    )}

                    {/* Tab 2: Home Editor */}
                    {activeTab === 'HOME_EDITOR' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500">
                           <div className="mb-10">
                                <h1 className="text-3xl font-black text-slate-900 mb-2">홈 페이지 라이브 에디터</h1>
                                <p className="text-slate-500 font-medium">8080번 본진과 3000번 리액트에 공통으로 반영되는 문구 수정</p>
                           </div>

                           <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Hero Subtitle</label>
                                    <input 
                                        value={heroData.subtitle}
                                        onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold"
                                        placeholder="The Premier Creative Agency"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Main Copy (White)</label>
                                        <input 
                                            value={heroData.main_copy}
                                            onChange={(e) => setHeroData({...heroData, main_copy: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold"
                                            placeholder="장사도 바쁜데,"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[12px] font-black text-[#C8102E] uppercase tracking-widest">Accent Copy (Red)</label>
                                        <input 
                                            value={heroData.accent_copy}
                                            onChange={(e) => setHeroData({...heroData, accent_copy: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold border-[#C8102E]/20"
                                            placeholder="콘텐츠까지 고민하시나요?"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Main Description</label>
                                    <textarea 
                                        rows={4}
                                        value={heroData.description}
                                        onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold leading-relaxed"
                                        placeholder="매출 상승은 콘텐츠가 결정합니다..."
                                    />
                                </div>

                                <button 
                                    onClick={saveHeroData}
                                    className="flex items-center justify-center gap-2 w-full bg-[#C8102E] text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-lg"
                                >
                                    <Save size={20} /> 수정사항 즉시 반영하기
                                </button>
                           </div>
                        </div>
                    )}

                    {/* Tab 3: Users (Legacy) */}
                    {activeTab === 'USERS' && (
                        <div className="animate-in slide-in-from-bottom-5 duration-500">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-2">가입자 통합 관리</h1>
                                    <p className="text-slate-500 font-medium">서비스 가입 현황 및 유저 목록입니다.</p>
                                </div>
                                <button
                                    onClick={fetchUsers}
                                    className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 transition-all"
                                >
                                    <RefreshCw className={loadingData ? "animate-spin" : ""} size={20} />
                                </button>
                            </div>

                            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            <th className="px-8 py-6">프로필</th>
                                            <th className="px-8 py-6">계정 정보</th>
                                            <th className="px-8 py-6">권한 레벨</th>
                                            <th className="px-8 py-6">가입일</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {users.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                                        {u.avatar_url ? <img src={u.avatar_url} alt="av" /> : <Users size={18} className="text-slate-300" />}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="font-extrabold text-slate-900">{u.full_name || '익명 마스터'}</div>
                                                    <div className="text-xs text-slate-400 font-bold tracking-tight">{u.email}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-xs text-slate-400 font-bold">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
