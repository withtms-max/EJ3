<?php
require_once 'includes/config.php';
$db = getDB();
if (!$db) die("No DB");

$updates = [
    'hero_title' => '장사 바쁜 사장님, 브랜딩·홍보는 이제 우리더러 맡겨요!',
    'hero_subtitle' => '대기업 퀄리티 로고·인스타 릴스·간판, 비용은 동네 가게 맞춤으로!',
    'hero_particle_words' => '로고·브랜딩, 홍보영상, 인스타 릴스, 단골 만들기, 대박 전략',
    'hero_top_phrase' => '사장님은 장사만 하세요, 성장은 저희가 책임집니다.'
];

foreach ($updates as $key => $val) {
    $stmt = $db->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
    $stmt->execute([$key, $val]);
}

echo "Hero settings updated successfully.\n";
