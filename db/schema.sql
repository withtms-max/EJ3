-- THE3 Studio Database Schema
-- MySQL 5.7+
-- 카페24에서 DB 생성 후 이 파일을 phpMyAdmin에서 실행하세요

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- =============================================
-- 1. 포트폴리오 (Work / Case Study)
-- =============================================
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE COMMENT 'URL용 슬러그 (영문, 소문자, 하이픈)',
  `title` VARCHAR(200) NOT NULL,
  `category` ENUM('branding', 'consulting', 'video', 'integrated') NOT NULL,
  `client` VARCHAR(100),
  `thumbnail` VARCHAR(300) COMMENT '썸네일 이미지 경로',
  `hero_image` VARCHAR(300) COMMENT '상세 페이지 히어로 이미지',
  `challenge` TEXT COMMENT '클라이언트 도전과제',
  `solution` TEXT COMMENT '우리의 솔루션',
  `result` TEXT COMMENT '결과 및 성과',
  `tags` VARCHAR(300) COMMENT '태그 (콤마 구분)',
  `year` YEAR,
  `is_featured` TINYINT(1) DEFAULT 0 COMMENT '홈 페이지 노출 여부',
  `sort_order` INT DEFAULT 0,
  `status` ENUM('draft', 'published') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='포트폴리오/케이스스터디';

-- =============================================
-- 2. 포트폴리오 이미지 갤러리 (다중 이미지)
-- =============================================
CREATE TABLE IF NOT EXISTS `portfolio_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `portfolio_id` INT NOT NULL,
  `image_path` VARCHAR(300) NOT NULL,
  `caption` VARCHAR(200),
  `sort_order` INT DEFAULT 0,
  FOREIGN KEY (`portfolio_id`) REFERENCES `portfolio`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================
-- 3. 클라이언트 로고
-- =============================================
CREATE TABLE IF NOT EXISTS `clients` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `logo_path` VARCHAR(300) NOT NULL,
  `website` VARCHAR(200),
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='클라이언트 로고';

-- =============================================
-- 4. 팀/대표 소개
-- =============================================
CREATE TABLE IF NOT EXISTS `team` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(100) NOT NULL COMMENT '직책/역할',
  `specialty` VARCHAR(100) COMMENT '전문 분야',
  `bio` TEXT COMMENT '소개 글',
  `photo` VARCHAR(300),
  `linkedin` VARCHAR(200),
  `instagram` VARCHAR(200),
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='팀 멤버';

-- =============================================
-- 5. 성과 수치 (홈 페이지 숫자들)
-- =============================================
CREATE TABLE IF NOT EXISTS `stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `label` VARCHAR(100) NOT NULL COMMENT '라벨 (예: 누적 프로젝트)',
  `value` VARCHAR(50) NOT NULL COMMENT '값 (예: 200+)',
  `icon` VARCHAR(50) COMMENT 'FontAwesome 아이콘 클래스',
  `sort_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='홈 성과 수치';

-- =============================================
-- 6. 문의 내역
-- =============================================
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `company_name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `service` ENUM('consulting', 'branding', 'video', 'integrated') NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'read', 'replied') DEFAULT 'new',
  `ip_address` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='문의 내역';

-- =============================================
-- 7. 어드민 계정
-- =============================================
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100),
  `last_login` DATETIME,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='어드민 계정';

-- =============================================
-- 기본 데이터 삽입
-- =============================================

-- 어드민 계정 (비밀번호: admin1234 → 실제 운영 시 변경 필수!)
INSERT INTO `admin_users` (`username`, `password_hash`, `name`) VALUES
('admin', '$2y$12$LxNjNK7z2OXx.3BNXzyCiOHWxXuH.3EYJh3l8K2Dde1ij/VHsFBS2', 'THE3 관리자');

-- 성과 수치 기본값
INSERT INTO `stats` (`label`, `value`, `icon`, `sort_order`) VALUES
('누적 프로젝트', '120+', 'fa-solid fa-folder-open', 1),
('클라이언트', '80+', 'fa-solid fa-handshake', 2),
('재계약률', '92%', 'fa-solid fa-arrow-trend-up', 3),
('업력 (년)', '6', 'fa-solid fa-calendar-check', 4);

-- 팀 기본값 (실제 정보로 교체 필요)
INSERT INTO `team` (`name`, `role`, `specialty`, `bio`, `sort_order`) VALUES
('CEO 1', 'Business Consulting CEO', '비즈니스 전략 · 시장 분석', 'THE3 Studio의 비즈니스 컨설팅을 이끄는 전략가입니다. 심층적인 데이터 기반 인사이트로 클라이언트의 성장을 가속합니다.', 1),
('CEO 2', 'Branding Design CEO', '브랜드 아이덴티티 · 비주얼 전략', 'THE3 Studio의 브랜딩 디렉터입니다. 브랜드의 본질을 발굴하고 압도적인 비주얼로 구현합니다.', 2),
('CEO 3', 'Video Production CEO', '영상 제작 · 모션 그래픽', 'THE3 Studio의 영상 디렉터입니다. 영화 같은 정교함으로 브랜드 스토리에 생명력을 불어넣습니다.', 3);

-- =============================================
-- 8. 사이트 설정 (Hero Section 텍스트 등)
-- =============================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` VARCHAR(100) PRIMARY KEY,
  `setting_value` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사이트 전역 설정';

-- 기본 설정 데이터 삽입
INSERT IGNORE INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('hero_subtitle', 'WE ARE'),
('hero_title', 'THE 3 STUDIO'),
('hero_particle_words', 'Brand Strategy, Visual Design, Video Production'),
('hero_top_phrase', '장사하기도 바쁜 사장님, 브랜딩은');

-- =============================================
-- 9. 히어로 캐러셀 (Hero Carousel)
-- =============================================
CREATE TABLE IF NOT EXISTS `hero_carousel` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_path` VARCHAR(300) NOT NULL,
  `sort_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='히어로 캐러셀 이미지';

-- 기본 캐러셀 데이터 (기존 하드코딩된 이미지들)
INSERT IGNORE INTO `hero_carousel` (`image_path`, `sort_order`, `is_active`) VALUES
('https://images.unsplash.com/photo-1616098001648-5225026210f8?auto=format&fit=crop&q=80', 1, 1),
('https://images.unsplash.com/photo-1600108343715-dd059ea9d20c?auto=format&fit=crop&q=80', 2, 1),
('https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80', 3, 1),
('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', 4, 1),
('https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80', 5, 1),
('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80', 6, 1),
('https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80', 7, 1);
