<?php
require_once __DIR__ . '/../includes/config.php';
try {
    $db = getDB();
    // Add card_size column
    $db->exec("ALTER TABLE portfolio ADD COLUMN card_size VARCHAR(20) DEFAULT 'normal'");
    echo "Database updated successfully.\n";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'duplicate') !== false || strpos($e->getMessage(), 'already exists') !== false) {
        echo "Column card_size already exists.\n";
    } else {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>
