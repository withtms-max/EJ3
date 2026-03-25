<?php
require_once __DIR__ . '/../includes/config.php';

// Allow index.html (frontend) to read this API via fetch
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

try {
    $db = getDB();
    if ($db === null) {
        // Fallback for local testing without DB
        echo json_encode([
            'settings' => [
                'hero_subtitle' => 'WE ARE',
                'hero_title' => 'THE 3 STUDIO',
                'hero_particle_words' => 'Brand Strategy, Visual Design, Video Production',
                'hero_top_phrase' => '장사하기도 바쁜 사장님, 브랜딩은'
            ],
            'carousel' => [
                ['image_path' => 'https://images.unsplash.com/photo-1616098001648-5225026210f8?auto=format&fit=crop&q=80'],
                ['image_path' => 'https://images.unsplash.com/photo-1600108343715-dd059ea9d20c?auto=format&fit=crop&q=80'],
                ['image_path' => 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80'],
                ['image_path' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'],
                ['image_path' => 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80'],
                ['image_path' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80'],
                ['image_path' => 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80']
            ]
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 1. Fetch Settings
    $settingsStmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
    $settings = [];
    while ($row = $settingsStmt->fetch()) {
         $settings[$row['setting_key']] = $row['setting_value'];
    }

    // Default fallbacks if DB is empty
    if (empty($settings['hero_subtitle'])) $settings['hero_subtitle'] = 'WE ARE';
    if (empty($settings['hero_title'])) $settings['hero_title'] = 'THE 3 STUDIO';
    if (empty($settings['hero_particle_words'])) $settings['hero_particle_words'] = 'Brand Strategy, Visual Design, Video Production';
    if (empty($settings['hero_top_phrase'])) $settings['hero_top_phrase'] = '장사하기도 바쁜 사장님, 브랜딩은';
    if (empty($settings['hero_bg_url'])) $settings['hero_bg_url'] = 'https://prod.spline.design/zYnTxAxV1wIuElaT/scene.splinecode';

    // 2. Fetch Carousel
    $carouselStmt = $db->query("SELECT * FROM hero_carousel WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
    $carousel = $carouselStmt->fetchAll();

    echo json_encode([
        'settings' => $settings,
        'carousel' => $carousel
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
