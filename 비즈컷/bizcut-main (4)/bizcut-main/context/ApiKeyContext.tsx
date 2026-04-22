import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string) => void;
    removeApiKey: () => void;
    naverClientId: string | null;
    setNaverClientId: (key: string) => void;
    naverClientSecret: string | null;
    setNaverClientSecret: (key: string) => void;
    isKeysLoaded: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    const [apiKey, setApiKeyState] = useState<string | null>(null);
    const [naverClientId, setNaverClientIdState] = useState<string | null>(null);
    const [naverClientSecret, setNaverClientSecretState] = useState<string | null>(null);
    const [isKeysLoaded, setIsKeysLoaded] = useState(false);

    // 사용자가 변경되거나 로딩이 끝날 때마다 키를 불러옴 (또는 로컬에서 불러옴)
    useEffect(() => {
        if (isLoading) return;

        if (user) {
            // 로그인한 유저: Supabase DB에서 가져옴
            const fetchKeysFromDB = async () => {
                const { data, error } = await supabase
                    .from('user_keys')
                    .select('gemini_key, naver_client_id, naver_client_secret')
                    .eq('user_id', user.id)
                    .single();
                
                if (!error && data) {
                    setApiKeyState(data.gemini_key);
                    setNaverClientIdState(data.naver_client_id);
                    setNaverClientSecretState(data.naver_client_secret);
                }
                setIsKeysLoaded(true);
            };
            fetchKeysFromDB();
        } else {
            // 비로그인 유저: 기존처럼 LocalStorage 유지 (체험판용)
            const stored = localStorage.getItem('google_api_key');
            if (stored) setApiKeyState(stored);

            const storedNaverId = localStorage.getItem('naver_client_id');
            if (storedNaverId) setNaverClientIdState(storedNaverId);

            const storedNaverSecret = localStorage.getItem('naver_client_secret');
            if (storedNaverSecret) setNaverClientSecretState(storedNaverSecret);
            
            setIsKeysLoaded(true);
        }
    }, [user, isLoading]);

    const updateDBKey = async (column: string, value: string | null) => {
        if (!user) return;
        await supabase
            .from('user_keys')
            .update({ [column]: value, updated_at: new Date().toISOString() })
            .eq('user_id', user.id);
    };

    const setApiKey = (key: string) => {
        setApiKeyState(key);
        if (user) updateDBKey('gemini_key', key);
        else localStorage.setItem('google_api_key', key);
    };

    const removeApiKey = () => {
        setApiKeyState(null);
        if (user) updateDBKey('gemini_key', null);
        else localStorage.removeItem('google_api_key');
    };

    const setNaverClientId = (id: string) => {
        setNaverClientIdState(id);
        if (user) updateDBKey('naver_client_id', id);
        else localStorage.setItem('naver_client_id', id);
    };

    const setNaverClientSecret = (secret: string) => {
        setNaverClientSecretState(secret);
        if (user) updateDBKey('naver_client_secret', secret);
        else localStorage.setItem('naver_client_secret', secret);
    };

    return (
        <ApiKeyContext.Provider value={{
            apiKey, setApiKey, removeApiKey,
            naverClientId, setNaverClientId,
            naverClientSecret, setNaverClientSecret,
            isKeysLoaded
        }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
