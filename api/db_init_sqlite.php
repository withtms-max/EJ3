<?php
require_once __DIR__ . '/../includes/config.php';

echo "SQLite 데이터베이스 초기화 시작...\n";

// 데이터베이스 디렉토리 생성
$dbDir = dirname(DB_SQLITE_PATH);
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0755, true);
}

try {
    $db = new PDO("sqlite:" . DB_SQLITE_PATH);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. site_settings 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS site_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 2. hero_carousel 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS hero_carousel (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_path TEXT NOT NULL,
        caption TEXT DEFAULT NULL,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    // 3. contacts 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        email TEXT,
        service TEXT,
        message TEXT,
        status TEXT DEFAULT 'new',
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 3. 기본 데이터 삽입
    $settings = [
        ['hero_subtitle', 'WE ARE'],
        ['hero_title', 'THE 3 STUDIO'],
        ['hero_particle_words', 'Brand Strategy, Visual Design, Video Production'],
        ['hero_top_phrase', '장사하기도 바쁜 사장님, 브랜딩은']
    ];

    $stmt = $db->prepare("INSERT OR IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
    foreach ($settings as $s) {
        $stmt->execute($s);
    }

    // 기본 이미지 (샘플)
    $images = [
        ['https://images.unsplash.com/photo-1616098001648-5225026210f8?auto=format&fit=crop&q=80', 0],
        ['https://images.unsplash.com/photo-1600108343715-dd059ea9d20c?auto=format&fit=crop&q=80', 1],
        ['https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80', 2]
    ];

    $stmt = $db->prepare("INSERT OR IGNORE INTO hero_carousel (image_path, sort_order) VALUES (?, ?)");
    foreach ($images as $img) {
        $stmt->execute($img);
    }

    // 4. portfolio 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT NOT NULL,
        category TEXT,
        client TEXT,
        year INTEGER,
        thumbnail TEXT,
        challenge TEXT,
        solution TEXT,
        result TEXT,
        tags TEXT,
        is_featured INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 5. team 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS team (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT,
        specialty TEXT,
        bio TEXT,
        photo TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 6. stats 테이블 생성
    $db->exec("CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        value TEXT,
        icon TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    // 기본 팀 데이터 (현재 전문가들)
    $stmt = $db->prepare("INSERT OR IGNORE INTO team (name, role, specialty, bio, photo, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute(['김영신 대표', 'Brand Design', '가치를 시각화하는 브랜드 디자인 전문가', '고객의 마음에 깊이 각인되는 압도적 이미지', 'img/real_youngshin.png', 0]);
    $stmt->execute(['김상훈 소장', 'Strategy / Consulting', '대행사 전략 본부장 출신 컨설팅 전문가', '사장님의 브랜드가 이길 수밖에 없는 뼈대 설계', 'img/real_sanghoon.png', 1]);
    $stmt->execute(['이수정 대표', 'Video Directing', '커머셜 영상 감독 및 숏폼 전략가', '1초 만에 시선을 사로잡는 강력한 영상 연출', 'img/real_soojung.png', 2]);

    echo "✅ SQLite 데이터베이스가 성공적으로 설치 및 확장되었습니다!\n";
    echo "파일 위치: " . DB_SQLITE_PATH . "\n";
} catch (Exception $e) {
    echo "❌ 오류 발생: " . $e->getMessage() . "\n";
}
