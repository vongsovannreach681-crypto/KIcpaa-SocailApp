-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: kicpaa-socail
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `design_options`
--

DROP TABLE IF EXISTS `design_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `design_options` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `swatch` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `design_options_type_slug_unique` (`type`,`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `design_options`
--

LOCK TABLES `design_options` WRITE;
/*!40000 ALTER TABLE `design_options` DISABLE KEYS */;
INSERT INTO `design_options` VALUES (1,'theme','midnight','Midnight','midnight','2026-09-10 19:15:30','2026-09-10 19:15:30'),(2,'theme','carbon','Carbon','carbon','2026-09-10 19:15:30','2026-09-10 19:15:30'),(3,'theme','christmas','Christmas','christmas','2026-09-10 19:15:30','2026-09-10 19:15:30'),(4,'theme','pride','Pride','pride','2026-09-10 19:15:30','2026-09-10 19:15:30'),(5,'theme','glitch','Glitch','glitch','2026-09-10 19:15:30','2026-09-10 19:15:30'),(6,'theme','winter','Winter','winter','2026-09-10 19:15:30','2026-09-10 19:15:30'),(7,'theme','blush','Blush','blush','2026-09-10 19:15:30','2026-09-10 19:15:30'),(8,'theme','forest','Forest','forest','2026-09-10 19:15:30','2026-09-10 19:15:30'),(9,'theme','aurora','Aurora','aurora','2026-09-10 19:15:30','2026-09-10 19:15:30'),(10,'theme','ocean','Ocean','ocean','2026-09-10 19:15:30','2026-09-10 19:15:30'),(11,'theme','sunset','Sunset','sunset','2026-09-10 19:15:30','2026-09-10 19:15:30'),(12,'theme','candy','Candy','candy','2026-09-10 19:15:30','2026-09-10 19:15:30'),(13,'theme','paper','Paper','paper','2026-09-10 19:15:30','2026-09-10 19:15:30'),(14,'theme','cobalt','Cobalt','cobalt','2026-09-10 19:15:30','2026-09-10 19:15:30'),(15,'theme','neon','Neon','neon','2026-09-10 19:15:30','2026-09-10 19:15:30'),(16,'background','deep-space','Deep Space','deep-space','2026-09-10 19:15:30','2026-09-10 19:15:30'),(17,'background','soft-mesh','Soft Mesh','soft-mesh','2026-09-10 19:15:30','2026-09-10 19:15:30'),(18,'background','sunrise','Sunrise','sunrise','2026-09-10 19:15:30','2026-09-10 19:15:30'),(19,'background','blueprint','Blueprint','blueprint','2026-09-10 19:15:30','2026-09-10 19:15:30'),(20,'background','tropical','Tropical','tropical','2026-09-10 19:15:30','2026-09-10 19:15:30'),(21,'background','pearl','Pearl','pearl','2026-09-10 19:15:30','2026-09-10 19:15:30'),(22,'background','violet-haze','Violet Haze','violet-haze','2026-09-10 19:15:30','2026-09-10 19:15:30'),(23,'background','citrus-wave','Citrus Wave','citrus-wave','2026-09-10 19:15:30','2026-09-10 19:15:30'),(24,'background','paper-grid','Paper Grid','paper-grid','2026-09-10 19:15:30','2026-09-10 19:15:30'),(25,'background','night-grid','Night Grid','night-grid','2026-09-10 19:15:30','2026-09-10 19:15:30');
/*!40000 ALTER TABLE `design_options` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-15 11:15:18
