<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>팀 관리 | THE3 Admin</title>
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

        /* Team Grid (admin preview) */
        .team-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
        .team-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .team-card-img { width: 100%; aspect-ratio: 3/4; overflow: hidden; background: #1a1a1a; position: relative; }
        .team-card-img img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1); }
        .team-card-img .no-photo { display: flex; align-items: center; justify-content: center; height: 100%; color: #333; font-size: 3rem; }
        .team-card-body { padding: 16px; }
        .team-card-role { font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
        .team-card-name { font-size: 1.1rem; font-weight: 900; margin-bottom: 6px; }
        .team-card-bio { font-size: 0.82rem; color: var(--text-gray); line-height: 1.5; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .team-card-actions { display: flex; gap: 8px; }
        .team-card-actions .btn { padding: 6px 14px; font-size: 0.8rem; }
        .badge-inactive { display: inline-block; font-size: 0.7rem; background: #333; color: #999; padding: 2px 8px; border-radius: 99px; margin-left: 6px; }

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
        textarea.form-control { resize: vertical; min-height: 80px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .check-label { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; cursor: pointer; margin-top: 8px; }
        .modal-footer { padding: 16px 28px 24px; display: flex; justify-content: flex-end; gap: 10px; }
        .current-photo { display: none; margin-bottom: 10px; }
        .current-photo img { height: 80px; border-radius: 8px; object-fit: cover; border: 1px solid #333; }
        .current-photo p { font-size: 11px; color: #666; margin-top: 4px; }

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
            <a href="team.php" class="nav-item active"><i class="fa-solid fa-users"></i> 팀 관리</a>
            <a href="journey.php" class="nav-item"><i class="fa-solid fa-route"></i> 성장 여정</a>
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
            <h2><i class="fa-solid fa-users" style="color:var(--primary);margin-right:10px;"></i>팀 관리</h2>
            <button class="btn btn-primary" onclick="openModal()">
                <i class="fa-solid fa-plus"></i> 팀원 추가
            </button>
        </div>

        <div class="team-admin-grid" id="team-grid">
            <div style="grid-column:1/-1;text-align:center;padding:40px;color:#555;">불러오는 중...</div>
        </div>
    </main>

    <!-- 팀원 추가/수정 모달 -->
    <div class="modal-backdrop" id="modal">
        <div class="modal">
            <div class="modal-header">
                <h3 id="modal-title">팀원 추가</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <form id="team-form" enctype="multipart/form-data">
                <div class="modal-body">
                    <input type="hidden" id="f-id" name="id">
                    <div class="form-row">
                        <div class="form-group">
                            <label>이름 *</label>
                            <input type="text" id="f-name" name="name" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>직책/역할 *</label>
                            <input type="text" id="f-role" name="role" class="form-control" placeholder="Brand Design CEO" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>전문 분야</label>
                        <input type="text" id="f-specialty" name="specialty" class="form-control" placeholder="브랜드 아이덴티티 · 비주얼 전략">
                    </div>
                    <div class="form-group">
                        <label>소개 글</label>
                        <textarea id="f-bio" name="bio" class="form-control" placeholder="팀원 소개를 입력해 주세요..."></textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Instagram URL</label>
                            <input type="text" id="f-instagram" name="instagram" class="form-control" placeholder="https://instagram.com/...">
                        </div>
                        <div class="form-group">
                            <label>LinkedIn URL</label>
                            <input type="text" id="f-linkedin" name="linkedin" class="form-control" placeholder="https://linkedin.com/...">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>프로필 사진</label>
                        <div class="current-photo" id="current-photo">
                            <img id="current-photo-img" src="" alt="">
                            <p id="current-photo-name"></p>
                        </div>
                        <input type="file" id="f-photo" name="photo" class="form-control" accept="image/*">
                        <p style="font-size:12px;color:#555;margin-top:6px;">• 선택 안하면 기존 사진 유지 (3:4 비율 권장)</p>
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

        async function loadTeam() {
            const grid = document.getElementById('team-grid');
            const res = await fetch(`${API}?action=team_list`);
            const members = await res.json();

            if (!members.length) {
                grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#555;">등록된 팀원이 없습니다.</div>';
                return;
            }

            grid.innerHTML = members.map(m => {
                const itemJson = JSON.stringify(m).replace(/'/g, "&apos;");
                return `
                <div class="team-card">
                    <div class="team-card-img">
                        ${m.photo
                            ? `<img src="/${m.photo}?v=${new Date().getTime()}" alt="${m.name}">`
                            : '<div class="no-photo"><i class="fa-solid fa-user"></i></div>'}
                        ${m.is_active == 0 ? '<div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.7);color:#f59e0b;font-size:11px;padding:3px 8px;border-radius:99px;font-weight:700;">비공개</div>' : ''}
                    </div>
                    <div class="team-card-body">
                        <div class="team-card-role">${m.role || ''}</div>
                        <div class="team-card-name">${m.name}</div>
                        <div class="team-card-bio">${m.bio || m.specialty || '소개 없음'}</div>
                        <div class="team-card-actions">
                            <button class="btn btn-edit" onclick='editItem(${itemJson})'><i class="fa-solid fa-pen"></i> 수정</button>
                            <button class="btn btn-danger" onclick="deleteItem(${m.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }

        function openModal(data = null) {
            document.getElementById('modal').classList.add('show');
            document.getElementById('modal-title').textContent = data ? '팀원 수정' : '팀원 추가';
            document.getElementById('f-id').value = data?.id || '';
            document.getElementById('f-name').value = data?.name || '';
            document.getElementById('f-role').value = data?.role || '';
            document.getElementById('f-specialty').value = data?.specialty || '';
            document.getElementById('f-bio').value = data?.bio || '';
            document.getElementById('f-instagram').value = data?.instagram || '';
            document.getElementById('f-linkedin').value = data?.linkedin || '';
            document.getElementById('f-sort').value = data?.sort_order || 0;
            document.getElementById('f-active').checked = data ? data.is_active == 1 : true;

            // 현재 사진 미리보기
            const photoWrap = document.getElementById('current-photo');
            const photoImg = document.getElementById('current-photo-img');
            const photoName = document.getElementById('current-photo-name');
            if (data?.photo) {
                photoImg.src = '/' + data.photo;
                photoName.textContent = '현재: ' + data.photo.split('/').pop();
                photoWrap.style.display = 'block';
            } else {
                photoWrap.style.display = 'none';
            }
        }

        function closeModal() { document.getElementById('modal').classList.remove('show'); }
        function editItem(item) { openModal(item); }

        async function deleteItem(id) {
            if (!confirm('정말 이 팀원을 삭제하시겠습니까?')) return;
            // team_delete api (없으면 기본 팀 관리 API 사용)
            await fetch(`${API}?action=team_delete&id=${id}`);
            showToast('삭제되었습니다.');
            loadTeam();
        }

        document.getElementById('team-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (document.getElementById('f-active').checked) formData.set('is_active', '1');
            else formData.set('is_active', '0');

            const res = await fetch(`${API}?action=team_save`, { method: 'POST', body: formData });
            const data = await res.json();

            if (data.success || data.id) {
                showToast(document.getElementById('f-id').value ? '수정 완료!' : '팀원이 추가되었습니다!');
                closeModal();
                loadTeam();
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

        loadTeam();
    </script>
</body>
</html>
