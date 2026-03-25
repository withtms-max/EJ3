<?php
require_once 'includes/config.php';
$db = getDB();
if (!$db) die("No DB");
$stmt = $db->query("SELECT * FROM site_settings");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['setting_key'] . ": " . $row['setting_value'] . "\n";
}
