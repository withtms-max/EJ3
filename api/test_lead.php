<?php
require_once __DIR__ . '/../includes/config.php';
$db = getDB();

echo "Simulating chatbot submission...\n";
try {
    $stmt = $db->prepare("INSERT INTO contacts (company_name, email, service, message, status, ip_address) VALUES (?,?,?,?,?,?)");
    $stmt->execute(['Test Boss', '010-0000-0000', '챗봇 문의', '테스트 메시지', 'new', '127.0.0.1']);
    echo "✅ Test lead inserted.\n";

    $res = $db->query("SELECT * FROM contacts");
    while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
        print_r($row);
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
