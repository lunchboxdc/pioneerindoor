-- MySQL dump 10.13  Distrib 5.7.23, for Linux (x86_64)
--
-- Host: pi-master.cs5wg1w14be0.us-east-2.rds.amazonaws.com    Database: pi
-- ------------------------------------------------------
-- Server version	5.7.17-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `pi`
--

/*!40000 DROP DATABASE IF EXISTS `pi`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `pi` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `pi`;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address1` varchar(75) NOT NULL,
  `address2` varchar(75) DEFAULT NULL,
  `city` varchar(45) NOT NULL,
  `state` varchar(45) NOT NULL,
  `zip` varchar(10) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=290 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assetsVersion` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `auditioninfo`
--

DROP TABLE IF EXISTS `auditioninfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auditioninfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school` varchar(45) DEFAULT NULL,
  `schoolYear` varchar(45) DEFAULT NULL,
  `instrument1` varchar(45) NOT NULL,
  `instrument2` varchar(45) DEFAULT NULL,
  `instrument3` varchar(45) DEFAULT NULL,
  `referral` varchar(60) NOT NULL,
  `referralOther` varchar(60) DEFAULT NULL,
  `yearsDrumming` varchar(45) NOT NULL,
  `experience` varchar(600) DEFAULT NULL,
  `conflicts` varchar(600) DEFAULT NULL,
  `specialTalents` varchar(600) DEFAULT NULL,
  `goal` varchar(600) NOT NULL,
  `season` int(11) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `studentId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `studentId_idx` (`studentId`),
  CONSTRAINT `studentId` FOREIGN KEY (`studentId`) REFERENCES `student` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `facebookpost`
--

DROP TABLE IF EXISTS `facebookpost`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facebookpost` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facebookId` varchar(45) DEFAULT NULL,
  `from` varchar(45) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `statusType` varchar(20) DEFAULT NULL,
  `name` varchar(75) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `picture` varchar(200) DEFAULT NULL,
  `caption` varchar(60) DEFAULT NULL,
  `story` varchar(100) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `createdTime` datetime DEFAULT NULL,
  `message` varchar(275) DEFAULT NULL,
  `attachmentImage` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `email` varchar(75) NOT NULL,
  `password` varchar(70) DEFAULT NULL,
  `apiToken` varchar(70) DEFAULT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resetToken` varchar(70) DEFAULT NULL,
  `resetTokenExpiration` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `email` varchar(75) NOT NULL,
  `birthDate` date NOT NULL,
  `phone` varchar(12) NOT NULL,
  `addressId` int(11) NOT NULL,
  `guardianFirstName` varchar(45) NOT NULL,
  `guardianLastName` varchar(45) NOT NULL,
  `guardianEmail` varchar(75) NOT NULL,
  `guardianPhone` varchar(12) NOT NULL,
  `guardianPhone2` varchar(12) DEFAULT NULL,
  `guardianAddressId` int(11) NOT NULL,
  `guardian2FirstName` varchar(45) DEFAULT NULL,
  `guardian2LastName` varchar(45) DEFAULT NULL,
  `guardian2Email` varchar(75) DEFAULT NULL,
  `guardian2Phone` varchar(12) DEFAULT NULL,
  `guardian2Phone2` varchar(12) DEFAULT NULL,
  `guardian2AddressId` int(11) DEFAULT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `s_addressId_idx` (`addressId`),
  KEY `pg_addressId_idx` (`guardianAddressId`),
  KEY `pg2_addressId_idx` (`guardian2AddressId`),
  CONSTRAINT `pg2_addressId` FOREIGN KEY (`guardian2AddressId`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `pg_addressId` FOREIGN KEY (`guardianAddressId`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `s_addressId` FOREIGN KEY (`addressId`) REFERENCES `address` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-08-31  0:06:38
