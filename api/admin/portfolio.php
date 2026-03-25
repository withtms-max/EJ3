<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
?>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 Studio | 포트폴리오 관리</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --primary: #0066ff;
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

        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .btn-primary {
            background: var(--primary);
            color: #fff;
        }

        .btn-primary:hover {
            background: #4a25c9;
        }

        .btn-danger {
            background: transparent;
            color: var(--danger);
            border: 1px solid var(--danger);
            padding: 6px 12px;
            font-size: 12px;
        }

        .btn-danger:hover {
            background: var(--danger);
            color: #fff;
        }

        .btn-edit {
            background: transparent;
            color: var(--text-gray);
            border: 1px solid var(--border);
            padding: 6px 12px;
            font-size: 12px;
        }

        .btn-edit:hover {
            border-color: var(--primary);
            color: var(--primary);
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
            letter-spacing: 0.5px;
        }

        tr:last-child td {
            border-bottom: none;
        }

        tr:hover td {
            background: var(--surface2);
        }

        .tag {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 99px;
            font-size: 11px;
            font-weight: 600;
        }

        .tag-branding {
            background: rgba(168, 85, 247, 0.15);
            color: #c084fc;
        }

        .tag-consulting {
            background: rgba(59, 130, 246, 0.15);
            color: #60a5fa;
        }

        .tag-video {
            background: rgba(234, 179, 8, 0.15);
            color: #fde047;
        }

        .tag-integrated {
            background: rgba(34, 197, 94, 0.15);
            color: #4ade80;
        }

        .featured-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--success);
            display: inline-block;
        }

        /* Modal */
        .modal-backdrop {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 200;
            align-items: center;
            justify-content: center;
        }

        .modal-backdrop.show {
            display: flex;
        }

        .modal {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 32px;
            width: 100%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
        }

        .modal h2 {
            font-size: 18px;
            margin-bottom: 24px;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-group label {
            display: block;
            color: var(--text-gray);
            font-size: 13px;
            margin-bottom: 6px;
        }

        .form-control {
            width: 100%;
            padding: 10px 14px;
            background: var(--surface2);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }

        .form-control:focus {
            border-color: var(--primary);
        }

        select.form-control option {
            background: #1a1a1a;
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        textarea.form-control {
            min-height: 80px;
            resize: vertical;
        }

        .modal-footer {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 24px;
        }

        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 14px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 999;
            display: none;
        }

        .toast.show {
            display: block;
        }

        .check-label {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-gray);
            font-size: 14px;
            cursor: pointer;
        }
    </style>
</head>

<body>
    <aside class="sidebar">
        <div class="sidebar-logo">THE <span>3</span> STUDIO</div>
        <nav class="sidebar-nav">
            <a href="index.php"><i class="fa-solid fa-house"></i> 대시보드</a>
            <a href="portfolio.php" class="active"><i class="fa-solid fa-folder-open"></i> 포트폴리오</a>
            <a href="clients.php"><i class="fa-solid fa-building"></i> 클라이언트</a>
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
            <h1><i class="fa-solid fa-folder-open" style="color:var(--primary)"></i> 포트폴리오 관리</h1>
            <div style="display:flex; gap:10px;">
                <a href="3d_master_pc.php" class="btn btn-edit" style="background:var(--primary-light); color:var(--primary); border:none;"><i class="fa-solid fa-cube"></i> PC 3D 배치</a>
                <a href="3d_master_mobile.php" class="btn btn-edit" style="background:rgba(255, 60, 130, 0.1); color:#ff3c82; border:none;"><i class="fa-solid fa-mobile-screen"></i> 모바일 3D 배치</a>
                <button class="btn btn-primary" onclick="openModal()"><i class="fa-solid fa-plus"></i> 새 작업물 추가</button>
            </div>
        </div>

        <table id="portfolio-table">
            <thead>
                <tr>
                    <th>썸네일</th>
                    <th>제목</th>
                    <th>카테고리</th>
                    <th>클라이언트</th>
                    <th>연도</th>
                    <th>홈노출</th>
                    <th>상태</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody id="portfolio-tbody">
                <tr>
                    <td colspan="8" style="text-align:center;color:#555;padding:40px">로딩 중...</td>
                </tr>
            </tbody>
        </table>
    </main>

    <!-- 추가/수정 모달 -->
    <div class="modal-backdrop" id="modal">
        <div class="modal">
            <h2 id="modal-title">새 작업물 추가</h2>
            <form id="portfolio-form" enctype="multipart/form-data">
                <input type="hidden" id="f-id" name="id">
                <input type="hidden" id="f-existing-thumbnail" name="existing_thumbnail">
                <div class="form-row">
                    <div class="form-group">
                        <label>제목 *</label>
                        <input type="text" id="f-title" name="title" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>슬러그 (URL) <span style="color:#888;font-size:11px;">자동생성</span></label>
                        <input type="text" id="f-slug" name="slug" class="form-control"
                            placeholder="global-brand-identity" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>카테고리</label>
                        <select id="f-category" name="category" class="form-control">
                            <option value="branding">Branding Design</option>
                            <option value="consulting">Business Consulting</option>
                            <option value="video">Video Production</option>
                            <option value="integrated">Integrated</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>클라이언트</label>
                        <input type="text" id="f-client" name="client" class="form-control">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>카드 크기 (3D 갤러리용)</label>
                        <select id="f-card-size" name="card_size" class="form-control">
                            <option value="normal">일반형 (Normal)</option>
                            <option value="tall">세로형 (Tall 숏폼)</option>
                            <option value="wide">가로 와이드 (Wide)</option>
                            <option value="large">크게 (Large)</option>
                            <option value="square">정사각형 (Square)</option>
                        </select>
                    </div>
                    <div class="form-group" style="display:flex; gap:16px;">
                        <div style="flex:1;">
                            <label>연도</label>
                            <input type="number" id="f-year" name="year" class="form-control" value="2025">
                        </div>
                        <div style="flex:1;">
                            <label>정렬 순서</label>
                            <input type="number" id="f-sort" name="sort_order" class="form-control" value="0">
                        </div>
                    </div>
                </div>
                <div class="form-row" style="background: rgba(223, 255, 0, 0.05); padding: 15px; border-radius: 12px; border: 1px dashed rgba(223, 255, 0, 0.2); margin-bottom: 20px;">
                    <p style="font-size: 13px; color: #dfff00; margin-bottom: 12px; font-weight: 700;"><i class="fa-solid fa-circle-info"></i> 3D 배치는 '3D 마스터' 메뉴에서 직접 하실 수 있으므로 좌표 입력칸을 제거했습니다.</p>
                    <div style="display: flex; gap: 20px;">
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
                            <input type="checkbox" id="f-show-gallery" name="show_in_gallery" value="1" checked style="width:18px; height:18px; accent-color:var(--primary);">
                            3D 메인 갤러리에 노출
                        </label>
                        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 14px;">
                            <input type="checkbox" id="f-show-list" name="show_in_list" value="1" checked style="width:18px; height:18px; accent-color:var(--primary);">
                            상세 리스트(Work)에 노출
                        </label>
                    </div>
                </div>
                <div class="form-group">
                    <label>섬네일 이미지</label>
                    <div id="f-thumbnail-preview" style="display:none;margin-bottom:8px;">
                        <video id="f-thumbnail-vid" src="" style="height:80px;border-radius:8px;object-fit:cover;border:1px solid #333;display:none;" controls muted></video>
                        <img id="f-thumbnail-img" src="" alt="" style="height:80px;border-radius:8px;object-fit:cover;border:1px solid #333;">
                        <p style="font-size:12px;color:#666;margin-top:4px;" id="f-thumbnail-name"></p>
                    </div>
                    <input type="file" id="f-thumbnail" name="thumbnail" class="form-control" accept="image/*,video/*">
                    <p style="font-size:12px;color:#666;margin-top:6px;">• 동영상(mp4, webm) 또는 이미지. 선택 안하면 기존 파일 유지</p>
                </div>
                <div class="form-group">
                    <label>도전 과제 (Challenge)</label>
                    <textarea id="f-challenge" name="challenge" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label>솔루션 (Solution)</label>
                    <textarea id="f-solution" name="solution" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label>결과 (Result)</label>
                    <textarea id="f-result" name="result" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <label>태그 (콤마 구분)</label>
                    <input type="text" id="f-tags" name="tags" class="form-control" placeholder="BI, 로고, 패키지">
                </div>

                <!-- 갤러리 이미지 (저장 후 쳐이늤 작동) -->
                <div class="form-group" id="gallery-section" style="display:none;">
                    <label style="color:#fff;margin-bottom:10px;display:block;">포트폴리오 갤러리 이미지 <span style="color:#666;font-size:12px;">(5MB 이하 이미지)</span></label>
                    <div id="gallery-preview" style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px;"></div>
                    <div style="display:flex;gap:10px;align-items:center;">
                        <input type="file" id="gallery-file" accept="image/*" multiple class="form-control" style="flex:1;">
                        <button type="button" class="btn btn-primary" onclick="uploadGalleryImages()" style="white-space:nowrap;"><i class="fa-solid fa-plus"></i> 이미지 추가</button>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="check-label">
                            <input type="checkbox" id="f-featured" name="is_featured" value="1">
                            홈 페이지에 노출
                        </label>
                    </div>
                    <div class="form-group">
                        <label>상태</label>
                        <select id="f-status" name="status" class="form-control">
                            <option value="published">공개</option>
                            <option value="draft">비공개</option>
                        </select>
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
        const categoryMap = { branding: 'branding', consulting: 'consulting', video: 'video', integrated: 'integrated' };
        const categoryLabel = { branding: 'Branding', consulting: 'Consulting', video: 'Video', integrated: 'Integrated' };

        async function loadPortfolio() {
            const tbody = document.getElementById('portfolio-tbody');
            try {
                const res = await fetch(API + '?action=portfolio_list&t=' + Date.now());
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch(e) {
                    console.error('Portfolio list response was not JSON:', text);
                    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#ef4444;padding:40px">서버 응답 오류 (데이터 형식이 올바르지 않습니다)</td></tr>';
                    return;
                }

                if (!data || !data.length) {
                    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#555;padding:40px">등록된 작업물이 없습니다.</td></tr>';
                    return;
                }
                tbody.innerHTML = data.map(item => `
        <tr>
            <td>${item.thumbnail ? (
                /\.(mp4|webm|avi|mov)$/i.test(item.thumbnail) 
                ? `<video src="/${item.thumbnail}" style="width:56px;height:40px;object-fit:cover;border-radius:6px;" muted loop autoplay></video>`
                : `<img src="/${item.thumbnail}" style="width:56px;height:40px;object-fit:cover;border-radius:6px;">`
            ) : '<span style="color:#444">없음</span>'}</td>
            <td><strong>${item.title}</strong><br><small style="color:#555">${item.slug}</small></td>
            <td><span class="tag tag-${item.category}">${categoryLabel[item.category] || item.category}</span></td>
            <td>${item.client || '-'}</td>
            <td>${item.year || '-'}</td>
            <td>${item.is_featured == '1' ? '<span class="featured-dot"></span>' : ''}</td>
            <td><span style="color:${item.status === 'published' ? '#4ade80' : '#888'}">${item.status === 'published' ? '공개' : '비공개'}</span></td>
            <td style="display:flex;gap:8px">
                <button class="btn btn-edit" onclick='editItem(${JSON.stringify(item)})'>수정</button>
                <button class="btn btn-danger" onclick="deleteItem(${item.id})">삭제</button>
            </td>
        </tr>
    `).join('');
            } catch (err) {
                console.error('Load portfolio error:', err);
                tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#ef4444;padding:40px">네트워크 오류가 발생했습니다.</td></tr>';
            }
        }

        function openModal(data = null) {
            document.getElementById('modal').classList.add('show');
            document.getElementById('modal-title').textContent = data ? '작업물 수정' : '새 작업물 추가';
            document.getElementById('f-id').value = data?.id || '';
            document.getElementById('f-title').value = data?.title || '';

            // 슬러그: 있으면 유지, 없으면 제목으로 자동생성
            const slug = data?.slug || '';
            const autoSlug = (data?.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            document.getElementById('f-slug').value = slug || autoSlug || '';

            document.getElementById('f-category').value = data?.category || 'branding';
            document.getElementById('f-client').value = data?.client || '';
            document.getElementById('f-card-size').value = data?.card_size || 'normal';
            document.getElementById('f-year').value = data?.year || new Date().getFullYear();
            document.getElementById('f-sort').value = data?.sort_order || 0;
            document.getElementById('f-show-gallery').checked = data ? (data.show_in_gallery == '1') : true;
            document.getElementById('f-show-list').checked = data ? (data.show_in_list == '1') : true;
            document.getElementById('f-challenge').value = data?.challenge || '';
            document.getElementById('f-solution').value = data?.solution || '';
            document.getElementById('f-result').value = data?.result || '';
            document.getElementById('f-tags').value = data?.tags || '';
            document.getElementById('f-featured').checked = data?.is_featured == 1;
            document.getElementById('f-status').value = data?.status || 'published';

            // 섬네일 미리보기
            const thumbPreview = document.getElementById('f-thumbnail-preview');
            const thumbImg = document.getElementById('f-thumbnail-img');
            const thumbVid = document.getElementById('f-thumbnail-vid');
            const thumbName = document.getElementById('f-thumbnail-name');
            const existingThumb = document.getElementById('f-existing-thumbnail');
            
            existingThumb.value = data?.thumbnail || '';
            
            if (data?.thumbnail) {
                const isVideo = /\.(mp4|webm|avi|mov)$/i.test(data.thumbnail);
                if(isVideo) {
                    thumbVid.src = '/' + data.thumbnail;
                    thumbVid.style.display = 'block';
                    thumbImg.style.display = 'none';
                } else {
                    thumbImg.src = '/' + data.thumbnail;
                    thumbImg.style.display = 'block';
                    thumbVid.style.display = 'none';
                }
                thumbName.textContent = '현재: ' + data.thumbnail.split('/').pop();
                thumbPreview.style.display = 'block';
            } else {
                thumbPreview.style.display = 'none';
            }

            // 갤러리 섹션: 수정(id 있을 때)만 보이기
            const gallSec = document.getElementById('gallery-section');
            if (data?.id) {
                gallSec.style.display = '';
                loadGalleryImages(data.id);
            } else {
                gallSec.style.display = 'none';
                document.getElementById('gallery-preview').innerHTML = '';
            }
        }
        function closeModal() { 
            document.getElementById('modal').classList.remove('show'); 
            document.getElementById('portfolio-form').reset();
            document.getElementById('f-id').value = '';
            document.getElementById('f-thumbnail-preview').style.display = 'none';
            document.getElementById('f-show-gallery').checked = true;
            document.getElementById('f-show-list').checked = true;
        }
        function editItem(item) { openModal(item); }

        // 갤러리 이미지 로드
        async function loadGalleryImages(portfolioId) {
            const preview = document.getElementById('gallery-preview');
            preview.innerHTML = '<span style="color:#666;font-size:13px;">로딩 중...</span>';
            const res = await fetch(`${API}?action=portfolio_images_list&portfolio_id=${portfolioId}`);
            const images = await res.json();
            if (!images.length) { preview.innerHTML = '<span style="color:#666;font-size:13px;">갤러리 이미지 없음</span>'; return; }
            preview.innerHTML = images.map(img => `
                <div style="position:relative;width:80px;height:80px;border-radius:8px;overflow:hidden;background:#111;">
                    <img src="/${img.image_path}" style="width:100%;height:100%;object-fit:cover;">
                    <button onclick="deleteGalleryImage(${img.id},${document.getElementById('f-id').value})"
                        style="position:absolute;top:2px;right:2px;background:rgba(239,68,68,0.85);border:none;color:#fff;border-radius:4px;width:20px;height:20px;cursor:pointer;font-size:12px;line-height:1;padding:0;">✕</button>
                </div>`).join('');
        }

        // 갤러리 이미지 삭제
        async function deleteGalleryImage(imageId, portfolioId) {
            if (!confirm('이 이미지를 삭제할까요?')) return;
            await fetch(`${API}?action=portfolio_images_delete&id=${imageId}`);
            loadGalleryImages(portfolioId);
        }

        // 갤러리 이미지 추가 업로드
        async function uploadGalleryImages() {
            const pid = document.getElementById('f-id').value;
            if (!pid) { showToast('먼저 작업물을 저장해주세요.', true); return; }
            const files = document.getElementById('gallery-file').files;
            if (!files.length) { showToast('이미지를 선택해주세요.', true); return; }
            const formData = new FormData();
            formData.append('portfolio_id', pid);
            for (let f of files) formData.append('images[]', f);
            const res = await fetch(`${API}?action=portfolio_images_add`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.success) {
                showToast(`이미지 ${data.added.length}장 추가 완료!`);
                document.getElementById('gallery-file').value = '';
                loadGalleryImages(pid);
            } else {
                showToast('업로드 실패', true);
            }
        }

        async function deleteItem(id) {
            if (!confirm('정말 삭제하시겠습니까?')) return;
            try {
                const res = await fetch(`${API}?action=portfolio_delete&id=${id}&t=${Date.now()}`);
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch(e) {
                    console.error('Server response was not JSON:', text);
                    showToast('서버 응답 오류 (로그 확인)', true);
                    return;
                }

                if (data.success) {
                    showToast('성공적으로 삭제되었습니다.');
                    loadPortfolio();
                } else {
                    showToast('삭제 실패: ' + (data.error || '알 수 없는 오류'), true);
                }
            } catch (err) {
                console.error('Delete error:', err);
                showToast('네트워크 오류가 발생했습니다.', true);
            }
        }

        document.getElementById('portfolio-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (document.getElementById('f-featured').checked) formData.set('is_featured', '1');
            else formData.set('is_featured', '0');
            
            // 노출 스위치 값 강제 설정
            formData.set('show_in_gallery', document.getElementById('f-show-gallery').checked ? '1' : '0');
            formData.set('show_in_list', document.getElementById('f-show-list').checked ? '1' : '0');
            try {
                const res = await fetch(API + '?action=portfolio_save', { method: 'POST', body: formData });
                const text = await res.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch(e) {
                    console.error('Server response was not JSON:', text);
                    showToast('서버 응답 오류 (로그 확인)', true);
                    return;
                }

                if (data.success) {
                    closeModal();
                    showToast('저장되었습니다!');
                    loadPortfolio();
                } else {
                    showToast('오류: ' + (data.error || '저장 실패'), true);
                }
            } catch(err) {
                console.error('Fetch error:', err);
                showToast('네트워크 오류가 발생했습니다.', true);
            }
        });

        function showToast(msg, isError = false) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.style.borderColor = isError ? '#ef4444' : '#5c3ce6';
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), 3000);
        }

        // 제목 입력 시 슬러그 자동 생성 (슬러그가 비어있을 때만)
        document.getElementById('f-title').addEventListener('input', function () {
            const slugField = document.getElementById('f-slug');
            if (!slugField.value) {
                slugField.value = this.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            }
        });

        document.getElementById('modal').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal(); });
        loadPortfolio();
    </script>
</body>

</html>