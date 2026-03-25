<?php
// ─────────────────────────────────────────────────────────
// THE3 Studio — DB / 사이트 설정
// 실제 서버 배포 시 아래 DB_ 값을 변경하세요
// ─────────────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'root');        // 배포 시 변경
define('DB_PASS', '');            // 배포 시 변경
define('DB_NAME', 'the3studio'); // 배포 시 변경
define('DB_CHARSET', 'utf8mb4');

define('DB_TYPE', 'sqlite'); // 'mysql' or 'sqlite'
$dbAbsPath = realpath(__DIR__ . '/../db/the3studio.sqlite');
define('DB_SQLITE_PATH', $dbAbsPath);

// Vercel/서버 환경에서는 HTTP_HOST를 사용하고, 로컬에서는 기본값 사용
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
$host = $_SERVER['HTTP_HOST'] ?? 'localhost:8080';
define('SITE_URL', $protocol . '://' . $host);

define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('UPLOAD_URL', SITE_URL . '/uploads/');
define('ADMIN_SESSION_KEY', 'the3_admin_logged_in');

// ─── DB 연결 (SQLite 우선 지원) ──────────────────────────
function getDB(): ?PDO
{
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    try {
        if (DB_TYPE === 'sqlite') {
            // 절대 경로로 확실하게 고정
            $dbPath = __DIR__ . '/../db/the3studio.sqlite';
            if (!file_exists($dbPath)) {
                // 상위 폴더 체크 (Vercel 대응용)
                $dbPath = dirname(__DIR__) . '/db/the3studio.sqlite';
            }
            $pdo = new PDO("sqlite:" . $dbPath);
        }
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // 에러 원인을 파악하기 위해 로그를 남기거나 출력 (개발용)
        error_log("DB Connection Error: " . $e->getMessage());
        $pdo = null; 
    }
    return $pdo;
}

function jsonResponse(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function isAdminLoggedIn(): bool
{
    if (session_status() === PHP_SESSION_NONE)
        session_start();
    return isset($_SESSION[ADMIN_SESSION_KEY]) && $_SESSION[ADMIN_SESSION_KEY] === true;
}

function requireAdminLogin(): void
{
    if (!isAdminLoggedIn()) {
        header('Location: /admin/login.php');
        exit;
    }
}
