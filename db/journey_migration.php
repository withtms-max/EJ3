<?php
require_once __DIR__ . '/../includes/config.php';

echo "Journey 테이블 마이그레이션 시작...\n";

try {
    $db = getDB();
    if (!$db) throw new Exception("DB 연결 실패");

    // 1. journey 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS journey (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        period TEXT,
        subtitle TEXT,
        description TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. 초기 데이터 준비 (index.html 기반)
    $items = [
        [
            'title' => '기획 & 전략',
            'period' => '2018 - 2022',
            'subtitle' => '대형 광고대행사 출신 기획',
            'description' => '수백억 예산의 브랜드를 성공시키던 대기업 캠페인 기획 노하우를 그대로 소상공인의 작은 가게, 첫 출발에 적용합니다. 실패할 수 없는 뼈대를 만듭니다.',
            'sort_order' => 0
        ],
        [
            'title' => '브랜드 디자인',
            'period' => '2022 - Present',
            'subtitle' => 'UX & 시각 디자인 전문가',
            'description' => '8년간 수많은 프로젝트와 패키지를 디자인했습니다. 예쁘기만 한 디자인이 아니라, 고객의 마음을 움직이고 결제 버튼을 누르게 만드는 진짜 디자인을 합니다.',
            'sort_order' => 1
        ],
        [
            'title' => '영상 프로덕션',
            'period' => '2016 - 2021',
            'subtitle' => '커머셜 영상 감독',
            'description' => 'TV CF부터 유튜브, 최신 트렌드인 릴스와 숏폼까지. 가장 터지기 쉬운 문법을 알고 있습니다. 고객의 엄지손가락을 멈추게 하는 흡입력을 선물하세요.',
            'sort_order' => 2
        ],
        [
            'title' => '성장 파트너',
            'period' => 'Now',
            'subtitle' => 'THE3 STUDIO의 탄생',
            'description' => '결국 이 세 가지 무기가 하나로 합쳐졌을 때 터져 나오는 시너지를 굳게 믿습니다. 동네 골목 상권에서부터 글로벌 런칭까지, 사장님의 성장을 함께합니다.',
            'sort_order' => 3
        ]
    ];

    // 3. 기존 데이터 삭제 및 초기화 (무결성 보장)
    echo "기존 데이터 삭제 중...\n";
    $db->exec("DELETE FROM journey");
    $db->exec("DELETE FROM sqlite_sequence WHERE name='journey'");

    // 4. 데이터 삽입
    $stmt = $db->prepare("INSERT INTO journey (title, period, subtitle, description, sort_order) VALUES (?, ?, ?, ?, ?)");
    foreach ($items as $item) {
        $stmt->execute([
            $item['title'],
            $item['period'],
            $item['subtitle'],
            $item['description'],
            $item['sort_order']
        ]);
    }
    echo "✅ 데이터 삽입 완료 (" . count($items) . " 건)\n";
    echo "✅ Journey 테이블 마이그레이션 성공!\n";

} catch (Exception $e) {
    echo "❌ 오류 발생: " . $e->getMessage() . "\n";
}
