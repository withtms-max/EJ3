<?php
require_once __DIR__ . '/../includes/config.php';

try {
    $db = getDB();
    if ($db === null) {
        die("No database connection available.");
    }

    $sql1 = "CREATE TABLE IF NOT EXISTS `site_settings` (
      `setting_key` VARCHAR(100) PRIMARY KEY,
      `setting_value` TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    $db->exec($sql1);

    $sql2 = "INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`) VALUES
    ('hero_subtitle', 'WE ARE'),
    ('hero_title', 'THE 3 STUDIO'),
    ('hero_particle_words', 'Brand Strategy, Visual Design, Video Production');";
    $db->exec($sql2);

    $sql3 = "CREATE TABLE IF NOT EXISTS `hero_carousel` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `image_path` VARCHAR(300) NOT NULL,
      `sort_order` INT DEFAULT 0,
      `is_active` TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
    $db->exec($sql3);

    $sql4 = "INSERT IGNORE INTO `hero_carousel` (`image_path`, `sort_order`, `is_active`) VALUES
    ('https://images.unsplash.com/photo-1616098001648-5225026210f8?auto=format&fit=crop&q=80', 1, 1),
    ('https://images.unsplash.com/photo-1600108343715-dd059ea9d20c?auto=format&fit=crop&q=80', 2, 1),
    ('https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80', 3, 1),
    ('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', 4, 1),
    ('https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80', 5, 1),
    ('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80', 6, 1),
    ('https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80', 7, 1);";
    $db->exec($sql4);

    echo "Successfully initialized site_settings and hero_carousel tables.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
