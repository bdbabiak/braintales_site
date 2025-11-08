-- Migration to create subscribers table
-- Run this in your database to add the email subscriber functionality

CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(320) NOT NULL,
  `initialChapter` varchar(50) DEFAULT NULL,
  `source` varchar(100) DEFAULT 'chapter_download',
  `isActive` int NOT NULL DEFAULT '1',
  `subscribedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `chapterSentAt` timestamp NULL DEFAULT NULL,
  `followUpSentAt` timestamp NULL DEFAULT NULL,
  `lastCampaignAt` timestamp NULL DEFAULT NULL,
  `notes` text,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `isActive` (`isActive`),
  KEY `subscribedAt` (`subscribedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index for quick lookups
CREATE INDEX idx_active_subscribers ON subscribers(isActive, subscribedAt);
CREATE INDEX idx_follow_ups ON subscribers(isActive, followUpSentAt, chapterSentAt);
