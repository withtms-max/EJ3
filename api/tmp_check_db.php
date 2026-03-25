<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'includes/config.php';
$db = getDB();
if (!$db) {
    echo "DB Connection Failed\n";
    exit;
}
try {
    $items = $db->query("SELECT id, title, gallery_x, gallery_y, gallery_z, gallery_mobile_x, gallery_mobile_y, gallery_mobile_z FROM portfolio")->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
