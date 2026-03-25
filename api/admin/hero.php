<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();

$db = getDB();
$error = '';
$success = '';

// Compatibility shim for PHP < 8.0
if (!function_exists('str_starts_with')) {
    function str_starts_with($haystack, $needle) {
        return (string)$needle !== '' && strpos($haystack, $needle) === 0;
    }
}

// 1. Process Actions (Form Submissions or AJAX)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if it's an AJAX delete
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['action']) && $input['action'] === 'delete_slide') {
        try {
            if (!$db) throw new Exception("DB 연결 실패");
            $id = (int)$input['slide_id'];
            $stmt = $db->prepare("SELECT image_path FROM hero_carousel WHERE id = ?");
            $stmt->execute([$id]);
            $path = $stmt->fetchColumn();
            
            if ($path) {
                if (!str_starts_with($path, 'http')) {
                    $filepath = UPLOAD_DIR . $path;
                    if (file_exists($filepath)) @unlink($filepath);
                }
                $db->prepare("DELETE FROM hero_carousel WHERE id = ?")->execute([$id]);
                echo json_encode(['success' => true]);
                exit;
            }
            throw new Exception("항목을 찾을 수 없습니다.");
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }
    }

    // Standard Form Actions
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        
        if ($action === 'save_settings') {
            try {
                $subtitle = $_POST['hero_subtitle'] ?? '';
                $title = $_POST['hero_title'] ?? '';
                $description = $_POST['hero_description'] ?? '';
                $longDescription = $_POST['hero_long_description'] ?? '';
                $slotsLeft = $_POST['hero_slots_left'] ?? '2';
                $bgUrl = $_POST['hero_bg_url'] ?? '';

                $stmt = $db->prepare("REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
                $stmt->execute(['hero_subtitle', $subtitle]);
                $stmt->execute(['hero_title', $title]);
                $stmt->execute(['hero_description', $description]);
                $stmt->execute(['hero_long_description', $longDescription]);
                $stmt->execute(['hero_slots_left', $slotsLeft]);
                $stmt->execute(['hero_bg_url', $bgUrl]);
                
                header("Location: hero.php?success=saved");
                exit;
            } catch (Exception $e) { $error = "저장 실패: " . $e->getMessage(); }
        }
        
        if ($action === 'add_slide') {
            if (isset($_FILES['slide_image']) && $_FILES['slide_image']['error'] === UPLOAD_ERR_OK) {
                $tmp = $_FILES['slide_image']['tmp_name'];
                $ext = strtolower(pathinfo($_FILES['slide_image']['name'], PATHINFO_EXTENSION));
                if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                    $newName = 'hero_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
                    if (move_uploaded_file($tmp, UPLOAD_DIR . $newName)) {
                        $db->prepare("INSERT INTO hero_carousel (image_path, sort_order) VALUES (?, 0)")->execute([$newName]);
                        header("Location: hero.php?success=added");
                        exit;
                    } else { $error = "파일 저장 실패 (권한 확인 필요)"; }
                } else { $error = "허용되지 않는 형식입니다."; }
            } else { $error = "파일 업로드 오류"; }
        }
    }
}

// 2. Load Data
if (isset($_GET['success'])) {
    if ($_GET['success'] === 'saved') $success = "설정이 저장되었습니다.";
    if ($_GET['success'] === 'added') $success = "이미지가 추가되었습니다.";
}

$settings = [];
if ($db) {
    $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
    while ($r = $stmt->fetch()) $settings[$r['setting_key']] = $r['setting_value'];
    $carousel = $db->query("SELECT * FROM hero_carousel ORDER BY sort_order ASC, id DESC")->fetchAll();
}

$subtitle = $settings['hero_subtitle'] ?? 'Hi, We are';
$title = $settings['hero_title'] ?? 'THE 3 STUDIO';
$description = $settings['hero_description'] ?? '';
$longDescription = $settings['hero_long_description'] ?? '';
$slotsLeft = $settings['hero_slots_left'] ?? '2';
$bgUrl = $settings['hero_bg_url'] ?? 'https://prod.spline.design/zYnTxAxV1wIuElaT/scene.splinecode';
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>히어로 설정 | THE3 Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --primary: #5c3ce6; --bg: #0a0a0a; --surface: #111; --border: #222; --text: #fff; --text-gray: #999; --sidebar-w: 240px; --success: #22c55e; --danger: #ef4444; }
        body { margin: 0; font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); display: flex; }
        .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); position: fixed; height: 100vh; display: flex; flex-direction: column; }
        .sidebar-logo { padding: 24px 20px; font-weight: 900; font-size: 1.1rem; border-bottom: 1px solid var(--border); }
        .sidebar-nav a { display: flex; align-items: center; gap: 10px; padding: 11px 20px; color: var(--text-gray); text-decoration: none; font-size: 0.88rem; border-left: 3px solid transparent; }
        .sidebar-nav a:hover, .sidebar-nav a.active { color: #fff; background: rgba(92,60,230,0.1); border-left-color: var(--primary); }
        .main { margin-left: var(--sidebar-w); flex: 1; padding: 32px; min-height: 100vh; }
        h1 { font-size: 1.5rem; font-weight: 900; margin-bottom: 24px; }
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 32px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; font-size: 13px; color: var(--text-gray); margin-bottom: 8px; font-weight: 600; }
        input[type="text"], textarea { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; color: #fff; font-size: 14px; font-family: inherit; }
        input[type="text"]:focus, textarea:focus { border-color: var(--primary); outline: none; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-danger { background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
        .btn-danger:hover { background: var(--danger); color: #fff; }
        .alert { padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; animation: slideIn 0.3s; }
        .alert-success { background: rgba(34,197,94,0.1); color: var(--success); border: 1px solid rgba(34,197,94,0.2); }
        .alert-danger { background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-top: 16px; }
        .gallery-item { position: relative; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); aspect-ratio: 9/16; background: rgba(255,255,255,0.05); transition: 0.3s; }
        .gallery-item:hover { border-color: var(--primary); transform: translateY(-3px); }
        .gallery-item.add-new { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 2px dashed rgba(255,255,255,0.1); cursor: pointer; color: var(--text-gray); gap: 10px; }
        .gallery-item.add-new:hover { border-color: var(--primary); color: var(--primary); }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-item .actions { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; pointer-events: none; }
        .gallery-item:hover .actions { opacity: 1; pointer-events: all; }
        .toast { position: fixed; bottom: 24px; right: 24px; background: #333; color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; transform: translateY(100px); opacity: 0; transition: 0.3s; z-index: 1000; display: flex; align-items: center; gap: 10px; }
        .toast.show { transform: translateY(0); opacity: 1; }
    </style>
</head>
<body>
    <aside class="sidebar">
        <div class="sidebar-logo">THE <span>3</span> STUDIO</div>
        <nav class="sidebar-nav">
            <a href="index.php"><i class="fa-solid fa-house"></i> 대시보드</a>
            <a href="portfolio.php"><i class="fa-solid fa-folder-open"></i> 포트폴리오</a>
            <a href="clients.php"><i class="fa-solid fa-building"></i> 클라이언트</a>
            <a href="team.php"><i class="fa-solid fa-users"></i> 팀 관리</a>
            <a href="journey.php"><i class="fa-solid fa-route"></i> 성장 여정</a>
            <a href="hero.php" class="active"><i class="fa-solid fa-image"></i> 히어로 설정</a>
            <a href="stats.php"><i class="fa-solid fa-chart-bar"></i> 성과 수치</a>
            <a href="contacts.php"><i class="fa-solid fa-envelope"></i> 문의 내역</a>
        </nav>
    </aside>

    <main class="main">
        <h1>히어로 섹션 관리</h1>

        <?php if($success): ?><div class="alert alert-success"><?= $success ?></div><?php endif; ?>
        <?php if($error): ?><div class="alert alert-danger"><?= $error ?></div><?php endif; ?>

        <div class="card">
            <h2 style="font-size: 1.1rem; margin-bottom: 20px;">메인 텍스트 및 효과 설정</h2>
            <form method="POST">
                <input type="hidden" name="action" value="save_settings">
                <div class="form-group"><label>Sub-title (Hi, We are 등)</label><input type="text" name="hero_subtitle" value="<?= htmlspecialchars($subtitle) ?>"></div>
                <div class="form-group"><label>Main Title (강조되는 문구)</label><input type="text" name="hero_title" value="<?= htmlspecialchars($title) ?>"></div>
                <div class="form-group"><label>Description (부제목 설명)</label><textarea name="hero_description" rows="2"><?= htmlspecialchars($description) ?></textarea></div>
                <div class="form-group"><label>Long Description (섹션 하단 상세 설명)</label><textarea name="hero_long_description" rows="3"><?= htmlspecialchars($longDescription) ?></textarea></div>
                <div class="form-group"><label>컨설팅 슬롯 (남은 자리)</label><input type="text" name="hero_slots_left" value="<?= htmlspecialchars($slotsLeft) ?>" style="width:80px;"></div>
                <div class="form-group"><label>Spline 3D URL</label><input type="text" name="hero_bg_url" value="<?= htmlspecialchars($bgUrl) ?>"></div>
                <button type="submit" class="btn btn-primary"><i class="fa-solid fa-save"></i> 설정값 저장</button>
            </form>
        </div>

        <div class="card">
            <h2 style="font-size: 1.1rem; margin-bottom: 20px;">이미지 카드 아카이브 (Fan Layout)</h2>
            <div class="gallery">
                <div class="gallery-item add-new" onclick="document.getElementById('hidden_file_input').click();">
                    <i class="fa-solid fa-circle-plus" style="font-size:2rem;"></i>
                    <span>이미지 추가</span>
                </div>
                <form id="upload_form" method="POST" enctype="multipart/form-data" style="display:none;">
                    <input type="hidden" name="action" value="add_slide">
                    <input type="file" id="hidden_file_input" name="slide_image" onchange="document.getElementById('upload_form').submit();" accept="image/*">
                </form>

                <?php foreach($carousel as $c): ?>
                    <?php $imgSrc = str_starts_with($c['image_path'], 'http') ? $c['image_path'] : UPLOAD_URL . $c['image_path']; ?>
                    <div class="gallery-item" id="slide-<?= $c['id'] ?>">
                        <img src="<?= htmlspecialchars($imgSrc) ?>" alt="Slide" loading="lazy">
                        <div class="actions">
                            <button type="button" class="btn btn-danger" onclick="deleteSlide(<?= $c['id'] ?>)">
                                <i class="fa-solid fa-trash"></i> 삭제
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </main>

    <div id="toast" class="toast">삭제되었습니다.</div>

    <script>
    async function deleteSlide(id) {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        
        try {
            const res = await fetch('api/admin_api.php?action=hero_delete&id=' + id);
            const data = await res.json();
            
            if (data.success) {
                const el = document.getElementById('slide-' + id);
                el.style.transform = 'scale(0) rotate(10deg)';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 300);
                showToast('성공적으로 삭제되었습니다.');
            } else {
                alert('삭제 실패: ' + (data.error || '연결 오류'));
            }
        } catch (e) {
            alert('오류 발생: ' + e.message);
        }
    }

    function showToast(msg) {
        const t = document.getElementById('toast');
        t.innerText = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
    }
    </script>
</body>
</html>
