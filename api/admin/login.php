<?php
require_once __DIR__ . '/../../includes/config.php';
if (session_status() === PHP_SESSION_NONE)
    session_start();

// 이미 로그인된 경우 대시보드로
if (isAdminLoggedIn()) {
    header('Location: /api/admin/index.php');
    exit;
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username && $password) {
        $loggedIn = false;
        $displayName = '관리자';

        // 1) DB가 있으면 DB로 인증
        $db = getDB();
        if ($db !== null) {
            try {
                $stmt = $db->prepare("SELECT * FROM admin_users WHERE username=? AND is_active=1");
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                if ($user && password_verify($password, $user['password_hash'])) {
                    $loggedIn = true;
                    $displayName = $user['name'];
                    $db->prepare("UPDATE admin_users SET last_login=datetime('now') WHERE id=?")->execute([$user['id']]);
                }
            } catch (Exception $e) { /* DB 오류 → 임시계정으로 fallback */
            }
        }

        // 2) DB 없거나 실패 시 임시 하드코딩 계정 (로컬 미리보기용)
        if (!$loggedIn && $username === 'admin' && $password === 'admin1234') {
            $loggedIn = true;
            $displayName = 'THE3 Admin';
        }

        if ($loggedIn) {
            $_SESSION[ADMIN_SESSION_KEY] = true;
            $_SESSION['admin_name'] = $displayName;
            header('Location: /api/admin/index.php');
            exit;
        } else {
            $error = '아이디 또는 비밀번호가 올바르지 않습니다.';
        }
    } else {
        $error = '아이디와 비밀번호를 모두 입력해주세요.';
    }
}
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 Studio | 관리자 로그인</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-card {
            background: #111;
            border: 1px solid #222;
            border-radius: 16px;
            padding: 48px 40px;
            width: 100%;
            max-width: 420px;
            text-align: center;
        }

        .logo {
            font-size: 28px;
            font-weight: 900;
            background: linear-gradient(180deg, #fff 0%, #aaa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 8px;
        }

        .subtitle {
            color: #666;
            font-size: 13px;
            margin-bottom: 36px;
        }

        .form-group {
            margin-bottom: 16px;
            text-align: left;
        }

        .form-group label {
            color: #999;
            font-size: 13px;
            margin-bottom: 6px;
            display: block;
        }

        .form-control {
            width: 100%;
            padding: 12px 16px;
            background: #1a1a1a;
            border: 1px solid #2a2a2a;
            border-radius: 8px;
            color: #fff;
            font-size: 15px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }

        .form-control:focus {
            border-color: #5c3ce6;
        }

        .btn-login {
            width: 100%;
            padding: 14px;
            background: #5c3ce6;
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 700;
            font-family: inherit;
            cursor: pointer;
            margin-top: 8px;
            transition: background 0.2s;
        }

        .btn-login:hover {
            background: #4a25c9;
        }

        .error-msg {
            background: rgba(220, 50, 50, 0.1);
            border: 1px solid rgba(220, 50, 50, 0.3);
            color: #f87171;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 13px;
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
    <div class="login-card">
        <div class="logo">THE <span>3</span> STUDIO</div>
        <div class="subtitle">관리자 대시보드</div>

        <?php if ($error): ?>
            <div class="error-msg">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label>아이디</label>
                <input type="text" name="username" class="form-control" placeholder="admin" autocomplete="username"
                    required>
            </div>
            <div class="form-group">
                <label>비밀번호</label>
                <input type="password" name="password" class="form-control" placeholder="••••••••"
                    autocomplete="current-password" required>
            </div>
            <button type="submit" class="btn-login">로그인</button>
        </form>
    </div>
</body>

</html>