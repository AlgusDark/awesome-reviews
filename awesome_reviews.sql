/*************************************************************
* Space is big. You just wont believe how vastly, hugely,
* mind-bogglingly big it is.
*
* MySQL 8.0.21
*************************************************************/

SET NAMES utf8mb4;

# Table feedbacks
# ------------------------------------------------------------

DROP TABLE IF EXISTS `feedbacks`;

CREATE TABLE `feedbacks` (
  `reviewId` bigint NOT NULL,
  `questionId` bigint NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`reviewId`,`questionId`),
  KEY `idx_rp_reviewId` (`reviewId`),
  KEY `idx_rp_questionId` (`questionId`),
  CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`questionId`) REFERENCES `questions` (`id`),
  CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`reviewId`) REFERENCES `reviews` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

# Table questions
# ------------------------------------------------------------

DROP TABLE IF EXISTS `questions`;

CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_slug` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;

INSERT INTO `questions` (`id`, `title`, `active`)
VALUES
	(1,'Does this employee exhibit leadership qualities in the roles they play in the company?',1),
	(2,'When this employee works with co-workers, what interpersonal skills do they demonstrate?',1),
	(3,'Does the employee effectively solve problems?',1),
	(4,'Does the employee appear to be motivated by their work-related tasks, job, and relationships?',1);

/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;


# Table reviews
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reviewerId` bigint NOT NULL,
  `revieweeId` bigint NOT NULL,
  `active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_rp_reviewer` (`reviewerId`),
  KEY `idx_rp_reviewee` (`revieweeId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`revieweeId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`reviewerId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

# Table roles
# ------------------------------------------------------------

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(75) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;

INSERT INTO `roles` (`id`, `title`, `active`)
VALUES
	(1,'admin',1),
	(2,'employee',1);

/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;


# Table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `roleId` bigint NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_email` (`email`),
  KEY `idx_user_role` (`roleId`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `roleId`, `firstName`, `lastName`, `email`, `password`)
VALUES
	(1,1,'John','Wick','wick@reviews.com','1234'),
	(2,2,'John','Constantine','constantine@reviews.com','1234'),
	(3,2,'Ted','Theodore Logan','ted@reviews.com','1234'),
	(4,2,'Johnny','Mnemonic','mnemonic@reviews.com','1234'),
	(5,2,'Johnny','Utah','utah@reviews.com','1234'),
	(6,2,'Thomas','Anderson','neo@reviews.com','1234'),
	(7,2,'Jack','Traven','jack@reviews.com','1234');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
