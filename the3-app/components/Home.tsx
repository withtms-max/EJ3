
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

interface HomeProps {
  onStart: () => void;
  onNavigate: (view: any) => void;
}

const Home: React.FC<HomeProps> = ({ onStart, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [team, setTeam] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamSnap = await getDocs(collection(db, 'team'));
        setTeam(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((t: any) => t.is_active !== 0));

        const journeySnap = await getDocs(query(collection(db, 'journey')));
        setJourney(journeySnap.docs.map(d => ({ id: d.id, ...d.data() })).filter((j: any) => j.is_active !== 0));

        const heroSnap = await getDoc(doc(db, 'settings', 'hero'));
        if (heroSnap.exists()) setHeroData(heroSnap.data());
      } catch (err) {
        console.error(err);
      }
      setIsVisible(true);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-[#C8102E]">
      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.03]">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#C8102E] blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#C8102E] blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8102E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8102E]"></span>
            </span>
            <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">The Premier AI Solution</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
              사진 한 장으로 시작되는<br />
              <span className="text-[#C8102E]">매출 상승의 기적</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              전문 포토그래퍼 없이도, 스튜디오 없이도<br />
              <span className="font-bold text-slate-800">THE 3 STUDIO</span>와 함께 명품 사진을 완성하세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
            {/* AI Photo Editor Button */}
            <button
              onClick={() => onStart()}
              className="group relative w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-[#C8102E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center gap-3">
                <span className="text-2xl">📸</span>
                <span>AI 사진 보정하기</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>

            {/* SNS Marketing Button */}
            <button
              onClick={() => onNavigate('SNS_CONTENT', 'cardnews')}
              className="group w-full sm:w-auto px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-[2rem] font-black text-xl transition-all hover:border-[#C8102E] hover:text-[#C8102E] hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📝</span>
              <span>SNS 콘텐츠 만들기</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
