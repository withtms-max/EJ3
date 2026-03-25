<?php
require_once __DIR__ . '/../includes/config.php';
echo "DB_TYPE: " . DB_TYPE . "\n";
if (DB_TYPE === 'sqlite') {
    echo "SQLite Path: " . DB_SQLITE_PATH . "\n";
}

try {
    $res = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
    // ...
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        $tableName = $row['name'];
        echo "\nTable: $tableName\n";
        $info = $db->query("PRAGMA table_info($tableName)");
        while ($i = $info->fetch(PDO::FETCH_ASSOC)) {
            print_r($i);
        }
    }
} catch (Exception $e) {
    echo $e->getMessage();
}
