CREATE TABLE `bookRatingsCache` (
	`id` int AUTO_INCREMENT NOT NULL,
	`asin` varchar(20) NOT NULL,
	`rating` varchar(10),
	`reviewCount` int,
	`lastFetched` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bookRatingsCache_id` PRIMARY KEY(`id`),
	CONSTRAINT `bookRatingsCache_asin_unique` UNIQUE(`asin`)
);
