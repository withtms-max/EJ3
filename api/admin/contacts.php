<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
$contacts = [];
$unread = [];
try {
    $db = getDB();
    if ($db !== null) {
        $contacts = $db->query("SELECT * FROM contacts ORDER BY created_at DESC")->fetchAll();
    }
} catch (Exception $e) {
    $contacts = [];
}
$unread = array_filter($contacts, fn($c) => $c['status'] === 'new');
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>THE3 Studio | 문의 관리</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #5c3ce6;
            --primary-light: rgba(92, 60, 230, 0.1);
            --bg: #0a0a0a;
            --surface: #111;
            --surface2: #1a1a1a;
            --border: #222;
            --text: #fff;
            --text-gray: #999;
            --sidebar-w: 240px;
            --danger: #ef4444;
            --success: #22c55e;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
        }

        .sidebar {
            width: var(--sidebar-w);
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
        }

        .sidebar-logo {
            padding: 24px 20px;
            border-bottom: 1px solid var(--border);
            font-size: 18px;
            font-weight: 900;
            background: linear-gradient(180deg, #fff, #aaa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 20px;
            color: var(--text-gray);
            text-decoration: none;
            font-size: 14px;
            border-left: 3px solid transparent;
            transition: all 0.2s;
        }

        .sidebar-nav a:hover,
        .sidebar-nav a.active {
            color: #fff;
            background: var(--primary-light);
            border-left-color: var(--primary);
        }

        .sidebar-nav a i {
            width: 16px;
            text-align: center;
        }

        .sidebar-bottom {
            margin-top: auto;
            padding: 16px 20px;
            border-top: 1px solid var(--border);
        }

        .sidebar-bottom a {
            color: var(--text-gray);
            text-decoration: none;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .sidebar-bottom a:hover {
            color: var(--danger);
        }

        .main {
            margin-left: var(--sidebar-w);
            flex: 1;
            padding: 32px;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }

        .topbar h1 {
            font-size: 22px;
            font-weight: 700;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: var(--surface);
            border-radius: 12px;
            overflow: hidden;
        }

        th,
        td {
            padding: 14px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
        }

        th {
            background: var(--surface2);
            color: var(--text-gray);
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
        }

        tr:last-child td {
            border-bottom: none;
        }

        .new-row td {
            background: rgba(92, 60, 230, 0.05);
        }

        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 99px;
            font-size: 11px;
            font-weight: 600;
        }

        .status-new {
            background: rgba(92, 60, 230, 0.2);
            color: #a78bfa;
        }

        .status-read {
            background: rgba(255, 255, 255, 0.05);
            color: #666;
        }

        .status-replied {
            background: rgba(34, 197, 94, 0.15);
            color: #4ade80;
        }

        .btn {
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-replied {
            background: transparent;
            color: var(--success);
            border: 1px solid var(--success);
        }

        .btn-replied:hover {
            background: var(--success);
            color: #000;
        }

        .msg-preview {
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: var(--text-gray);
            font-size: 13px;
        }

        .service-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            background: rgba(92, 60, 230, 0.15);
            color: #a78bfa;
        }
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
            <a href="hero.php"><i class="fa-solid fa-image"></i> 히어로 설정</a>
            <a href="stats.php"><i class="fa-solid fa-chart-bar"></i> 성과 수치</a>
            <a href="contacts.php" class="active"><i class="fa-solid fa-envelope"></i> 문의 내역</a>
        </nav>
        <div class="sidebar-bottom">
            <a href="logout.php"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</a>
        </div>
    </aside>

    <main class="main">
        <div class="topbar">
            <h1><i class="fa-solid fa-envelope" style="color:var(--primary)"></i> 문의 내역
                <?php if (count($unread) > 0): ?>
                    <span
                        style="background:var(--danger);color:#fff;font-size:12px;padding:2px 8px;border-radius:99px;margin-left:8px;">
                        <?= count($unread) ?> 신규
                    </span>
                <?php endif; ?>
            </h1>
        </div>

        <table>
            <thead>
                <tr>
                    <th>상태</th>
                    <th>회사/성함</th>
                    <th>이메일</th>
                    <th>관심분야</th>
                    <th>메시지</th>
                    <th>접수일</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($contacts as $c): ?>
                    <tr class="<?= $c['status'] === 'new' ? 'new-row' : '' ?>" id="row-<?= $c['id'] ?>">
                        <td>
                            <span class="status-badge status-<?= $c['status'] ?>">
                                <?= ['new' => '신규', 'read' => '읽음', 'replied' => '답변완료'][$c['status']] ?? $c['status'] ?>
                            </span>
                        </td>
                        <td><strong>
                                <?= htmlspecialchars($c['company_name']) ?>
                            </strong></td>
                        <td><a href="mailto:<?= $c['email'] ?>" style="color:#a78bfa">
                                <?= htmlspecialchars($c['email']) ?>
                            </a></td>
                        <td><span class="service-badge">
                                <?= htmlspecialchars($c['service']) ?>
                            </span></td>
                        <td class="msg-preview" title="<?= htmlspecialchars($c['message']) ?>">
                            <?= htmlspecialchars($c['message']) ?>
                        </td>
                        <td style="color:var(--text-gray);font-size:12px">
                            <?= date('Y-m-d H:i', strtotime($c['created_at'])) ?>
                        </td>
                        <td>
                            <div style="display:flex;gap:4px;">
                                <?php if ($c['status'] !== 'replied'): ?>
                                    <button class="btn btn-replied" onclick="markReplied(<?= $c['id'] ?>)">답변완료</button>
                                <?php endif; ?>
                                <button class="btn" style="background:#333;color:#eee;" onclick="deleteContact(<?= $c['id'] ?>)"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                <?php endforeach; ?>
                <?php if (!$contacts): ?>
                    <tr>
                        <td colspan="7" style="text-align:center;color:#555;padding:40px">문의 내역이 없습니다.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </main>

    <script>
        async function markReplied(id) {
            if(!confirm('답변 완료 처리하시겠습니까?')) return;
            await fetch(`api/admin_api.php?action=contacts_status&id=${id}&status=replied`);
            const row = document.getElementById('row-' + id);
            row.querySelector('.status-badge').textContent = '답변완료';
            row.querySelector('.status-badge').className = 'status-badge status-replied';
            const btn = row.querySelector('.btn-replied');
            if (btn) btn.remove();
        }

        async function deleteContact(id) {
            if(!confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
            const res = await fetch(`api/admin_api.php?action=contacts_delete&id=${id}`);
            const data = await res.json();
            if(data.success) {
                const row = document.getElementById('row-' + id);
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                row.style.transition = 'all 0.3s';
                setTimeout(() => row.remove(), 300);
            }
        }
    </script>
</body>

</html>