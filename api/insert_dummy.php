<?php
require_once __DIR__ . '/../includes/config.php';
$db = getDB();

// 샘플 포트폴리오 5개 추가
$db->exec("INSERT INTO portfolio (slug, title, category, client, thumbnail, card_size, is_featured, show_in_gallery, gallery_x, gallery_y, gallery_z) VALUES
('sample-1', 'Brand Strategy Sample', 'branding', 'Client A', 'img/real_youngshin.png', 'normal', 1, 1, -200, 0, -200),
('sample-2', 'Video Creative', 'video', 'Client B', 'img/real_soojung.png', 'large', 1, 1, 200, 0, -200),
('sample-3', 'Consulting Result', 'consulting', 'Client C', 'img/real_sanghoon.png', 'tall', 1, 1, 0, 150, -400),
('sample-4', 'Another Brand', 'branding', 'Client D', 'img/real_youngshin.png', 'wide', 1, 1, -400, -100, -600),
('sample-5', 'More Video', 'video', 'Client E', 'img/real_soojung.png', 'square', 1, 1, 400, -100, -600)
");

echo "포트폴리오 생성 완료";
