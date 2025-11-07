-- Migration: Add subscribers table for email list management
-- Date: 2025-11-07

CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  `initialChapter` varchar(50),
  `source` varchar(100) DEFAULT 'chapter_download',
  `isActive` int DEFAULT 1 NOT NULL,
  `subscribedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chapterSentAt` timestamp NULL DEFAULT NULL,
  `followUpSentAt` timestamp NULL DEFAULT NULL,
  `lastCampaignAt` timestamp NULL DEFAULT NULL,
  `notes` text,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_isActive` (`isActive`),
  KEY `idx_subscribedAt` (`subscribedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for efficient querying
CREATE INDEX IF NOT EXISTS idx_initialChapter ON subscribers(initialChapter);
CREATE INDEX IF NOT EXISTS idx_source ON subscribers(source);
