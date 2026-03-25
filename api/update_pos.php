<?php
require 'includes/config.php';
$pdo = getDB();
$cols = ['gallery_x', 'gallery_y', 'gallery_z'];
foreach($cols as $col) {
    try {
        $pdo->exec("ALTER TABLE portfolio ADD COLUMN $col INT DEFAULT NULL");
        echo "Added $col\n";
    } catch(PDOException $e) {
        $msg = $e->getMessage();
        if(strpos($msg, 'duplicate column') !== false || strpos($msg, 'exists') !== false) {
             echo "$col exists\n";
        } else {
             echo "Error on $col: " . $msg . "\n";
        }
    }
}
?>
