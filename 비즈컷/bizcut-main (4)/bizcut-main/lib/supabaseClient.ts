import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder"

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error("❌ Supabase 설정 오류: VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY가 누락되었습니다.")
  console.warn("Vercel 프로젝트 설정(Environment Variables)에서 위 변수들을 반드시 등록해주세요.")
}

export const supabase = (() => {
  try {
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    console.error("❌ Supabase 클라이언트 생성 실패:", e)
    // Return a dummy client that fails gracefully or just null
    return createClient("https://placeholder.supabase.co", "placeholder") 
  }
})()
