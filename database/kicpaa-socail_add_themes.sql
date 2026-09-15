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
-- Table structure for table `add_themes`
--

DROP TABLE IF EXISTS `add_themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `add_themes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `themeName` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `themeImage` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `add_themes`
--

LOCK TABLES `add_themes` WRITE;
/*!40000 ALTER TABLE `add_themes` DISABLE KEYS */;
INSERT INTO `add_themes` VALUES (2,'Snowy','themes/7wUK75IqTjHw7UpufE68omGRDWSvjehMdIu0H8Tk.gif','2026-09-10 20:32:58','2026-09-10 20:32:58'),(3,'Moon','themes/DP8VaxrIteS7qF8kG53KQ7BlWFaBlCL2J5DISNJh.gif','2026-09-10 20:44:29','2026-09-10 20:44:29'),(4,'Star','themes/LrDTxJMBY33Uzu01jS0He5RekaepcFozoSwxV5Yf.gif','2026-09-10 20:47:54','2026-09-10 20:47:54'),(5,'Tech','themes/2hNNm7TmwaPn7jkifDAuTsinXuY7RDCPaz8RkaGL.gif','2026-09-10 20:51:15','2026-09-10 20:51:15'),(6,'Aurora Glass','themes/modern-aurora.svg','2026-09-10 23:23:26','2026-09-10 23:23:26'),(7,'Coral Bloom','themes/modern-coral.svg','2026-09-10 23:23:26','2026-09-10 23:23:26'),(8,'Cobalt Grid','themes/modern-cobalt.svg','2026-09-10 23:23:26','2026-09-10 23:23:26'),(9,'Emerald Flow','themes/modern-emerald.svg','2026-09-10 23:23:26','2026-09-10 23:23:26'),(10,'Mono Studio','themes/modern-mono.svg','2026-09-10 23:23:26','2026-09-10 23:23:26'),(11,'Animation','themes/5nNVLgkPuePGjsFe7HpjJpEwKbJti5m3NCZS00QO.gif','2026-09-10 23:31:31','2026-09-10 23:31:31'),(12,'Star','themes/agOpjmDCsrZWmp2OlujRBQKozn2Q6nz6KC6xNOAd.gif','2026-09-10 23:32:25','2026-09-10 23:32:25'),(13,'Chrismas','themes/xqdvvOqNikSf4T3CFAvYkgoVpLKYgecyvzwSQksl.gif','2026-09-10 23:52:40','2026-09-10 23:52:40'),(14,'Night Chrismas','themes/leu7v2PFYremSaw5Hsf468p4gxzP8BqqjEdeB75x.gif','2026-09-10 23:53:11','2026-09-10 23:53:11'),(15,'Kbach Khmer','themes/kbach-khmer.svg','2026-09-13 19:50:26','2026-09-13 19:50:26');
/*!40000 ALTER TABLE `add_themes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-14 14:51:35
