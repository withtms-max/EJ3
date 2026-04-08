<?php
$data = file_get_contents('php://input');
file_put_contents('firebase_dump.json', $data);
?>
