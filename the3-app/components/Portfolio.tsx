
import React, { useState } from 'react';
import { Camera, ExternalLink, Filter, Grid, List, Search, X } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  client: string;
  imageUrl: string;
  description: string;
}

const SAMPLE_DATA: PortfolioItem[] = [
  {
    id: '1',
    title: '삼성 비스포크 라이프스타일 촬영',
    category: 'Commercial',
    client: 'SAMSUNG',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15020c0a66d?q=80&w=2070&auto=format&fit=crop',
    description: '고급스러운 주방 환경에서의 비스포크 가전 리터칭 및 합성 작업.'
  },
  {
    id: '2',
    title: '무신사 스탠다드 SS 룩북',
    category: 'Fashion',
    client: 'MUSINSA',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop',
    description: '깔끔한 톤앤매너의 패션 룩북 보정 및 컬러 그레이딩.'
  },
  {
    id: '3',
    title: '네이버 플레이스 맛집 연출',
    category: 'Food',
    client: 'Local Partners',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    description: '음식의 질감을 극대화한 식감 보정 및 배달 앱 최적화 이미지.'
  },
  {
    id: '4',
    title: '현대 자동차 아이오닉 인테리어',
    category: 'Interior',
    client: 'HYUNDAI',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e661876a43e?q=80&w=2070&auto=format&fit=crop',
    description: '자동차 내부의 소재감을 살린 고해상도 리터칭 작업.'
  },
  {
    id: '5',
    title: '카페 감성 브랜딩 사진',
    category: 'SNS',
    client: 'Independent Cafe',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop',
    description: '인스타그램 피드용 감성 필터 적용 및 구도 재구성.'
  },
  {
    id: '6',
    title: 'LG 톤프리 프로덕트 샷',
    category: 'Product',
    client: 'LG',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop',
    description: '제품의 광택과 질감을 강조한 초정밀 누끼 및 보정.'
  }
];

const CATEGORIES = ['All', 'Commercial', 'Fashion', 'Food', 'Interior', 'SNS', 'Product'];

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = filter === 'All' 
    ? SAMPLE_DATA 
    : SAMPLE_DATA.filter(item => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-[32px] md:text-[48px] font-black text-slate-900 leading-tight mb-4" style={{ fontFamily: "'Pretendard', sans-serif" }}>
            성장의 결과를<br /><span className="text-[#C8102E]">증명합니다</span>
          </h2>
          <p className="text-slate-500 font-medium max-w-md">
            지난 5년 간 수많은 브랜드와 함께 고민하며 만들어낸<br />THE3 STUDIO만의 독보적인 포트폴리오입니다.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                filter === cat 
                ? 'bg-[#C8102E] text-white shadow-lg shadow-red-500/20' 
                : 'bg-white text-slate-500 border border-slate-200 hover:border-red-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.map((item, index) => (
          <div 
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className="group relative cursor-pointer animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl shadow-slate-200/50">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                <p className="text-[#C8102E] font-black text-xs tracking-widest mb-2 uppercase">{item.category}</p>
                <h3 className="text-white text-2xl font-black mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm font-medium line-clamp-2 mb-6">{item.description}</p>
                <div className="inline-flex items-center text-white font-bold text-sm">
                  View Detail <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          ></div>
          
          <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-8 right-8 z-20 w-12 h-12 bg-black/10 hover:bg-black/20 text-white md:text-slate-900 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-2/3 h-[40vh] md:h-full bg-slate-100">
              <img src={selectedItem.imageUrl} className="w-full h-full object-cover" alt={selectedItem.title} />
            </div>

            <div className="w-full md:w-1/3 p-10 md:p-16 overflow-y-auto flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-[#C8102E] font-black text-xs tracking-[0.2em] mb-6 uppercase">
                <span className="w-2 h-2 rounded-full bg-[#C8102E]"></span>
                {selectedItem.category} Project
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-8">
                {selectedItem.title}
              </h3>

              <div className="space-y-8 mb-12">
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Client</h4>
                  <p className="text-slate-900 font-bold text-lg">{selectedItem.client}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Core Task</h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{selectedItem.description}</p>
                </div>
              </div>

              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black hover:bg-[#C8102E] transition-all duration-300 shadow-xl shadow-slate-200">
                Contact for Similar Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* Helper Components */
const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
);

export default Portfolio;
