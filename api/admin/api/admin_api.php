<?php
require_once __DIR__ . '/../../../includes/config.php';
ini_set('display_errors', 0);
error_reporting(E_ALL);
requireAdminLogin();

header('Content-Type: application/json; charset=utf-8');
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {

    // ──── 포트폴리오 목록 ────────────────────────────────
    case 'portfolio_list':
        $db = getDB();
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결 실패 (SQLite 드라이버 확인 필요)'], 500);
        }
        $items = $db->query("SELECT * FROM portfolio ORDER BY sort_order, id DESC")->fetchAll();
        jsonResponse($items);
        break;

    // ──── 포트폴리오 저장 (추가/수정) ───────────────────
    case 'portfolio_save':
        $db = getDB();
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결 실패'], 500);
        }
        $d = $_POST;
        
        // 업로드 파일 처리
        $thumbnail = $d['existing_thumbnail'] ?? '';
        if (!empty($_FILES['thumbnail']['tmp_name'])) {
            $uploadDir = UPLOAD_DIR . 'portfolio/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

            $ext = strtolower(pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION));
            $filename = 'portfolio_' . time() . '_thumb.' . $ext;
            $uploadPath = $uploadDir . $filename;
            if (move_uploaded_file($_FILES['thumbnail']['tmp_name'], $uploadPath)) {
                $thumbnail = 'uploads/portfolio/' . $filename;
            } else {
                jsonResponse(['error' => '파일을 업로드 폴더로 옮기는 데 실패했습니다. (권한 확인 필요)'], 500);
            }
        }

        $fields = [
            'slug'      => $d['slug'] ?? '',
            'title'     => $d['title'] ?? '',
            'category'  => $d['category'] ?? 'branding',
            'client'    => $d['client'] ?? '',
            'thumbnail' => $thumbnail,
            'card_size' => $d['card_size'] ?? 'normal',
            'challenge' => $d['challenge'] ?? '',
            'solution'  => $d['solution'] ?? '',
            'result'    => $d['result'] ?? '',
            'tags'      => $d['tags'] ?? '',
            'year'      => $d['year'] ?? date('Y'),
            'is_featured' => (int)($d['is_featured'] ?? 0),
            'show_in_gallery' => (int)($d['show_in_gallery'] ?? 1),
            'show_in_list' => (int)($d['show_in_list'] ?? 1),
            'sort_order' => (int)($d['sort_order'] ?? 0),
            'status'    => $d['status'] ?? 'published'
        ];

        // 슬러그 자동 생성
        if (empty($fields['slug'])) {
            $slugGenerated = strtolower(preg_replace('/[^\w-]+/', '-', $fields['title']));
            $fields['slug'] = $slugGenerated ?: 'p-' . time();
        }

        // ── 슬러그 중복 방지 (UNIQUE Constraint 에러 방지) ──
        $pid = $d['id'] ?? 0;
        if (!$db) {
            $db = getDB(); // 유실되었다면 다시 시도
        }
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결을 재시도했으나 실패했습니다.'], 500);
        }
        $checkStmt = $db->prepare("SELECT id FROM portfolio WHERE slug = ? AND id != ?");
        $checkStmt->execute([$fields['slug'], $pid]);
        if ($checkStmt->fetch()) {
             // 이미 있는 슬러그인 경우 뒤에 타임스탬프를 살짝 붙여서 고유하게 만듦
             $fields['slug'] .= '-' . substr(time(), -4);
        }

        try {
            if (!$db) $db = getDB();
            if (!$db) throw new Exception("데이터베이스 객체가 유실되었습니다.");
            if (!empty($d['id'])) {
                $sets = []; $vals = [];
                foreach($fields as $k => $v) { $sets[] = "$k = ?"; $vals[] = $v; }
                $vals[] = $d['id'];
                $sql = "UPDATE portfolio SET " . implode(', ', $sets) . " WHERE id = ?";
                $db->prepare($sql)->execute($vals);
                jsonResponse(['success' => true, 'message' => '수정 완료']);
            } else {
                $cols = implode(', ', array_keys($fields));
                $qs = implode(', ', array_fill(0, count($fields), '?'));
                $sql = "INSERT INTO portfolio ($cols) VALUES ($qs)";
                $db->prepare($sql)->execute(array_values($fields));
                jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
            }
        } catch (Exception $e) {
            jsonResponse(['error' => 'DB 오류: ' . $e->getMessage()], 500);
        }
        break;

    // ──── 포트폴리오 삭제 ───────────────────────────────
    case 'portfolio_delete':
        $db = getDB();
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결 실패'], 500);
        }
        $id = (int) ($_GET['id'] ?? 0);
        if (!$id)
            jsonResponse(['error' => 'id 필요'], 400);
            
        try {
            // 1. 갤러리 이미지 파일 삭제 (portfolio_images)
            $stmt = $db->prepare("SELECT image_path FROM portfolio_images WHERE portfolio_id=?");
            $stmt->execute([$id]);
            $images = $stmt->fetchAll();
            foreach ($images as $img) {
                if (!empty($img['image_path'])) {
                    $path = __DIR__ . '/../../../' . $img['image_path'];
                    if (file_exists($path)) @unlink($path);
                }
            }
            
            // 2. 이미지 레코드 삭제
            $db->prepare("DELETE FROM portfolio_images WHERE portfolio_id=?")->execute([$id]);
            
            // 3. 포트폴리오 썸네일 파일 삭제 (portfolio)
            $thumbStmt = $db->prepare("SELECT thumbnail FROM portfolio WHERE id=?");
            $thumbStmt->execute([$id]);
            $thumbPath = $thumbStmt->fetchColumn();
            if ($thumbPath && !empty($thumbPath)) {
                $path = __DIR__ . '/../../../' . $thumbPath;
                if (file_exists($path)) @unlink($path);
            }
            
            // 4. 포트폴리오 본체 삭제
            $db->prepare("DELETE FROM portfolio WHERE id=?")->execute([$id]);
            
            jsonResponse(['success' => true]);
        } catch (Exception $e) {
            jsonResponse(['error' => '삭제 실패: ' . $e->getMessage()], 500);
        }
        break;

    // ──── 갤러리 이미지 목록 ────────────────────────────
    case 'portfolio_images_list':
        $pid = (int)($_GET['portfolio_id'] ?? 0);
        if (!$pid) jsonResponse(['error' => 'portfolio_id 필요'], 400);
        $db = getDB();
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결 실패'], 500);
        }
        $stmt = $db->prepare("SELECT * FROM portfolio_images WHERE portfolio_id=? ORDER BY sort_order");
        $stmt->execute([$pid]);
        jsonResponse($stmt->fetchAll());
        break;

    // ──── 갤러리 이미지 추가 (다중업로드) ───────────────
    case 'portfolio_images_add':
        if ($method !== 'POST') jsonResponse(['error' => 'POST 필요'], 405);
        $pid = (int)($_POST['portfolio_id'] ?? 0);
        if (!$pid) jsonResponse(['error' => 'portfolio_id 필요'], 400);
        $uploadDir = UPLOAD_DIR . 'portfolio/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $db = getDB();
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결 실패'], 500);
        }
        $added = [];
        $files = $_FILES['images'] ?? [];
        if (!empty($files['name']) && is_array($files['name'])) {
            $count = count($files['name']);
            for ($i = 0; $i < $count; $i++) {
                if ($files['error'][$i] !== 0) continue;
                $ext = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg','jpeg','png','webp','gif'])) continue;
                $filename = 'pf_' . $pid . '_' . time() . '_' . $i . '.' . $ext;
                if (move_uploaded_file($files['tmp_name'][$i], $uploadDir . $filename)) {
                    $path = 'uploads/portfolio/' . $filename;
                    $db->prepare("INSERT INTO portfolio_images (portfolio_id, image_path, sort_order) VALUES (?,?,?)")
                        ->execute([$pid, $path, $i]);
                    $added[] = ['path' => $path, 'id' => $db->lastInsertId()];
                }
            }
        }
        jsonResponse(['success' => true, 'added' => $added]);
        break;

    // ──── 갤러리 이미지 삭제 ─────────────────────────────
    case 'portfolio_images_delete':
        $db = getDB();
        if (!$db) {
            jsonResponse(['error' => '데이터베이스 연결 실패'], 500);
        }
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'id 필요'], 400);
        $row = $db->prepare("SELECT image_path FROM portfolio_images WHERE id=?");
        $row->execute([$id]);
        $img = $row->fetch();
        if ($img && file_exists(__DIR__ . '/../../' . $img['image_path'])) {
            @unlink(__DIR__ . '/../../' . $img['image_path']);
        }
        $db->prepare("DELETE FROM portfolio_images WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    // ──── 클라이언트 로고 목록/저장/삭제 ─────────────────
    case 'clients_list':
        jsonResponse(getDB()->query("SELECT * FROM clients ORDER BY sort_order")->fetchAll());
        break;

    case 'clients_save':
        if ($method !== 'POST')
            jsonResponse(['error' => 'POST 필요'], 405);
        $db = getDB();
        $d = $_POST;
        $logo = $d['existing_logo'] ?? '';
        
        if (!empty($_FILES['logo']['tmp_name'])) {
            $uploadDir = UPLOAD_DIR . 'clients/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            $ext = strtolower(pathinfo($_FILES['logo']['name'], PATHINFO_EXTENSION));
            $filename = 'client_' . time() . '.' . $ext;
            move_uploaded_file($_FILES['logo']['tmp_name'], $uploadDir . $filename);
            $logo = 'uploads/clients/' . $filename;
        }

        if (!empty($d['id'])) {
            $db->prepare("UPDATE clients SET name=?, category=?, project_name=?, contract_date=?, logo_path=?, website=?, description=?, sort_order=?, is_active=? WHERE id=?")
                ->execute([
                    $d['name'], 
                    $d['category'] ?? '', 
                    $d['project_name'] ?? '', 
                    $d['contract_date'] ?? '', 
                    $logo, 
                    $d['website'] ?? '', 
                    $d['description'] ?? '', 
                    (int) ($d['sort_order'] ?? 0), 
                    (int) ($d['is_active'] ?? 1), 
                    $d['id']
                ]);
        } else {
            $db->prepare("INSERT INTO clients (name, category, project_name, contract_date, logo_path, website, description, sort_order) VALUES (?,?,?,?,?,?,?,?)")
                ->execute([
                    $d['name'], 
                    $d['category'] ?? '', 
                    $d['project_name'] ?? '', 
                    $d['contract_date'] ?? '', 
                    $logo, 
                    $d['website'] ?? '', 
                    $d['description'] ?? '', 
                    (int) ($d['sort_order'] ?? 0)
                ]);
        }
        jsonResponse(['success' => true]);
        break;

    case 'clients_delete':
        $id = (int) ($_GET['id'] ?? 0);
        getDB()->prepare("DELETE FROM clients WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    case 'contacts_delete':
        $id = (int) ($_GET['id'] ?? 0);
        getDB()->prepare("DELETE FROM contacts WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    // ──── 팀 관리 ─────────────────────────────────────
    case 'team_list':
        jsonResponse(getDB()->query("SELECT * FROM team ORDER BY sort_order")->fetchAll());
        break;

    case 'team_save':
        if ($method !== 'POST')
            jsonResponse(['error' => 'POST 필요'], 405);
        $db = getDB();
        $d = $_POST;
        $photo = '';
        if (!empty($_FILES['photo']['tmp_name'])) {
            // 새 파일 업로드
            $ext = strtolower(pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION));
            $filename = 'team_' . time() . '.' . $ext;
            $uploadDir = UPLOAD_DIR . 'team/';
            if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
            move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $filename);
            $photo = 'uploads/team/' . $filename;
        } elseif (!empty($d['id'])) {
            // 수정 시 새 파일 없으면 기존 사진 유지
            $row = $db->prepare("SELECT photo FROM team WHERE id=?");
            $row->execute([$d['id']]);
            $existing = $row->fetch();
            $photo = $existing['photo'] ?? '';
        }
        if (!empty($d['id'])) {
            $db->prepare("UPDATE team SET name=?, role=?, specialty=?, bio=?, photo=?, linkedin=?, instagram=?, sort_order=?, is_active=? WHERE id=?")
                ->execute([$d['name'], $d['role'], $d['specialty'] ?? '', $d['bio'] ?? '', $photo, $d['linkedin'] ?? '', $d['instagram'] ?? '', (int) ($d['sort_order'] ?? 0), (int) ($d['is_active'] ?? 1), $d['id']]);
        } else {
            $db->prepare("INSERT INTO team (name, role, specialty, bio, photo, linkedin, instagram, sort_order) VALUES (?,?,?,?,?,?,?,?)")
                ->execute([$d['name'], $d['role'], $d['specialty'] ?? '', $d['bio'] ?? '', $photo, $d['linkedin'] ?? '', $d['instagram'] ?? '', (int) ($d['sort_order'] ?? 0)]);
        }
        jsonResponse(['success' => true]);
        break;

    // ──── 팀 삭제 ──────────────────────────────────────
    case 'team_delete':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'id 필요'], 400);
        getDB()->prepare("DELETE FROM team WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    // ──── 성과 수치 수정 ────────────────────────────────
    case 'stats_save':
        if ($method !== 'POST')
            jsonResponse(['error' => 'POST 필요'], 405);
        $db = getDB();
        $items = json_decode(file_get_contents('php://input'), true) ?? [];
        foreach ($items as $item) {
            $db->prepare("UPDATE stats SET label=?, value=? WHERE id=?")->execute([$item['label'], $item['value'], $item['id']]);
        }
        jsonResponse(['success' => true]);
        break;

    // ──── 우리의 성장(Journey) 관리 ─────────────────────
    case 'journey_list':
        jsonResponse(getDB()->query("SELECT * FROM journey ORDER BY sort_order")->fetchAll());
        break;

    case 'journey_save':
        if ($method !== 'POST') jsonResponse(['error' => 'POST 필요'], 405);
        $db = getDB();
        $d = $_POST;
        if (!empty($d['id'])) {
            $db->prepare("UPDATE journey SET title=?, period=?, subtitle=?, description=?, sort_order=?, is_active=? WHERE id=?")
                ->execute([$d['title'], $d['period'], $d['subtitle'], $d['description'], (int)($d['sort_order'] ?? 0), (int)($d['is_active'] ?? 1), $d['id']]);
        } else {
            $db->prepare("INSERT INTO journey (title, period, subtitle, description, sort_order) VALUES (?,?,?,?,?)")
                ->execute([$d['title'], $d['period'], $d['subtitle'], $d['description'], (int)($d['sort_order'] ?? 0)]);
        }
        jsonResponse(['success' => true]);
        break;

    case 'journey_delete':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'id 필요'], 400);
        getDB()->prepare("DELETE FROM journey WHERE id=?")->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    // ──── 문의 목록 ───────────────────────────────────
    case 'contacts_list':
        $db = getDB();
        $items = $db->query("SELECT * FROM contacts ORDER BY created_at DESC")->fetchAll();
        // 읽지 않은 건 읽음 처리
        if (!empty($_GET['mark_read'])) {
            $db->query("UPDATE contacts SET status='read' WHERE status='new'");
        }
        jsonResponse($items);
        break;

    case 'contacts_status':
        $db = getDB();
        $id = (int) ($_GET['id'] ?? 0);
        $status = $_GET['status'] ?? 'read';
        $db->prepare("UPDATE contacts SET status=? WHERE id=?")->execute([$status, $id]);
        jsonResponse(['success' => true]);
        break;

    case 'portfolio_update_positions':
        if ($method !== 'POST') jsonResponse(['error' => 'POST 필요'], 405);
        $db = getDB();
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !is_array($input)) jsonResponse(['error' => '데이터 형식 오류'], 400);
        
        $db->beginTransaction();
        try {
            foreach($input as $row) {
                if (isset($row['isMobile']) && $row['isMobile']) {
                    $stmt = $db->prepare("UPDATE portfolio SET gallery_mobile_x=?, gallery_mobile_y=?, gallery_mobile_z=? WHERE id=?");
                } else {
                    $stmt = $db->prepare("UPDATE portfolio SET gallery_x=?, gallery_y=?, gallery_z=? WHERE id=?");
                }
                $stmt->execute([
                    (int)$row['x'],
                    (int)$row['y'],
                    (int)($row['z'] ?? 0),
                    (int)$row['id']
                ]);
            }
            $db->commit();
            jsonResponse(['success' => true]);
        } catch(Exception $e) {
            $db->rollBack();
            jsonResponse(['error' => $e->getMessage()], 500);
        }
        break;

    case 'hero_delete':
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'id 필요'], 400);
        $db = getDB();
        $stmt = $db->prepare("SELECT image_path FROM hero_carousel WHERE id = ?");
        $stmt->execute([$id]);
        $path = $stmt->fetchColumn();
        if ($path && !str_starts_with($path, 'http')) {
            $filepath = UPLOAD_DIR . $path;
            if (file_exists($filepath)) @unlink($filepath);
        }
        $db->prepare("DELETE FROM hero_carousel WHERE id = ?")->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    case 'settings_save':
        if ($method !== 'POST') jsonResponse(['error' => 'POST 필요'], 405);
        $db = getDB();
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || !is_array($input)) {
            // FormData fallback
            $input = $_POST;
        }
        if (!$input) jsonResponse(['error' => '데이터 없음'], 400);

        try {
            $stmt = $db->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
            foreach($input as $k => $v) {
                if (is_string($v) || is_numeric($v)) {
                    $stmt->execute([$k, (string)$v]);
                }
            }
            jsonResponse(['success' => true]);
        } catch(Exception $e) {
            jsonResponse(['error' => $e->getMessage()], 500);
        }
        break;

    default:
        jsonResponse(['error' => '잘못된 요청'], 400);
}
