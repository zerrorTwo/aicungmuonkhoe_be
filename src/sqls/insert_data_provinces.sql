-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: aicungmuonkhoe
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `provinces`
--

DROP TABLE IF EXISTS `provinces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provinces` (
  `PROVINCE_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(100) NOT NULL,
  `CODE` varchar(10) NOT NULL,
  `CREATED_AT` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `UPDATED_AT` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `TYPE` varchar(50) NOT NULL,
  `NAME_WITH_TYPE` varchar(255) NOT NULL,
  PRIMARY KEY (`PROVINCE_ID`),
  UNIQUE KEY `IDX_01b36d860587b7a4a132f139bf` (`NAME`),
  UNIQUE KEY `IDX_417fba64296fbfae3d39f9e394` (`CODE`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provinces`
--

LOCK TABLES `provinces` WRITE;
/*!40000 ALTER TABLE `provinces` DISABLE KEYS */;
INSERT INTO `provinces` VALUES (1,'Hà Nội','01','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Thành phố','Thành phố Hà Nội'),(2,'Cao Bằng','04','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Cao Bằng'),(3,'Tuyên Quang','08','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Tuyên Quang'),(4,'Điện Biên','11','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Điện Biên'),(5,'Lai Châu','12','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Lai Châu'),(6,'Sơn La','14','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Sơn La'),(7,'Lào Cai','15','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Lào Cai'),(8,'Thái Nguyên','19','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Thái Nguyên'),(9,'Lạng Sơn','20','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Lạng Sơn'),(10,'Quảng Ninh','22','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Quảng Ninh'),(11,'Bắc Ninh','24','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Bắc Ninh'),(12,'Phú Thọ','25','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Phú Thọ'),(13,'Hải Phòng','31','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Thành phố','Thành phố Hải Phòng'),(14,'Hưng Yên','33','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Hưng Yên'),(15,'Ninh Bình','37','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Ninh Bình'),(16,'Thanh Hóa','38','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Thanh Hóa'),(17,'Nghệ An','40','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Nghệ An'),(18,'Hà Tĩnh','42','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Hà Tĩnh'),(19,'Quảng Trị','44','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Quảng Trị'),(20,'Huế','46','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Thành phố','Thành phố Huế'),(21,'Đà Nẵng','48','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Thành phố','Thành phố Đà Nẵng'),(22,'Quảng Ngãi','52','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Quảng Ngãi'),(23,'Gia Lai','54','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Gia Lai'),(24,'Khánh Hòa','56','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Khánh Hòa'),(25,'Lâm Đồng','58','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Lâm Đồng'),(26,'Đắk Lắk','60','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Đắk Lắk'),(27,'Thành phố Hồ Chí Minh','62','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Thành phố','Thành phố Hồ Chí Minh'),(28,'Đồng Nai','64','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Đồng Nai'),(29,'Tây Ninh','66','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Tây Ninh'),(30,'Cần Thơ','68','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Thành phố','Thành phố Cần Thơ'),(31,'Vĩnh Long','70','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Vĩnh Long'),(32,'Đồng Tháp','72','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Đồng Tháp'),(33,'Cà Mau','74','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh Cà Mau'),(34,'An Giang','76','2025-10-15 12:35:19.000000','2025-10-15 12:35:19.000000','Tỉnh','Tỉnh An Giang');
/*!40000 ALTER TABLE `provinces` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-15 16:31:01
