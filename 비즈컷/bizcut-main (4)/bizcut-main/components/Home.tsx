
import React, { useState } from 'react';
import { Zap, Utensils, Smartphone, ArrowRight, KeyRound, X, ExternalLink, FileText, User, Camera, Image as ImageIcon } from 'lucide-react';
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
    if (apiKey || user) {
      onStart();
    } else {
      setShowKeyModal(true);
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = inputKey.trim();

    if (MASTER_KEYS[trimmedKey]) {
      // [보안/캐시] 마스터 키 입력 시 기존 로컬 캐시를 명시적으로 클리어하여 옛날 키 간섭 방지
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

            <h3 className="text-2xl font-black text-center text-slate-900 mb-2">마스터 비밀번호 & API 설정</h3>
            <p className="text-center text-slate-500 text-sm mb-8 leading-relaxed">
              사장님이 알려주신 <strong>마스터 비밀번호 6자리</strong>를 입력해 주세요. <br />
              (본인의 API Key를 직접 사용하실 수도 있습니다)
            </p>

            <form onSubmit={handleKeySubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">기본 키 (필수)</label>
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="비밀번호 6자리 또는 AIzaSy..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 mt-2">
                <div className="flex items-center justify-between px-1">
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">네이버 API 키 (블로그 전용 / 선택)</label>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">실시간 자료조사</span>
                </div>
                <input
                  type="password"
                  value={inputNaverId}
                  onChange={(e) => setInputNaverId(e.target.value)}
                  placeholder="Client ID (예: 5MYVJv...)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm"
                />
                <input
                  type="password"
                  value={inputNaverSecret}
                  onChange={(e) => setInputNaverSecret(e.target.value)}
                  placeholder="Client Secret"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all text-sm mt-2"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg mt-6"
              >
                입력하고 시작하기
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-slate-400 font-bold">또는 소셜 로그인</span>
                </div>
              </div>

              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                구글 계정으로 간편 시작
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
              className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all active:scale-[0.98] w-full sm:w-auto overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {user ? '🚀 바로 시작하기' : '📸 AI 사진 보정하기'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => onNavigate('SNS_CONTENT', 'caption')}
              className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl font-black text-lg shadow-lg hover:border-orange-200 hover:bg-orange-50 transition-all active:scale-95 w-full sm:w-auto"
            >
              📝 SNS 콘텐츠 만들기
            </button>
          </div>


        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">왜 비즈컷(BizCut)일까요?</h2>
            <p className="text-slate-500 font-medium">사진 보정부터 SNS 콘텐츠 생성까지, 소상공인에게 필요한 모든 것.</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="group p-7 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="text-blue-500" size={28} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">모바일 최적화</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">배달앱, 인스타그램에 바로 올릴 수 있는 최적 결과물.</p>
            </div>
            <button
              onClick={() => onNavigate('EDITOR')}
              className="group p-7 rounded-[2rem] bg-blue-50 border-2 border-blue-100 hover:border-blue-400 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-sm mb-5 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
                <Camera className="text-blue-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">AI 사진 보정</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">업종별 맞춤형 전문가 스타일로 사진 퀄리티를 높입니다.</p>
            </button>
            <button
              onClick={() => onNavigate('SNS_CONTENT', 'cardnews')}
              className="group p-7 rounded-[2rem] bg-orange-50 border-2 border-orange-100 hover:border-orange-400 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shadow-sm mb-5 group-hover:bg-orange-600 group-hover:scale-110 transition-all duration-300">
                <FileText className="text-orange-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">SNS 콘텐츠 생성 🆕</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">캡션, 카드뉴스, 블로그 초안을 AI가 즉시 작성합니다.</p>
            </button>
            <button
              onClick={() => onNavigate('PERSONA')}
              className="group p-7 rounded-[2rem] bg-amber-50 border-2 border-amber-100 hover:border-amber-400 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center shadow-sm mb-5 group-hover:bg-amber-500 group-hover:scale-110 transition-all duration-300">
                <User className="text-amber-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-base font-black text-slate-900 mb-2">AI 페르소나 🆕</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">내 브랜드 톤을 학습해 일관된 콘텐츠 목소리를 유지합니다.</p>
            </button>
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
