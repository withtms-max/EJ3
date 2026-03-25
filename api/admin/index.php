<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
if (session_status() === PHP_SESSION_NONE)
    session_start();
$adminName = $_SESSION['admin_name'] ?? '관리자';

// 미읽은 문의 수 및 통계 변수 초기화
$unread = $totalPortfolio = $totalClients = $totalTeam = $totalJourney = 0;
$currentTheme = 'dark'; // 기본값

try {
    $db = getDB();
    if ($db !== null) {
        $unread = (int) $db->query("SELECT COUNT(*) FROM contacts WHERE status='new'")->fetchColumn();
        $totalPortfolio = (int) $db->query("SELECT COUNT(*) FROM portfolio")->fetchColumn();
        $totalClients = (int) $db->query("SELECT COUNT(*) FROM clients")->fetchColumn();
        $totalTeam = (int) $db->query("SELECT COUNT(*) FROM team")->fetchColumn();
        $totalJourney = (int) $db->query("SELECT COUNT(*) FROM journey")->fetchColumn();
        
        $themeResult = $db->query("SELECT setting_value FROM site_settings WHERE setting_key='theme'")->fetchColumn();
        if ($themeResult) $currentTheme = $themeResult;
    }
} catch (Exception $e) {
    // 에러 발생 시 기본값 유지
}
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 Studio | 어드민 대시보드</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
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
            --warning: #f59e0b;
            --danger: #ef4444;
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

        /* ── Sidebar ── */
        .sidebar {
            width: var(--sidebar-w);
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100vh;
            overflow-y: auto;
            z-index: 100;
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

        .sidebar-label {
            padding: 20px 20px 8px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #444;
        }

        .sidebar-nav a {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 11px 20px;
            color: var(--text-gray);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            border-left: 3px solid transparent;
            transition: all 0.2s;
        }

        .sidebar-nav a:hover,
        .sidebar-nav a.active {
            color: var(--text);
            background: var(--primary-light);
            border-left-color: var(--primary);
        }

        .sidebar-nav a i {
            width: 16px;
            text-align: center;
        }

        .badge {
            margin-left: auto;
            background: var(--danger);
            color: #fff;
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 99px;
            font-weight: 700;
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

        /* ── Main ── */
        .main {
            margin-left: var(--sidebar-w);
            flex: 1;
            padding: 32px;
            min-height: 100vh;
        }

        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
        }

        .topbar h1 {
            font-size: 24px;
            font-weight: 700;
        }

        .topbar-right {
            color: var(--text-gray);
            font-size: 14px;
        }

        /* ── Stat Cards ── */
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-bottom: 32px;
        }

        .stat-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 20px 24px;
        }

        .stat-card .label {
            font-size: 12px;
            color: var(--text-gray);
            margin-bottom: 8px;
        }

        .stat-card .value {
            font-size: 32px;
            font-weight: 900;
            color: var(--primary);
        }

        .stat-card .icon {
            float: right;
            color: #333;
            font-size: 24px;
            margin-top: 4px;
        }

        /* ── Menu Grid ── */
        .menu-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
        }

        .menu-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 28px 24px;
            text-decoration: none;
            color: var(--text);
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .menu-card:hover {
            border-color: var(--primary);
            background: var(--primary-light);
            transform: translateY(-2px);
        }

        .menu-icon {
            width: 48px;
            height: 48px;
            background: var(--primary-light);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: var(--primary);
            flex-shrink: 0;
        }

        .menu-card h3 {
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 4px;
        }

        .menu-card p {
            font-size: 12px;
            color: var(--text-gray);
        }

        /* ── Quick actions ── */
        .section-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            margin-top: 32px;
        }

        @media(max-width: 768px) {

            .stat-grid,
            .menu-grid {
                grid-template-columns: 1fr 1fr;
            }

            .sidebar {
                display: none;
            }

            .main {
                margin-left: 0;
            }
        }
    </style>
</head>

<body>

    <!-- 사이드바 -->
    <aside class="sidebar">
        <div class="sidebar-logo">THE <span>3</span> STUDIO</div>
        <div class="sidebar-label">관리</div>
        <nav class="sidebar-nav">
            <a href="index.php" class="active"><i class="fa-solid fa-house"></i> 대시보드</a>
            <a href="portfolio.php"><i class="fa-solid fa-folder-open"></i> 포트폴리오</a>
            <a href="clients.php"><i class="fa-solid fa-building"></i> 클라이언트</a>
            <a href="team.php"><i class="fa-solid fa-users"></i> 팀 관리</a>
            <a href="journey.php"><i class="fa-solid fa-route"></i> 성장 여정</a>
            <a href="hero.php"><i class="fa-solid fa-image"></i> 히어로 설정</a>
            <a href="stats.php"><i class="fa-solid fa-chart-bar"></i> 성과 수치</a>
            <a href="contacts.php">
                <i class="fa-solid fa-envelope"></i> 문의 내역
                <?php if ($unread > 0): ?><span class="badge"><?= $unread ?></span><?php endif; ?>
            </a>
        </nav>
        <div class="sidebar-label">사이트</div>
        <nav class="sidebar-nav">
            <a href="/" target="_blank"><i class="fa-solid fa-external-link"></i> 사이트 보기</a>
        </nav>
        <div class="sidebar-bottom">
            <a href="logout.php"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</a>
        </div>
    </aside>

    <!-- 메인 콘텐츠 -->
    <main class="main">
        <div class="topbar">
            <h1>대시보드</h1>
            <div class="topbar-right" style="display:flex; align-items:center; gap:20px;">
                <div class="theme-switch-container">
                    <label style="font-size:12px; margin-right:8px; cursor:pointer;" for="themeToggle">
                        <i class="fa-solid <?= $currentTheme === 'light' ? 'fa-sun' : 'fa-moon' ?>"></i> 
                        테마: <strong><?= $currentTheme === 'light' ? '화이트' : '다크' ?></strong> 모드
                    </label>
                    <button id="themeToggleBtn" onclick="toggleTheme()" class="btn" style="padding:6px 12px; font-size:12px; border:1px solid var(--border); background:var(--surface2);">변경</button>
                    <input type="hidden" id="currentThemeVal" value="<?= $currentTheme ?>">
                </div>
                <div>안녕하세요, <strong><?= htmlspecialchars($adminName) ?></strong>님</div>
            </div>
        </div>

        <script type="module">
        import { db, doc, setDoc, getDoc } from '../../js/firebase-init.js';

        window.toggleTheme = async function() {
            const btn = document.getElementById('themeToggleBtn');
            const current = document.getElementById('currentThemeVal').value;
            const newTheme = current === 'dark' ? 'light' : 'dark';
            
            btn.disabled = true;
            btn.innerText = '저장 중...';

            try {
                await setDoc(doc(db, 'settings', 'site'), {
                    theme: newTheme,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
                location.reload();
            } catch (e) {
                alert('파이어스토어 저장 실패: ' + e.message);
            } finally {
                btn.disabled = false;
            }
        }

        // 페이지 로드 시 파이어스토어 설정으로 UI 강제 동기화
        async function syncUI() {
            try {
                const snap = await getDoc(doc(db, 'settings', 'site'));
                if (snap.exists()) {
                    const theme = snap.data().theme;
                    document.getElementById('currentThemeVal').value = theme;
                    
                    // 1. 텍스트 및 아이콘 업데이트
                    const label = document.querySelector('.theme-switch-container label strong');
                    const icon = document.querySelector('.theme-switch-container label i');
                    if (label) label.innerText = (theme === 'light' ? '화이트' : '다크');
                    if (icon) {
                        icon.className = (theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon');
                    }

                    // 2. 관리자 페이지 본체에도 라이트 모드 클래스 부여 (CSS 연동)
                    if (theme === 'light') {
                        document.body.classList.add('light-mode');
                        // 어드민용 미세 조정 (배경색 강제 변경)
                        document.body.style.backgroundColor = '#f4f4f7';
                        document.body.style.color = '#1c1c1e';
                    } else {
                        document.body.classList.remove('light-mode');
                        document.body.style.backgroundColor = '#0a0a0a';
                        document.body.style.color = '#fff';
                    }
                }
            } catch (e) { console.error('Sync Error:', e); }
        }
        syncUI();
        </script>

        <!-- 통계 카드 -->
        <div class="stat-grid">
            <div class="stat-card">
                <div class="label">포트폴리오</div>
                <div class="value">
                    <?= $totalPortfolio ?>
                </div>
                <i class="fa-solid fa-folder-open icon"></i>
            </div>
            <div class="stat-card">
                <div class="label">클라이언트</div>
                <div class="value">
                    <?= $totalClients ?>
                </div>
                <i class="fa-solid fa-building icon"></i>
            </div>
            <div class="stat-card">
                <div class="label">팀 멤버</div>
                <div class="value">
                    <?= $totalTeam ?>
                </div>
                <i class="fa-solid fa-users icon"></i>
            </div>
            <div class="stat-card">
                <div class="label">성장 여정</div>
                <div class="value">
                    <?= $totalJourney ?>
                </div>
                <i class="fa-solid fa-route icon"></i>
            </div>
            <div class="stat-card">
                <div class="label">신규 문의</div>
                <div class="value" style="color:<?= $unread > 0 ? 'var(--danger)' : 'var(--primary)' ?>">
                    <?= $unread ?>
                </div>
                <i class="fa-solid fa-envelope icon"></i>
            </div>
        </div>

        <!-- 관리 메뉴 -->
        <div class="section-title">빠른 관리</div>
        <div class="menu-grid">
            <a href="hero.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-images"></i></div>
                <div>
                    <h3>히어로 영역 관리</h3>
                    <p>메인 텍스트 및 슬라이드 관리</p>
                </div>
            </a>
            <a href="portfolio.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-folder-open"></i></div>
                <div>
                    <h3>포트폴리오 관리</h3>
                    <p>작업물 추가 · 수정 · 삭제</p>
                </div>
            </a>
            <a href="clients.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-building"></i></div>
                <div>
                    <h3>클라이언트 로고</h3>
                    <p>로고 업로드 · 관리</p>
                </div>
            </a>
            <a href="team.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-users"></i></div>
                <div>
                    <h3>팀 관리</h3>
                    <p>우리 팀 전문가 프로필 관리</p>
                </div>
            </a>

            <a href="journey.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-route"></i></div>
                <div>
                    <h3>성장 여정 관리</h3>
                    <p>우리의 성장 스토리 및 이력 관리</p>
                </div>
            </a>

            <a href="stats.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-chart-bar"></i></div>
                <div>
                    <h3>성과 수치</h3>
                    <p>홈 화면 숫자 수정</p>
                </div>
            </a>
            <a href="contacts.php" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-envelope"></i></div>
                <div>
                    <h3>문의 내역</h3>
                    <p>접수된 문의 확인</p>
                </div>
            </a>
            <a href="/" target="_blank" class="menu-card">
                <div class="menu-icon"><i class="fa-solid fa-external-link"></i></div>
                <div>
                    <h3>사이트 미리보기</h3>
                    <p>실제 사이트 확인</p>
                </div>
            </a>
        </div>
    </main>

</body>

</html>