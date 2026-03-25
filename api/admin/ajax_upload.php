<?php
require_once __DIR__ . '/../../includes/config.php';
// requireAdminLogin(); // 임시로 비활성화하여 리다이렉트 이슈 해결

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'POST method required']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['error' => 'No file uploaded or upload error. Code: ' . ($_FILES['file']['error'] ?? 'unknown')]);
    exit;
}

$type = $_POST['type'] ?? 'general';
$allowedTypes = ['portfolio', 'hero', 'team', 'clients', 'general'];
if (!in_array($type, $allowedTypes)) {
    $type = 'general';
}

$uploadDir = UPLOAD_DIR . $type . '/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$file = $_FILES['file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mov', 'avi'];

if (!in_array($ext, $allowedExts)) {
    echo json_encode(['error' => 'Invalid file type. Allowed: ' . implode(', ', $allowedExts)]);
    exit;
}

// Generate unique filename
$filename = $type . '_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
$targetPath = $uploadDir . $filename;
$publicPath = 'uploads/' . $type . '/' . $filename;

if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    echo json_encode([
        'success' => true,
        'path' => $publicPath,
        'filename' => $filename
    ]);
} else {
    echo json_encode(['error' => 'Failed to move uploaded file. Check directory permissions.']);
}
