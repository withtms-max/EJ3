import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Users, AlertCircle, RefreshCw, Key } from 'lucide-react';

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
    const [users, setUsers] = useState<UserData[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        setLoadingData(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || '유저 데이터를 불러오는 데 실패했습니다.');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchUsers();
        }
    }, [profile]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (profile?.role !== 'admin') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4 opacity-80" />
                <h2 className="text-2xl font-black text-slate-900 mb-2">접근 권한이 없습니다</h2>
                <p className="text-slate-500">이 페이지는 최고 관리자만 접근할 수 있습니다.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-500">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Key className="w-8 h-8 text-orange-600" />
                        관리자 대시보드
                    </h2>
                    <p className="text-slate-500 mt-2">서비스 가입 현황 및 유저 목록을 관리합니다.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    disabled={loadingData}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 font-bold text-sm rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loadingData ? "animate-spin" : ""} />
                    새로고침
                </button>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 font-bold">총 가입자 수</p>
                        <h3 className="text-3xl font-black text-slate-900">{users.length} <span className="text-base font-normal text-slate-400">명</span></h3>
                    </div>
                </div>
            </div>

            {/* 유저 리스트 테이블 */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">최근 가입 유저 목록</h3>
                </div>
                
                {error && (
                    <div className="p-6 text-center text-red-600 bg-red-50">
                        <p>{error}</p>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold border-b border-slate-100">프로필</th>
                                <th className="p-4 font-bold border-b border-slate-100">이메일</th>
                                <th className="p-4 font-bold border-b border-slate-100">이름</th>
                                <th className="p-4 font-bold border-b border-slate-100">가입일시</th>
                                <th className="p-4 font-bold border-b border-slate-100">권한</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loadingData ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        데이터를 불러오는 중입니다...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        아직 가입한 유저가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                    {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-900">{user.email}</td>
                                        <td className="p-4 text-sm text-slate-500">{user.full_name || '-'}</td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(user.created_at).toLocaleString('ko-KR')}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                                                user.role === 'admin' 
                                                ? 'bg-orange-100 text-orange-700' 
                                                : 'bg-slate-100 text-slate-600'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
