<?php
require_once __DIR__ . '/../includes/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$action = $_GET['action'] ?? '';

switch ($action) {
    // ─── 포트폴리오 목록 ───────────────────────────────
    case 'portfolio':
        $db = getDB();
        $category = $_GET['category'] ?? '';
        $featured = $_GET['featured'] ?? '';

        $sql = "SELECT id, slug, title, category, client, thumbnail, card_size, gallery_x, gallery_y, gallery_z, gallery_mobile_x, gallery_mobile_y, gallery_mobile_z, tags, year FROM portfolio WHERE status='published'";
        if ($featured) {
            $sql .= " AND (is_featured = 1 AND show_in_gallery = 1)";
        } else {
            $sql .= " AND show_in_list = 1";
        }
        $params = [];

        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }
        $sql .= " ORDER BY sort_order ASC, id DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        jsonResponse($stmt->fetchAll());
        break;

    // ─── 포트폴리오 상세 ───────────────────────────────
    case 'portfolio_detail':
        $slug = $_GET['slug'] ?? '';
        if (!$slug)
            jsonResponse(['error' => 'slug 필요'], 400);

        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM portfolio WHERE slug=? AND status='published'");
        $stmt->execute([$slug]);
        $item = $stmt->fetch();
        if (!$item)
            jsonResponse(['error' => '없는 프로젝트'], 404);

        // 갤러리 이미지
        $imgStmt = $db->prepare("SELECT * FROM portfolio_images WHERE portfolio_id=? ORDER BY sort_order");
        $imgStmt->execute([$item['id']]);
        $item['images'] = $imgStmt->fetchAll();

        jsonResponse($item);
        break;

    // ─── 클라이언트 로고 ───────────────────────────────
    case 'clients':
        $db = getDB();
        $stmt = $db->query("SELECT id, name, logo_path, website FROM clients WHERE is_active=1 ORDER BY sort_order");
        jsonResponse($stmt->fetchAll());
        break;

    case 'team':
        $db = getDB();
        $stmt = $db->query("SELECT id, name, role, specialty, bio, photo FROM team WHERE is_active=1 ORDER BY sort_order");
        jsonResponse($stmt->fetchAll());
        break;

    // ─── 성과 수치 ────────────────────────────────────
    case 'stats':
        $db = getDB();
        $stmt = $db->query("SELECT label, value, icon FROM stats ORDER BY sort_order");
        jsonResponse($stmt->fetchAll());
        break;

    // ─── 우리의 성장 (Journey) ────────────────────────
    case 'journey':
        $db = getDB();
        $stmt = $db->query("SELECT * FROM journey WHERE is_active=1 ORDER BY sort_order");
        jsonResponse($stmt->fetchAll());
        break;

    // ─── 문의 제출 ────────────────────────────────────
    case 'contact_submit':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST')
            jsonResponse(['error' => 'POST만 가능'], 405);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $company = trim($input['company_name'] ?? '');
        $email = trim($input['email'] ?? '');
        $service = trim($input['service'] ?? '');
        $message = trim($input['message'] ?? '');

        if (!$company || !$email || !$service || !$message) {
            jsonResponse(['error' => '모든 필드를 입력해주세요'], 400);
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            jsonResponse(['error' => '이메일 형식이 올바르지 않습니다'], 400);
        }

        $db = getDB();
        $stmt = $db->prepare("INSERT INTO contacts (company_name, email, service, message, ip_address) VALUES (?,?,?,?,?)");
        $stmt->execute([$company, $email, $service, $message, $_SERVER['REMOTE_ADDR'] ?? '']);

        jsonResponse(['success' => true, 'message' => '문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.']);
        break;

    // ─── 챗봇 문의 제출 ────────────────────────────────
    case 'chatbot_submit':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST')
            jsonResponse(['error' => 'POST만 가능'], 405);

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $name = trim($input['name'] ?? '');
        $phone = trim($input['phone'] ?? '');

        if (!$name || !$phone) {
            jsonResponse(['error' => '이름과 연락처를 모두 입력해주세요'], 400);
        }

        $db = getDB();
        $stmt = $db->prepare("INSERT INTO contacts (company_name, email, service, message, status, ip_address) VALUES (?,?,?,?,?,?)");
        // 챗봇 문의이므로 이메일 필드에 전화번호를 넣거나, 메시지 필드에 넣음. 
        // 여기서는 이메일 필드에 번호를 넣고 서비스명을 '챗봇 문의'로 저장함.
        $stmt->execute([
            $name, 
            $phone, 
            '챗봇 문의', 
            "챗봇을 통해 남겨진 연락처입니다: $phone", 
            'new',
            $_SERVER['REMOTE_ADDR'] ?? ''
        ]);

        jsonResponse(['success' => true, 'message' => '챗봇 문의가 접수되었습니다.']);
        break;

    // ─── 히어로 캐러셀 (Hero Carousel) ────────────────
    case 'hero':
        $db = getDB();
        $stmt = $db->query("SELECT id, image_path, sort_order FROM hero_carousel WHERE is_active=1 ORDER BY sort_order ASC, id DESC");
        jsonResponse($stmt->fetchAll());
        break;

    // ─── 사이트 설정 목록 ─────────────────────────
    case 'settings':
        $db = getDB();
        $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
        $settings = [];
        while($r = $stmt->fetch()) {
            $settings[$r['setting_key']] = $r['setting_value'];
        }
        jsonResponse($settings);
        break;

    default:
        jsonResponse(['error' => '잘못된 요청'], 400);
}
