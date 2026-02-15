-- POZOR: Tento skript importujte přímo do vaší databáze v phpMyAdmin.
-- Verze opravená pro MySQL 8+ (odstraněno zastaralé INT(11))

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+02:00";

--
-- Struktura tabulky `services` (Ceník)
--

CREATE TABLE IF NOT EXISTS `services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration_minutes` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vyprazdnění tabulky před vložením
--
TRUNCATE TABLE `services`;

--
-- Vložení dat do tabulky `services`
--
INSERT INTO `services` (`id`, `title`, `description`, `price`, `duration_minutes`) VALUES
(1, 'Relaxační masáž', 'Jemná masáž pro uvolnění stresu a napětí svalů.', '1 200 Kč', 60),
(2, 'Hloubková regenerační masáž', 'Intenzivnější techniky zaměřené na hluboké svalové vrstvy.', '1 500 Kč', 60),
(3, 'Masáž s aromaterapií', 'Kombinace masáže a éterických olejů pro harmonizaci těla i duše.', '1 400 Kč', 60),
(4, 'Konzultace celostního zdraví', 'Rozbor zdravotního stavu, doplňky MediHub a bylinná terapie.', '800 Kč', 45);

-- --------------------------------------------------------

--
-- Struktura tabulky `reservations`
--

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reservation_date` date NOT NULL,
  `reservation_time` time NOT NULL,
  `service_id` int DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','confirmed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `reviews`
--

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `review_text` text COLLATE utf8mb4_unicode_ci,
  `is_approved` tinyint DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktura tabulky `settings_availability`
--

CREATE TABLE IF NOT EXISTS `settings_availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `day_name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `day_index` int DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `is_closed` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Vložení otevírací doby
--
TRUNCATE TABLE `settings_availability`;

INSERT INTO `settings_availability` (`day_name`, `day_index`, `start_time`, `end_time`, `is_closed`) VALUES
('Pondělí', 1, '09:00:00', '18:00:00', 0),
('Úterý', 2, '09:00:00', '18:00:00', 0),
('Středa', 3, '09:00:00', '18:00:00', 0),
('Čtvrtek', 4, '09:00:00', '18:00:00', 0),
('Pátek', 5, '09:00:00', '18:00:00', 0),
('Sobota', 6, NULL, NULL, 1),
('Neděle', 0, NULL, NULL, 1);

--
-- Omezení pro tabulku `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL;

COMMIT;
