<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>성장 여정 관리 | THE3 Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #5c3ce6; --bg: #0a0a0a; --surface: #111;
            --surface2: #1a1a1a; --border: #222; --text: #fff;
            --text-gray: #999; --sidebar-w: 240px;
            --success: #22c55e; --danger: #ef4444;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); display: flex; min-height: 100vh; }

        /* Sidebar */
        .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); padding: 24px 0; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; z-index: 100; }
        .sidebar-logo { padding: 0 20px 24px; border-bottom: 1px solid var(--border); }
        .sidebar-logo h1 { font-size: 1.1rem; font-weight: 900; }
        .sidebar-logo span { font-size: 0.7rem; color: var(--text-gray); }
        .sidebar-nav { padding: 16px 0; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 11px 20px; color: var(--text-gray); text-decoration: none; font-size: 0.88rem; font-weight: 600; transition: all 0.2s; }
        .nav-item:hover, .nav-item.active { color: #fff; background: rgba(255,255,255,0.05); }
        .nav-item.active { border-left: 3px solid var(--primary); }
        .nav-item i { width: 18px; text-align: center; }
        .sidebar-footer { padding: 16px 20px; border-top: 1px solid var(--border); }
        .sidebar-footer a { font-size: 0.8rem; color: var(--text-gray); text-decoration: none; }

        /* Main */
        .main { margin-left: var(--sidebar-w); flex: 1; padding: 32px; }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .page-header h2 { font-size: 1.5rem; font-weight: 900; }
        .btn { padding: 9px 18px; border: none; border-radius: 8px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover { background: #4a2ec7; }
        .btn-edit { background: #333; color: #fff; }
        .btn-danger { background: var(--danger); color: #fff; }

        /* Table Style */
        .data-table { width: 100%; border-collapse: collapse; background: var(--surface); border-radius: 16px; overflow: hidden; border: 1px solid var(--border); }
        .data-table th { background: #1a1a1a; padding: 16px 20px; text-align: left; font-size: 0.82rem; font-weight: 700; color: var(--text-gray); border-bottom: 1px solid var(--border); }
        .data-table td { padding: 18px 20px; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
        .data-table tr:last-child td { border-bottom: none; }
        .journey-title { font-weight: 900; margin-bottom: 4px; }
        .journey-subtitle { font-size: 0.8rem; color: var(--text-gray); }

        /* Modal */
        .modal-backdrop { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000; align-items: center; justify-content: center; padding: 20px; }
        .modal-backdrop.show { display: flex; }
        .modal { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; }
        .modal-header { padding: 24px 28px 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 1.1rem; font-weight: 900; }
        .modal-header .close-btn { background: none; border: none; color: var(--text-gray); font-size: 1.4rem; cursor: pointer; }
        .modal-body { padding: 24px 28px; }
        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 0.82rem; font-weight: 700; color: var(--text-gray); margin-bottom: 6px; }
        .form-control { width: 100%; padding: 10px 14px; background: #111; border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: inherit; font-size: 0.9rem; }
        .form-control:focus { outline: none; border-color: var(--primary); }
        textarea.form-control { resize: vertical; min-height: 100px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .check-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; margin-top: 8px; }
        .modal-footer { padding: 16px 28px 24px; display: flex; justify-content: flex-end; gap: 10px; }

        /* Toast */
        .toast { position: fixed; bottom: 24px; right: 24px; background: #333; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 0.88rem; z-index: 9999; opacity: 0; transition: opacity 0.3s; }
        .toast.show { opacity: 1; }
    </style>
</head>
<body>
    <aside class="sidebar">
        <div class="sidebar-logo">THE <span>3</span> STUDIO</div>
        <nav class="sidebar-nav">
            <a href="index.php" class="nav-item"><i class="fa-solid fa-house"></i> 대시보드</a>
            <a href="portfolio.php" class="nav-item"><i class="fa-solid fa-folder-open"></i> 포트폴리오</a>
            <a href="clients.php" class="nav-item"><i class="fa-solid fa-building"></i> 클라이언트</a>
            <a href="team.php" class="nav-item"><i class="fa-solid fa-users"></i> 팀 관리</a>
            <a href="journey.php" class="nav-item active"><i class="fa-solid fa-route"></i> 성장 여정</a>
            <a href="hero.php" class="nav-item"><i class="fa-solid fa-image"></i> 히어로 설정</a>
            <a href="stats.php" class="nav-item"><i class="fa-solid fa-chart-bar"></i> 성과 수치</a>
            <a href="contacts.php" class="nav-item"><i class="fa-solid fa-envelope"></i> 문의 내역</a>
        </nav>
        <div class="sidebar-footer">
            <a href="logout.php"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</a>
        </div>
    </aside>

    <main class="main">
        <div class="page-header">
            <h2><i class="fa-solid fa-route" style="color:var(--primary);margin-right:10px;"></i>성장 여정 관리</h2>
            <button class="btn btn-primary" onclick="openModal()">
                <i class="fa-solid fa-plus"></i> 여정 추가
            </button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th width="80">순서</th>
                    <th width="150">기간</th>
                    <th>여정 제목/요약</th>
                    <th width="120">상태</th>
                    <th width="140">관리</th>
                </tr>
            </thead>
            <tbody id="journey-list">
                <tr><td colspan="5" style="text-align:center;padding:40px;">불러오는 중...</td></tr>
            </tbody>
        </table>
    </main>

    <!-- 여정 추가/수정 모달 -->
    <div class="modal-backdrop" id="modal">
        <div class="modal">
            <div class="modal-header">
                <h3 id="modal-title">여정 추가</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <form id="journey-form">
                <div class="modal-body">
                    <input type="hidden" id="f-id" name="id">
                    <div class="form-row">
                        <div class="form-group">
                            <label>분야/타이틀 *</label>
                            <input type="text" id="f-title" name="title" class="form-control" placeholder="기획 & 전략" required>
                        </div>
                        <div class="form-group">
                            <label>기간 *</label>
                            <input type="text" id="f-period" name="period" class="form-control" placeholder="2018 - 2022" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>한 줄 요약 (서브타이틀)</label>
                        <input type="text" id="f-subtitle" name="subtitle" class="form-control" placeholder="대형 광고대행사 출신 기획">
                    </div>
                    <div class="form-group">
                        <label>상세 설명</label>
                        <textarea id="f-description" name="description" class="form-control" placeholder="수백억 예산의 브랜드를 성공시키던..."></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>정렬 순서</label>
                            <input type="number" id="f-sort" name="sort_order" class="form-control" value="0">
                        </div>
                        <div class="form-group" style="display:flex;align-items:flex-end;">
                            <label class="check-label">
                                <input type="checkbox" id="f-active" name="is_active" value="1" checked>
                                웹사이트에 노출
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-edit" onclick="closeModal()">취소</button>
                    <button type="submit" class="btn btn-primary">저장</button>
                </div>
            </form>
        </div>
    </div>

    <div class="toast" id="toast"></div>

    <script>
        const API = 'api/admin_api.php';

        async function loadJourney() {
            const list = document.getElementById('journey-list');
            const res = await fetch(`${API}?action=journey_list`);
            const items = await res.json();

            if (!items.length) {
                list.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:40px;">등록된 여정이 없습니다.</td></tr>';
                return;
            }

            list.innerHTML = items.map(item => {
                const itemJson = JSON.stringify(item).replace(/'/g, "&apos;");
                return `
                <tr>
                    <td style="font-weight:700;">${item.sort_order}</td>
                    <td style="color:var(--primary);font-weight:700;">${item.period}</td>
                    <td>
                        <div class="journey-title">${item.title}</div>
                        <div class="journey-subtitle">${item.subtitle || ''}</div>
                    </td>
                    <td>
                        <span style="font-size:0.75rem; background: ${item.is_active == 1 ? 'rgba(34,197,94,0.1)' : '#222'}; color: ${item.is_active == 1 ? 'var(--success)' : '#666'}; padding: 4px 10px; border-radius: 99px; font-weight:700;">
                            ${item.is_active == 1 ? '노출 중' : '비공개'}
                        </span>
                    </td>
                    <td>
                        <div style="display:flex;gap:8px;">
                            <button class="btn btn-edit" style="padding:5px 10px;" onclick='editItem(${itemJson})'><i class="fa-solid fa-pen"></i></button>
                            <button class="btn btn-danger" style="padding:5px 10px;" onclick="deleteItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
                `;
            }).join('');
        }

        function openModal(data = null) {
            document.getElementById('modal').classList.add('show');
            document.getElementById('modal-title').textContent = data ? '여정 수정' : '여정 추가';
            document.getElementById('f-id').value = data?.id || '';
            document.getElementById('f-title').value = data?.title || '';
            document.getElementById('f-period').value = data?.period || '';
            document.getElementById('f-subtitle').value = data?.subtitle || '';
            document.getElementById('f-description').value = data?.description || '';
            document.getElementById('f-sort').value = data?.sort_order || 0;
            document.getElementById('f-active').checked = data ? data.is_active == 1 : true;
        }

        function closeModal() { document.getElementById('modal').classList.remove('show'); }
        function editItem(item) { openModal(item); }

        async function deleteItem(id) {
            if (!confirm('정말 이 여정 항목을 삭제하시겠습니까?')) return;
            await fetch(`${API}?action=journey_delete&id=${id}`);
            showToast('삭제되었습니다.');
            loadJourney();
        }

        document.getElementById('journey-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (document.getElementById('f-active').checked) formData.set('is_active', '1');
            else formData.set('is_active', '0');

            const res = await fetch(`${API}?action=journey_save`, { method: 'POST', body: formData });
            const data = await res.json();

            if (data.success) {
                showToast(document.getElementById('f-id').value ? '수정 완료!' : '여정이 추가되었습니다!');
                closeModal();
                loadJourney();
            } else {
                showToast('저장 실패: ' + (data.error || '알 수 없는 오류'), true);
            }
        });

        function showToast(msg, err = false) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.style.background = err ? '#ef4444' : '#333';
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        loadJourney();
    </script>
</body>
</html>
