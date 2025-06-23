-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           10.4.32-MariaDB - mariadb.org binary distribution
-- SO do servidor:               Win64
-- HeidiSQL Versão:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- A despejar estrutura da base de dados para project
CREATE DATABASE IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `project`;

-- A despejar estrutura para tabela project.acesstasks
CREATE TABLE IF NOT EXISTS `acesstasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task` int(11) NOT NULL,
  `process` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_acesstaks_process` (`process`),
  KEY `FK_acesstasks_task` (`task`),
  CONSTRAINT `FK_acesstaks_process` FOREIGN KEY (`process`) REFERENCES `process` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_acesstasks_task` FOREIGN KEY (`task`) REFERENCES `task` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.acesstasks: ~10 rows (aproximadamente)
DELETE FROM `acesstasks`;
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(11, 1, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(12, 2, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(14, 3, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(15, 4, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(16, 5, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(17, 6, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(18, 7, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(20, 8, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(21, 9, 1);
INSERT INTO `acesstasks` (`id`, `task`, `process`) VALUES
	(23, 10, 1);

-- A despejar estrutura para tabela project.attendant
CREATE TABLE IF NOT EXISTS `attendant` (
  `id` int(9) NOT NULL,
  `entity` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_attendant_entity` (`entity`),
  CONSTRAINT `FK_attendant_entity` FOREIGN KEY (`entity`) REFERENCES `entity` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_attendant_user` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.attendant: ~0 rows (aproximadamente)
DELETE FROM `attendant`;
INSERT INTO `attendant` (`id`, `entity`, `email`, `password`) VALUES
	(444555666, 0, 'hospital@covabeira.pt', 'pass');

-- A despejar estrutura para tabela project.doctor
CREATE TABLE IF NOT EXISTS `doctor` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` longtext NOT NULL,
  `contact` int(9) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `FK_doctor_user` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.doctor: ~1 rows (aproximadamente)
DELETE FROM `doctor`;
INSERT INTO `doctor` (`id`, `name`, `email`, `password`, `contact`) VALUES
	(987456321, 'Fernando Sousa', 'fernando.sousa@hospital.pt', '$2b$10$EFkQwvUiNetHrA60lX.2DOXTYqlr6grqjZmLsuBEnRyuxkDn9HF1e', 912345678);

-- A despejar estrutura para tabela project.document
CREATE TABLE IF NOT EXISTS `document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctor` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `path` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_document_doctor` (`doctor`),
  CONSTRAINT `FK_document_doctor` FOREIGN KEY (`doctor`) REFERENCES `doctor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.document: ~0 rows (aproximadamente)
DELETE FROM `document`;

-- A despejar estrutura para tabela project.entity
CREATE TABLE IF NOT EXISTS `entity` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` longtext NOT NULL,
  `contact` int(9) NOT NULL,
  `location` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.entity: ~0 rows (aproximadamente)
DELETE FROM `entity`;
INSERT INTO `entity` (`id`, `name`, `contact`, `location`) VALUES
	(1, 'Hospital Cova da Beira', 999888777, 'Covilhã');

-- A despejar estrutura para tabela project.form
CREATE TABLE IF NOT EXISTS `form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `FK_form_task` FOREIGN KEY (`id`) REFERENCES `task` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.form: ~7 rows (aproximadamente)
DELETE FROM `form`;
INSERT INTO `form` (`id`, `title`) VALUES
	(3, 'Pré-operatório');
INSERT INTO `form` (`id`, `title`) VALUES
	(4, 'Pós-operatório');
INSERT INTO `form` (`id`, `title`) VALUES
	(5, '1 semana');
INSERT INTO `form` (`id`, `title`) VALUES
	(6, '1 mês');
INSERT INTO `form` (`id`, `title`) VALUES
	(7, '3 meses');
INSERT INTO `form` (`id`, `title`) VALUES
	(8, '1 dia');
INSERT INTO `form` (`id`, `title`) VALUES
	(9, '2 dias');

-- A despejar estrutura para tabela project.formquestion
CREATE TABLE IF NOT EXISTS `formquestion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `form` int(11) NOT NULL,
  `question` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_formquestion_form` (`form`),
  KEY `FK_formquestion_question` (`question`),
  CONSTRAINT `FK_formquestion_form` FOREIGN KEY (`form`) REFERENCES `form` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_formquestion_question` FOREIGN KEY (`question`) REFERENCES `question` (`questionId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.formquestion: ~7 rows (aproximadamente)
DELETE FROM `formquestion`;
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(1, 4, 3);
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(3, 3, 0);
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(5, 5, 1);
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(7, 6, 2);
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(9, 7, 6);
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(11, 8, 4);
INSERT INTO `formquestion` (`id`, `form`, `question`) VALUES
	(13, 9, 5);

-- A despejar estrutura para tabela project.patient
CREATE TABLE IF NOT EXISTS `patient` (
  `id` int(9) NOT NULL,
  `token` varchar(12) NOT NULL,
  `name` longtext NOT NULL,
  `email` text NOT NULL,
  `contact` int(9) NOT NULL,
  `sex` varchar(50) NOT NULL,
  `age` int(11) NOT NULL,
  `profession` varchar(50) NOT NULL,
  `etiology` varchar(50) NOT NULL,
  `doctor` int(9) NOT NULL,
  `process` int(11) NOT NULL,
  `surgery` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `FK_patient_doctor` (`doctor`),
  KEY `FK_patient_process` (`process`),
  CONSTRAINT `FK_patient_doctor` FOREIGN KEY (`doctor`) REFERENCES `doctor` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_patient_process` FOREIGN KEY (`process`) REFERENCES `process` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_patient_user` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.patient: ~1 rows (aproximadamente)
DELETE FROM `patient`;
INSERT INTO `patient` (`id`, `token`, `name`, `email`, `contact`, `sex`, `age`, `profession`, `etiology`, `doctor`, `process`, `surgery`) VALUES
	(666777888, 's4s20Tq41f2B', 'Beatriz Santos', 'beatrizfs2004@gmail.com', 912345678, 'Feminino', 21, 'Estudante', 'Genética', 987456321, 1, '2025-05-30');

-- A despejar estrutura para tabela project.patientphoto
CREATE TABLE IF NOT EXISTS `patientphoto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient` int(11) NOT NULL,
  `path` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `patient` (`patient`),
  CONSTRAINT `FK_patient_photo` FOREIGN KEY (`patient`) REFERENCES `patient` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.patientphoto: ~0 rows (aproximadamente)
DELETE FROM `patientphoto`;

-- A despejar estrutura para tabela project.photo
CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` longtext NOT NULL,
  `path` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `FK_photo_task` FOREIGN KEY (`id`) REFERENCES `task` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.photo: ~0 rows (aproximadamente)
DELETE FROM `photo`;
INSERT INTO `photo` (`id`, `title`, `path`) VALUES
	(10, 'Joelho', '../anexos/exemplos/1.jpg');

-- A despejar estrutura para tabela project.process
CREATE TABLE IF NOT EXISTS `process` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.process: ~0 rows (aproximadamente)
DELETE FROM `process`;
INSERT INTO `process` (`id`, `name`) VALUES
	(1, 'ortopedia');

-- A despejar estrutura para tabela project.question
CREATE TABLE IF NOT EXISTS `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `questionId` int(11) NOT NULL,
  `question` varchar(50) NOT NULL,
  `option` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `questionId` (`questionId`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.question: ~28 rows (aproximadamente)
DELETE FROM `question`;
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(1, 0, 'Quantos dias até ter alta depois da operação?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(2, 0, 'Quantos dias até ter alta depois da operação?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(3, 0, 'Quantos dias até ter alta depois da operação?', '3');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(4, 0, 'Quantos dias até ter alta depois da operação?', '4');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(5, 4, 'Quantos auxiliares de marcha (canadianas)?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(6, 4, 'Quantos auxiliares de marcha (canadianas)?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(7, 2, 'Quantos auxiliares de marcha (canadianas)?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(8, 2, 'Quantos auxiliares de marcha (canadianas)?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(9, 1, 'Qual o nivel de dor depois da primeira semana?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(10, 1, 'Qual o nivel de dor depois da primeira semana?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(11, 1, 'Qual o nivel de dor depois da primeira semana?', '3');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(12, 1, 'Qual o nivel de dor depois da primeira semana?', '4');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(13, 1, 'Qual o nivel de dor depois da primeira semana?', '5');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(20, 3, 'Qual o nivel de dificuldade nos movimentos?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(21, 3, 'Qual o nivel de dificuldade nos movimentos?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(22, 3, 'Qual o nivel de dificuldade nos movimentos?', '3');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(23, 3, 'Qual o nivel de dificuldade nos movimentos?', '4');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(24, 3, 'Qual o nivel de dificuldade nos movimentos?', '5');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(25, 5, 'Qual o nivel de independência?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(26, 5, 'Qual o nivel de independência?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(27, 5, 'Qual o nivel de independência?', '3');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(28, 5, 'Qual o nivel de independência?', '4');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(29, 5, 'Qual o nivel de independência?', '5');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(30, 6, 'Quantas semanas até voltar a trabalhar?', '0');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(31, 6, 'Quantas semanas até voltar a trabalhar?', '1');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(32, 6, 'Quantas semanas até voltar a trabalhar?', '2');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(33, 6, 'Quantas semanas até voltar a trabalhar?', '3');
INSERT INTO `question` (`id`, `questionId`, `question`, `option`) VALUES
	(34, 6, 'Quantas semanas até voltar a trabalhar?', '4+');

-- A despejar estrutura para tabela project.questionpatient
CREATE TABLE IF NOT EXISTS `questionpatient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient` int(11) NOT NULL,
  `question` int(11) NOT NULL,
  `answered` varchar(50) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `id` (`id`),
  KEY `patient` (`patient`),
  KEY `question` (`question`),
  CONSTRAINT `FK_questionpatient_patient` FOREIGN KEY (`patient`) REFERENCES `patient` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_questionpatient_question` FOREIGN KEY (`question`) REFERENCES `question` (`questionId`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.questionpatient: ~1 rows (aproximadamente)
DELETE FROM `questionpatient`;
INSERT INTO `questionpatient` (`id`, `patient`, `question`, `answered`) VALUES
	(17, 666777888, 1, '3');

-- A despejar estrutura para tabela project.state
CREATE TABLE IF NOT EXISTS `state` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient` int(11) NOT NULL,
  `task` int(11) NOT NULL,
  `create_date` date NOT NULL,
  `done` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `patient` (`patient`),
  KEY `FK_state_task` (`task`),
  CONSTRAINT `FK_state_task` FOREIGN KEY (`task`) REFERENCES `task` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `patient` FOREIGN KEY (`patient`) REFERENCES `patient` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.state: ~10 rows (aproximadamente)
DELETE FROM `state`;
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(81, 666777888, 7, '2025-08-30', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(82, 666777888, 1, '2025-05-30', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(83, 666777888, 3, '2025-05-30', 1);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(84, 666777888, 2, '2025-05-30', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(85, 666777888, 4, '2025-05-30', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(86, 666777888, 6, '2025-06-30', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(87, 666777888, 9, '2025-06-01', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(88, 666777888, 5, '2025-06-06', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(89, 666777888, 8, '2025-05-31', 0);
INSERT INTO `state` (`id`, `patient`, `task`, `create_date`, `done`) VALUES
	(90, 666777888, 10, '2025-05-30', 0);

-- A despejar estrutura para tabela project.task
CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `interval` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.task: ~10 rows (aproximadamente)
DELETE FROM `task`;
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(1, 'tutorial', 0);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(2, 'tutorial', 0);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(3, 'form', 0);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(4, 'form', 0);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(5, 'form', 7);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(6, 'form', 30);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(7, 'form', 90);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(8, 'form', 1);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(9, 'form', 2);
INSERT INTO `task` (`id`, `type`, `interval`) VALUES
	(10, 'photo', 0);

-- A despejar estrutura para tabela project.tutorial
CREATE TABLE IF NOT EXISTS `tutorial` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` longtext NOT NULL,
  `content` longtext NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  CONSTRAINT `FK_tutorial_task` FOREIGN KEY (`id`) REFERENCES `task` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.tutorial: ~2 rows (aproximadamente)
DELETE FROM `tutorial`;
INSERT INTO `tutorial` (`id`, `title`, `content`) VALUES
	(1, 'Marcha com canadianas', 'https://www.youtube.com/embed/-6dc2zTYvvc?si=TE5-Ih6rr9OfEEnV');
INSERT INTO `tutorial` (`id`, `title`, `content`) VALUES
	(2, 'Pós protese do joelho', 'https://www.youtube.com/embed/LOdXi-uKFlc?si=RZEA7DhQg68U2ruP');

-- A despejar estrutura para tabela project.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(9) NOT NULL,
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela project.user: ~4 rows (aproximadamente)
DELETE FROM `user`;
INSERT INTO `user` (`id`, `type`) VALUES
	(111222444, 'doctor');
INSERT INTO `user` (`id`, `type`) VALUES
	(444555666, 'attendant');
INSERT INTO `user` (`id`, `type`) VALUES
	(666777888, 'patient');
INSERT INTO `user` (`id`, `type`) VALUES
	(987456321, 'doctor');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
