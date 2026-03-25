<?php
require_once __DIR__ . '/../../includes/config.php';
requireAdminLogin();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE3 Studio | Mobile 3D 배치 마스터</title>
    <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #222; display: flex; align-items: center; justify-content: center; }
        .phone {
            width: 375px; height: 812px;
            border: 10px solid #000;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            position: relative;
        }
        iframe { width: 100%; height: 100%; border: none; display: block; background: #000; }
        .back-btn { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.8); color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 20px; font-family: sans-serif; font-weight: bold; border: 1px solid rgba(255,255,255,0.2); z-index: 1000; }
    </style>
</head>
<body>
    <a href="portfolio.php" class="back-btn">← 대시보드로 돌아가기</a>
    <div class="phone">
        <iframe src="../../index.html#admin"></iframe>
    </div>
</body>
</html>
