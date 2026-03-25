<?php
require_once __DIR__ . '/../includes/config.php';
$db = getDB();
if (!$db) die("DB Connection Failed");

try {
    echo "Creating contacts table if not exists...\n";
    $sql = "CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_name TEXT,
        email TEXT,
        service TEXT,
        message TEXT,
        status TEXT DEFAULT 'new',
        ip_address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    $db->exec($sql);
    echo "✅ Table 'contacts' is ready.\n";

    // Check tables again
    $res = $db->query("SELECT name FROM sqlite_master WHERE type='table'");
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        echo "Table found: " . $row['name'] . "\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
