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
    isPinVerified: boolean;
    verifyPin: (pin: string) => boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();
    
    const [apiKey, setApiKeyState] = useState<string | null>(null);
    const [naverClientId, setNaverClientIdState] = useState<string | null>(null);
    const [naverClientSecret, setNaverClientSecretState] = useState<string | null>(null);
    const [isKeysLoaded, setIsKeysLoaded] = useState(false);
    const [isPinVerified, setIsPinVerified] = useState(() => sessionStorage.getItem('the3studio_pin_verified') === 'true');

    // 사용자가 변경되거나 로딩이 끝날 때마다 키를 불러옴 (또는 로컬에서 불러옴)
    useEffect(() => {
        if (isLoading) return;

        const fetchMasterKeysFromFirestore = async () => {
            try {
                // Firestore REST API를 통해 마스터 설정(api_key, pin) 가져오기
                const response = await fetch('https://firestore.googleapis.com/v1/projects/the3-fc45a/databases/(default)/documents/settings/the3cut');
                const data = await response.json();
                
                if (data && data.fields) {
                    const masterApiKey = data.fields.api_key?.stringValue;
                    const masterPin = data.fields.pin?.stringValue;
                    
                    // 마스터 정보를 전역 변수나 상태로 저장 (PIN 체크 용도)
                    if (masterPin) (window as any).the3studio_master_pin = masterPin;

                    // 마스터 키가 있고 개인 키가 없으면 마스터 키를 초기값으로 설정
                    if (masterApiKey && !localStorage.getItem('google_api_key')) {
                        setApiKeyState(masterApiKey);
                    }
                }
            } catch (err) {
                console.error("Failed to sync with Master Dashboard (Firestore):", err);
            }
        };

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
                    setIsPinVerified(true); // 본인 키가 있으면 PIN 통과
                }
                setIsKeysLoaded(true);
            };
            fetchKeysFromDB();
        } else {
            // 비로그인 유저: 마스터 대시보드 연동 시도 후 로컬스토리지 확인
            fetchMasterKeysFromFirestore().finally(() => {
                const stored = localStorage.getItem('google_api_key');
                if (stored) {
                  setApiKeyState(stored);
                  setIsPinVerified(true); // 개인 키 수동 입력자도 PIN 통과
                }

                const storedNaverId = localStorage.getItem('naver_client_id');
                if (storedNaverId) setNaverClientIdState(storedNaverId);

                const storedNaverSecret = localStorage.getItem('naver_client_secret');
                if (storedNaverSecret) setNaverClientSecretState(storedNaverSecret);
                
                setIsKeysLoaded(true);
            });
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

    const verifyPin = (pin: string) => {
        // [SYNC] 어드민 대시보드에서 가져온 마스터 PIN 또는 상수의 키들 확인
        const masterPin = (window as any).the3studio_master_pin || "941228"; 
        if (pin === masterPin || MASTER_KEYS[pin]) {
            setIsPinVerified(true);
            sessionStorage.setItem('the3studio_pin_verified', 'true');
            return true;
        }
        return false;
    };

    return (
        <ApiKeyContext.Provider value={{
            apiKey, setApiKey, removeApiKey,
            naverClientId, setNaverClientId,
            naverClientSecret, setNaverClientSecret,
            isKeysLoaded,
            isPinVerified,
            verifyPin
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
