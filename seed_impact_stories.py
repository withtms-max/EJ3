import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate('c:/THE3studio/serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

impact_stories = [
    {
        "author": "한사발포차 최한사 사장님",
        "quote": "\"줄 서는 식당으로 소문나서 막막했는데, <span class='highlight'>THE 3</span>의 브랜딩 이후 <br class='show-desktop'>영등포에서 가장 힙한 플레이스가 되었어요.\"",
        "result": "네이버 플레이스 상위 1% 달성",
        "avatar": "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop",
        "sort_order": 1
    },
    {
        "author": "태백우장수 고태백 사장님",
        "quote": "\"가족 외식 장소로 홍보가 안 돼서 힘들었지만, <br class='show-desktop'><span class='highlight'>THE 3</span>와 함께한 뒤 당산동 최고의 고기 맛집으로 자리 잡았습니다.\"",
        "result": "월 매출 3배 성장 달성",
        "avatar": "https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=200&auto=format&fit=crop",
        "sort_order": 2
    },
    {
        "author": "일품각 장양꼬 사장님",
        "quote": "\"당산역 원조의 자존심을 <span class='highlight'>THE 3</span>가 다시 세워줬습니다. <br class='show-desktop'>전통과 트렌드를 모두 잡은 완벽한 디자인의 승리입니다.\"",
        "result": "지역 기반 검색 1위 점유",
        "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
        "sort_order": 3
    },
    {
        "author": "하와이조개 조하와 사장님",
        "quote": "\"무제한 해물라면의 가치를 <span class='highlight'>THE 3</span>가 영상으로 증명해줬어요. <br class='show-desktop'>이제 당산에서 조개구이 하면 저희부터 찾습니다.\"",
        "result": "인스타그램 태그 수 2,000% 폭증",
        "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        "sort_order": 4
    },
    {
        "author": "안동실비 심안동 사장님",
        "quote": "\"24시간 영업의 강점을 <span class='highlight'>THE 3</span>가 정교하게 타겟팅해줬습니다. <br class='show-desktop'>새벽에도 끊이지 않는 손님들로 즐거운 비명을 지릅니다.\"",
        "result": "방문자 리뷰 1,000개 돌파",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
        "sort_order": 5
    },
    {
        "author": "손정보쌈 박보쌈 사장님",
        "quote": "\"막걸리 쿠폰 전략 하나로 <span class='highlight'>THE 3</span>가 상권 지도를 바꿨어요. <br class='show-desktop'>가장 단순한 게 가장 강력한 전략임을 배우고 갑니다.\"",
        "result": "재방문율 40% 이상 기록",
        "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200&auto=format&fit=crop",
        "sort_order": 6
    }
]

for story in impact_stories:
    db.collection('impact_stories').add(story)
    print(f"Added impact story: {story['author']}")

print("All existing impact stories have been migrated to Firestore!")
