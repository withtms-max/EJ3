import json
import os

html_path = 'c:\\THE3studio\\index.html'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# I will write a JS script that imports Firebase and deletes all items in `service_packages`, then adds the 4 items.
# Since python doesn't easily talk to firestore without admin sdk, I will use node / script.
# Actually, wait, node might not have firebase-admin installed. 
# Better: injecting a one-time JS script into index.html which runs ONCE then we remove it. Or just use a node script using `node-fetch` + Firebase JS SDK? No, Firebase JS SDK works in browser.

script = """
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTX7XZ3WRxvf1MnpotRvUQC8x9o6N44yc",
  authDomain: "the3-fc45a.firebaseapp.com",
  projectId: "the3-fc45a"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const data = [
  { sort_order: 40, title: "BRAND STRATEGY CONSULTING", desc: "비전 있는 기업들의 파트너가 되어 전략을 실행으로 완성합니다. 심층적인 데이터 기반 인사이트를 통해 비즈니스 성장을 가속화하며, 시장 분석 및 경쟁력 평가를 통해 최적화된 운영 프로세스를 구축합니다." },
  { sort_order: 30, title: "VISUAL IDENTITY DESIGN", desc: "브랜드의 진정한 본질을 발굴하여 압도적인 비주얼 아이덴티티를 구축합니다. 로고 및 BI/BX 디자인부터 브랜드 스타일 가이드까지, 타겟과 깊이 교감할 수 있는 강력한 시각 언어를 제안합니다." },
  { sort_order: 20, title: "COMMERCIAL VIDEO & SHORTS", desc: "영화 같은 정교함으로 브랜드 스토리에 생명력을 불어넣습니다. 기업 홍보 필름, 제품 쇼케이스, 숏폼 콘텐츠 등 하이엔드 비주얼 마스터피스를 통해 브랜드의 가치를 시각적으로 증명합니다." },
  { sort_order: 10, title: "PERFORMANCE MARKETING", desc: "실질적인 구매와 전환을 일으키는 데이터 기반 마케팅을 지향합니다. 소셜 미디어 광고 운영부터 정밀한 성과 분석까지, 사장님의 비즈니스 매출 성장을 최우선 목표로 캠페인을 운영합니다." }
];

async function run() {
  const c = collection(db, 'service_packages');
  const s = await getDocs(c);
  for(let d of s.docs) {
    await deleteDoc(doc(db, 'service_packages', d.id));
  }
  for(let x of data) {
    await setDoc(doc(c), x);
  }
  console.log("Done initializing service_packages!");
  process.exit(0);
}
run();
"""
# Oops, 'firebase/app' requires npm install firebase.
# Is node available? 
