<?php
require_once __DIR__ . '/../../includes/config.php';
if (session_status() === PHP_SESSION_NONE)
    session_start();
unset($_SESSION[ADMIN_SESSION_KEY]);
unset($_SESSION['admin_name']);
header('Location: /admin/login.php');
exit;
