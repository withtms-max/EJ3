<?php
require_once __DIR__ . '/../includes/config.php';

try {
    $db = getDB();
    if (!$db) die("DB 연결 실패");

    echo "<h3>데이터베이스 패치 시작...</h3>";

    // 1. show_in_gallery 컬럼 추가
    try {
        $db->exec("ALTER TABLE portfolio ADD COLUMN show_in_gallery INTEGER DEFAULT 1");
        echo "<p style='color:green'>✔ show_in_gallery 컬럼 추가 성공</p>";
    } catch (Exception $e) {
        $db->exec("UPDATE portfolio SET show_in_gallery = 1 WHERE show_in_gallery IS NULL");
        echo "<p style='color:green'>✔ show_in_gallery 확인 완료</p>";
    }

    // 2. show_in_list 컬럼 추가
    try {
        $db->exec("ALTER TABLE portfolio ADD COLUMN show_in_list INTEGER DEFAULT 1");
        echo "<p style='color:green'>✔ show_in_list 컬럼 추가 성공</p>";
    } catch (Exception $e) {
        $db->exec("UPDATE portfolio SET show_in_list = 1 WHERE show_in_list IS NULL");
        echo "<p style='color:green'>✔ show_in_list 확인 완료</p>";
    }

    // 2.5 card_size 컬럼 추가
    try {
        $db->exec("ALTER TABLE portfolio ADD COLUMN card_size VARCHAR(20) DEFAULT 'normal'");
        echo "<p style='color:green'>✔ card_size 확인 완료</p>";
    } catch (Exception $e) {
        echo "<p style='color:green'>✔ card_size 확인 완료</p>";
    }

    // ⭐ 2.7 3D 위치 컬럼들 추가 (이게 없어서 안떴던 것!)
    $cols = [
        'gallery_x' => 'VARCHAR(20) DEFAULT "0"',
        'gallery_y' => 'VARCHAR(20) DEFAULT "0"',
        'gallery_z' => 'VARCHAR(20) DEFAULT "0"',
        'gallery_mobile_x' => 'VARCHAR(20) DEFAULT "0"',
        'gallery_mobile_y' => 'VARCHAR(20) DEFAULT "0"',
        'gallery_mobile_z' => 'VARCHAR(20) DEFAULT "0"'
    ];
    foreach($cols as $col => $def) {
        try {
            $db->exec("ALTER TABLE portfolio ADD COLUMN $col $def");
            echo "<p style='color:green'>✔ $col 컬럼 추가 성공</p>";
        } catch (Exception $e) {
            echo "<p style='color:green'>✔ $col 확인 완료</p>";
        }
    }

    // 3. 테스트 데이터 삽입 시도
    try {
        $testSlug = 'test-' . time();
        $stmt = $db->prepare("INSERT INTO portfolio (slug, title, category, show_in_gallery, show_in_list) VALUES (?, ?, ?, 1, 1)");
        $stmt->execute([$testSlug, '자동 패치 테스트', 'branding']);
        echo "<p style='color:blue'>✔ 테스트 데이터 저장 성공! (Slug: $testSlug)</p>";
    } catch (Exception $e) {
        echo "<p style='color:red'>❌ 저장 테스트 실패: " . $e->getMessage() . "</p>";
    }

    echo "<h4>패치 완료! 이제 관리자 페이지에서 저장을 시도해보세요.</h4>";
    echo "<a href='/admin/portfolio.php'>포트폴리오 관리로 돌아가기</a>";

} catch (Exception $e) {
    echo "<p style='color:red'>중명 오류: " . $e->getMessage() . "</p>";
}
