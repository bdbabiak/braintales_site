CREATE TABLE IF NOT EXISTS `settings` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `key` varchar(64) NOT NULL UNIQUE,
  `value` text,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

