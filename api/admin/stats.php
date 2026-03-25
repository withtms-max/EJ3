<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 Studio | 성과 수치 관리</title>
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
            --success: #22c55e;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; }

        .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; height: 100vh; overflow-y: auto; }
        .sidebar-logo { padding: 24px 20px; border-bottom: 1px solid var(--border); font-size: 18px; font-weight: 900; background: linear-gradient(180deg, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sidebar-nav a { display: flex; align-items: center; gap: 10px; padding: 11px 20px; color: var(--text-gray); text-decoration: none; font-size: 14px; border-left: 3px solid transparent; transition: all 0.2s; }
        .sidebar-nav a:hover, .sidebar-nav a.active { color: #fff; background: var(--primary-light); border-left-color: var(--primary); }
        .sidebar-nav a i { width: 16px; text-align: center; }

        .main { margin-left: var(--sidebar-w); flex: 1; padding: 32px; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .topbar h1 { font-size: 24px; font-weight: 700; }

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .stats-item { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
        .stats-item label { display: block; font-size: 12px; color: var(--text-gray); margin-bottom: 8px; }
        .stats-item input { width: 100%; border: 1px solid var(--border); background: var(--surface2); color: #fff; padding: 10px; border-radius: 6px; font-family: inherit; font-size: 18px; font-weight: 700; }
        .stats-item input[type="text"].label-input { font-size: 14px; font-weight: 500; margin-bottom: 12px; }

        .btn { padding: 10px 24px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: 0.2s; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover { background: #4a2ec2; }
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
            <a href="stats.php" class="active"><i class="fa-solid fa-chart-bar"></i> 성과 수치</a>
            <a href="contacts.php"><i class="fa-solid fa-envelope"></i> 문의 내역</a>
        </nav>
    </aside>

    <main class="main">
        <div class="topbar">
            <h1>성과 수치 관리</h1>
            <button class="btn btn-primary" onclick="saveStats()">저장하기</button>
        </div>

        <div class="stats-grid" id="stats-grid">
            <!-- JS로 로드 -->
        </div>
    </main>

    <script>
        async function loadStats() {
            const grid = document.getElementById('stats-grid');
            const res = await fetch('/api/api.php?action=stats');
            const stats = await res.json();
            
            grid.innerHTML = stats.map(s => `
                <div class="stats-item" data-id="${s.id}">
                    <label>항목명</label>
                    <input type="text" class="label-input" value="${s.label}">
                    <label>수치 (숫자만 입력)</label>
                    <input type="text" class="value-input" value="${s.value}">
                </div>
            `).join('');
        }

        async function saveStats() {
            const items = Array.from(document.querySelectorAll('.stats-item')).map(el => ({
                id: el.dataset.id,
                label: el.querySelector('.label-input').value,
                value: el.querySelector('.value-input').value
            }));

            const res = await fetch('api/admin_api.php?action=stats_save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(items)
            });

            const result = await res.json();
            if(result.success) alert('저장되었습니다.');
            else alert('오류가 발생했습니다.');
        }

        window.onload = loadStats;
    </script>
</body>
</html>
