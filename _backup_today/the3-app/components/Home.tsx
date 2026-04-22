import React, { useState } from 'react';
import { ExternalLink, X, KeyRound, ArrowRight, Camera, PenBox, Smartphone, FileText, User } from 'lucide-react';
import { useApiKey } from '../context/ApiKeyContext';
import { useAuth } from '../context/AuthContext';
import { MASTER_KEYS } from '../constants';
import { ViewState } from '../App';
import { ContentTab } from './SnsContentCreator';

interface HomeProps {
  onStart: () => void;
  onNavigate: (view: ViewState, tab?: ContentTab) => void;
}

const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  const { apiKey, setApiKey, naverClientId, setNaverClientId, naverClientSecret, setNaverClientSecret } = useApiKey();
  const { user, signInWithGoogle } = useAuth();
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [inputNaverId, setInputNaverId] = useState("5MYVJvLQqvw4WvsKshA3");
  const [inputNaverSecret, setInputNaverSecret] = useState("PZ6ANaye9j");

  const handleStartClick = () => {
    onStart();
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = inputKey.trim();

    if (MASTER_KEYS[trimmedKey]) {
      localStorage.removeItem('google_api_key');
      localStorage.removeItem('naver_client_id');
      localStorage.removeItem('naver_client_secret');
      
      setApiKey(MASTER_KEYS[trimmedKey]);
      if (inputNaverId.trim()) setNaverClientId(inputNaverId.trim());
      if (inputNaverSecret.trim()) setNaverClientSecret(inputNaverSecret.trim());
      setShowKeyModal(false);
      onStart();
      alert("✅ 인증 성공! 최신 API 키(2.5-flash 호환)가 적용되었습니다.");
    } else if (trimmedKey.length > 10) {
      localStorage.removeItem('google_api_key');
      setApiKey(trimmedKey);
      if (inputNaverId.trim()) setNaverClientId(inputNaverId.trim());
      if (inputNaverSecret.trim()) setNaverClientSecret(inputNaverSecret.trim());
      setShowKeyModal(false);
      onStart();
    } else {
      alert("구글 비밀번호 6자리 또는 유효한 API Key를 입력해주세요.");
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] relative bg-[#FFFBF8] items-center justify-center">
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
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-[#C8102E] animate-bounce">
                <KeyRound size={32} />
              </div>
            </div>
 
            <h3 className="text-2xl font-black text-center text-slate-900 mb-2">보안 설정 (PIN)</h3>
            <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
              THE3 x 비즈컷 프라이빗 솔루션<br />
              <strong>전용 6자리 접속 PIN</strong>을 입력하세요.
            </p>
 
            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-extrabold text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#C8102E] focus:ring-2 focus:ring-red-100 transition-all"
                  autoFocus
                />
              </div>
 
              <button
                type="submit"
                className="w-full py-4 bg-[#C8102E] text-white rounded-xl font-extrabold text-[16px] hover:bg-red-800 active:scale-[0.98] transition-all shadow-lg mt-6"
              >
                비즈컷 엔진 가동하기
              </button>
              
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="w-full py-4 bg-transparent border border-slate-200 text-slate-500 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-3 mt-2"
              >
                나중에 할래요 (취소)
              </button>
            </form>
          </div>
        </div>
      )}
 
      {/* Hero Section */}
      <section className="w-full px-4 flex flex-col items-center justify-center text-center pt-24 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center justify-center border border-red-200 bg-red-50 rounded-full px-4 py-1.5 mb-8 text-[13px] font-extrabold text-[#C8102E]">
          <div className="w-2 h-2 rounded-full bg-[#C8102E] mr-2 animate-pulse"></div>
          THE3 x BizCut Private Solution
        </div>
 
        <h1 className="text-[40px] md:text-[56px] font-black text-slate-900 leading-[1.25] tracking-tight mb-8" style={{ fontFamily: "'Pretendard', sans-serif" }}>
          사진 한 장으로 시작되는<br />
          <span className="text-[#C8102E]">비즈컷의 압도적 퀄리티</span>
        </h1>
 
        <p className="text-[17px] text-[#6b7280] font-medium leading-[1.7] mb-14 max-w-[600px] mx-auto">
          전문 포토그래퍼 없이도, 비싼 스튜디오 빌릴 필요 없이<br />
          단 3초 만에 고객의 시선을 사로잡는 고퀄리티 사진을 완성하세요.
        </p>
 
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
          <button
            onClick={handleStartClick}
            className="group flex flex-row items-center justify-center gap-2 bg-[#C8102E] text-white px-8 py-4 rounded-xl font-extrabold text-[17px] w-full sm:w-auto shadow-xl hover:scale-105 hover:shadow-red-500/30 transition-all duration-300"
          >
            <Camera size={20} /> AI 사진 보정하기 &rarr;
          </button>
          
          <button
            onClick={() => onNavigate('SNS_CONTENT')}
            className="flex flex-row items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-extrabold text-[17px] w-full sm:w-auto hover:bg-slate-50 hover:-translate-y-1 hover:border-red-500/30 transition-all duration-300"
          >
            <PenBox size={20} /> SNS 콘텐츠 만들기
          </button>
        </div>
      </section>


    </div>
  );
};

export default Home;
