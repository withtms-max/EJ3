<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 Studio | 클라이언트 관리</title>
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

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; display: flex; }

        /* Sidebar Styles */
        .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; position: fixed; height: 100vh; overflow-y: auto; }
        .sidebar-logo { padding: 24px 20px; border-bottom: 1px solid var(--border); font-size: 18px; font-weight: 900; background: linear-gradient(180deg, #fff, #aaa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .sidebar-nav a { display: flex; align-items: center; gap: 10px; padding: 11px 20px; color: var(--text-gray); text-decoration: none; font-size: 14px; border-left: 3px solid transparent; transition: all 0.2s; }
        .sidebar-nav a:hover, .sidebar-nav a.active { color: #fff; background: var(--primary-light); border-left-color: var(--primary); }
        .sidebar-nav a i { width: 16px; text-align: center; }
        .sidebar-bottom { margin-top: auto; padding: 16px 20px; border-top: 1px solid var(--border); }
        .sidebar-bottom a { color: var(--text-gray); text-decoration: none; font-size: 13px; display: flex; align-items: center; gap: 8px; }

        .main { margin-left: var(--sidebar-w); flex: 1; padding: 32px; }
        .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
        .topbar h1 { font-size: 24px; font-weight: 700; }

        .btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
        .btn-primary { background: var(--primary); color: #fff; }
        .btn-primary:hover { background: #4a2ec2; transform: translateY(-2px); }
        .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text-gray); }
        .btn-outline:hover { border-color: var(--text-gray); color: var(--text); }

        /* Client Grid/Table */
        .client-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .client-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 16px; transition: 0.2s; }
        .client-card:hover { border-color: var(--primary); }
        
        .client-header { display: flex; align-items: center; gap: 16px; }
        .client-logo { width: 48px; height: 48px; border-radius: 8px; background: #fff; object-fit: contain; padding: 4px; border: 1px solid var(--border); }
        .client-name-wrap { flex: 1; }
        .client-name { font-size: 18px; font-weight: 700; margin-bottom: 2px; }
        .client-cat { font-size: 12px; color: var(--primary); font-weight: 600; }

        .client-details { font-size: 13px; color: var(--text-gray); line-height: 1.6; }
        .detail-item { margin-bottom: 4px; }
        .detail-item strong { color: #eee; min-width: 60px; display: inline-block; }

        .client-actions { display: flex; gap: 8px; margin-top: auto; border-top: 1px solid var(--border); padding-top: 16px; }
        .action-btn { background: var(--surface2); color: var(--text-gray); border: none; padding: 8px; border-radius: 6px; cursor: pointer; flex: 1; font-size: 12px; font-weight: 600; border: 1px solid transparent; }
        .action-btn:hover { color: var(--text); border-color: var(--border); }
        .action-btn.delete:hover { border-color: var(--danger); color: var(--danger); }

        /* Modal */
        .modal { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: none; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal.active { display: flex; }
        .modal-content { background: var(--surface); border: 1px solid var(--border); width: 100%; max-width: 500px; border-radius: 16px; padding: 32px; max-height: 90vh; overflow-y: auto; }
        .modal-header { margin-bottom: 24px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-gray); margin-bottom: 8px; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; color: #fff; font-family: inherit; font-size: 14px; }
        .form-group input:focus { border-color: var(--primary); outline: none; }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    </style>
</head>
<body>
    <aside class="sidebar">
        <div class="sidebar-logo">THE <span>3</span> STUDIO</div>
        <nav class="sidebar-nav">
            <a href="index.php"><i class="fa-solid fa-house"></i> 대시보드</a>
            <a href="portfolio.php"><i class="fa-solid fa-folder-open"></i> 포트폴리오</a>
            <a href="clients.php" class="active"><i class="fa-solid fa-building"></i> 클라이언트</a>
            <a href="team.php"><i class="fa-solid fa-users"></i> 팀 관리</a>
            <a href="journey.php"><i class="fa-solid fa-route"></i> 성장 여정</a>
            <a href="hero.php"><i class="fa-solid fa-image"></i> 히어로 설정</a>
            <a href="stats.php"><i class="fa-solid fa-chart-bar"></i> 성과 수치</a>
            <a href="contacts.php"><i class="fa-solid fa-envelope"></i> 문의 내역</a>
        </nav>
        <div class="sidebar-bottom">
            <a href="logout.php"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</a>
        </div>
    </aside>

    <main class="main">
        <div class="topbar">
            <h1>클라이언트 관리</h1>
            <button class="btn btn-primary" onclick="openModal()"><i class="fa-solid fa-plus"></i> 새 기록 추가</button>
        </div>

        <div class="client-grid" id="client-grid">
            <!-- JS로 채워짐 -->
            <div style="grid-column:1/-1; text-align:center; padding:100px; color:var(--text-gray);">불러오는 중...</div>
        </div>
    </main>

    <!-- Modal -->
    <div class="modal" id="client-modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">클라이언트 추가</h2>
            </div>
            <form id="client-form">
                <input type="hidden" name="id" id="f-id">
                <input type="hidden" name="existing_logo" id="f-existing-logo">
                
                <div class="form-group">
                    <label>클라이언트명 (필수)</label>
                    <input type="text" name="name" id="f-name" required placeholder="예: (주)대한전자">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>비즈니스 분류</label>
                        <input type="text" name="category" id="f-category" placeholder="예: 요식업, IT">
                    </div>
                    <div class="form-group">
                        <label>계약일/시작일</label>
                        <input type="date" name="contract_date" id="f-contract-date">
                    </div>
                </div>

                <div class="form-group">
                    <label>진행 과업명</label>
                    <input type="text" name="project_name" id="f-project-name" placeholder="예: 브랜딩 및 홍보영상 제작">
                </div>

                <div class="form-group">
                    <label>기록 및 메모</label>
                    <textarea name="description" id="f-description" rows="3" placeholder="미팅 내용, 특이사항 등 자유롭게 기록"></textarea>
                </div>

                <div class="form-group">
                    <label>로고 이미지</label>
                    <input type="file" name="logo" id="f-logo" accept="image/*">
                    <div id="logo-preview" style="margin-top:10px; display:none;">
                        <img src="" style="max-height:40px; border:1px solid #333; padding:5px; background:#fff;">
                    </div>
                </div>

                <div style="display:flex; gap:12px; margin-top:32px;">
                    <button type="button" class="btn btn-outline" style="flex:1" onclick="closeModal()">취소</button>
                    <button type="submit" class="btn btn-primary" style="flex:2">저장하기</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        const API = 'api/admin_api.php';

        async function loadClients() {
            const grid = document.getElementById('client-grid');
            try {
                const res = await fetch(`${API}?action=clients_list`);
                const data = await res.json();
                
                if(!data || data.length === 0) {
                    grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:100px; color:var(--text-gray);">등록된 클라이언트가 없습니다.</div>';
                    return;
                }

                grid.innerHTML = data.map(c => {
                    const json = JSON.stringify(c).replace(/'/g, "&apos;");
                    return `
                    <div class="client-card">
                        <div class="client-header">
                            <img src="/${c.logo_path || 'img/placeholder_logo.png'}" class="client-logo" alt="">
                            <div class="client-name-wrap">
                                <div class="client-name">${c.name}</div>
                                <div class="client-cat">${c.category || '기타'}</div>
                            </div>
                        </div>
                        <div class="client-details">
                            <div class="detail-item"><strong>과업명:</strong> ${c.project_name || '-'}</div>
                            <div class="detail-item"><strong>계약일:</strong> ${c.contract_date || '-'}</div>
                            <div class="detail-item" style="margin-top:8px; border-top:1px solid #1a1a1a; padding-top:8px; font-size:12px; color:#777;">
                                ${c.description || '기록된 내용이 없습니다.'}
                            </div>
                        </div>
                        <div class="client-actions">
                            <button class="action-btn" onclick='openModal(${json})'><i class="fa-solid fa-pen"></i> 수정</button>
                            <button class="action-btn delete" onclick="deleteClient(${c.id})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    `;
                }).join('');
            } catch(e) {
                grid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:100px; color:var(--danger);">데이터를 불러오는 중 오류가 발생했습니다.</div>';
            }
        }

        function openModal(data = null) {
            const modal = document.getElementById('client-modal');
            const form = document.getElementById('client-form');
            const title = document.getElementById('modal-title');
            
            form.reset();
            document.getElementById('f-id').value = '';
            document.getElementById('f-existing-logo').value = '';
            document.getElementById('logo-preview').style.display = 'none';

            if(data) {
                title.textContent = '클라이언트 수정';
                document.getElementById('f-id').value = data.id;
                document.getElementById('f-name').value = data.name;
                document.getElementById('f-category').value = data.category || '';
                document.getElementById('f-project-name').value = data.project_name || '';
                document.getElementById('f-contract-date').value = data.contract_date || '';
                document.getElementById('f-description').value = data.description || '';
                document.getElementById('f-existing-logo').value = data.logo_path || '';
                
                if(data.logo_path) {
                    const preview = document.getElementById('logo-preview');
                    preview.querySelector('img').src = '/' + data.logo_path;
                    preview.style.display = 'block';
                }
            } else {
                title.textContent = '새 클라이언트 기록';
            }
            modal.classList.add('active');
        }

        function closeModal() {
            document.getElementById('client-modal').classList.remove('active');
        }

        document.getElementById('client-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const res = await fetch(`${API}?action=clients_save`, {
                method: 'POST',
                body: formData
            });
            const result = await res.json();
            if(result.success) {
                closeModal();
                loadClients();
            } else {
                alert('저장 중 오류가 발생했습니다.');
            }
        };

        async function deleteClient(id) {
            if(!confirm('삭제하시겠습니까? 포트폴리오 연동 정보는 유지되지만 목록에서 사라집니다.')) return;
            const res = await fetch(`${API}?action=clients_delete&id=${id}`);
            const result = await res.json();
            if(result.success) loadClients();
        }

        window.onload = loadClients;
    </script>
</body>
</html>
