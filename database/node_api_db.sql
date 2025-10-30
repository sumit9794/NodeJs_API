-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 30, 2025 at 12:23 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_api_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(111) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `image`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 'Demo Test Image Update 2', 'Testing Image Update 2', '/uploads/1761818874374-872337330.png', 15, '2025-10-29 10:16:02', '2025-10-30 10:07:54'),
(3, 'Demo Test 2 Update', 'Demo test Update Description', '/uploads/1761818898634-106818219.png', 15, '2025-10-29 11:14:05', '2025-10-30 10:08:18'),
(4, 'DemoTest 5', 'Project Name is testing', NULL, 16, '2025-10-29 11:15:34', '2025-10-29 11:15:34'),
(5, 'RAC Development', 'Demo test by Developement Mehtod', '/uploads/1761818904648-130068759.png', 15, '2025-10-29 11:49:36', '2025-10-30 10:08:24'),
(6, 'MiCensus Project', 'Demo test BY Micensus', '/uploads/1761818910283-346367524.png', 15, '2025-10-29 11:52:45', '2025-10-30 10:08:30'),
(7, 'IAI Development', 'Development by testing', '/uploads/1761821927313-404266451.png', 15, '2025-10-29 11:56:40', '2025-10-30 10:58:47'),
(8, 'Demo tesst BY Sumit', 'sdfsf sdfsdf sfdsdf sdfs', '/uploads/1761821919968-607083686.png', 15, '2025-10-29 12:07:23', '2025-10-30 10:58:39'),
(9, 'Demo Test By Adarsh', 'Demo test by adarsh sdsd', NULL, 20, '2025-10-29 12:14:57', '2025-10-29 12:14:57'),
(10, 'CMS Management', 'Demo Test by CMS Management', '/uploads/1761821914047-209147198.png', 15, '2025-10-30 04:22:18', '2025-10-30 10:58:34'),
(11, 'Demo Test By Monika', 'By testing Purpose', NULL, 17, '2025-10-30 04:31:40', '2025-10-30 04:31:40'),
(12, 'fgsdssf sfsfdsdf sdf', 'sdfsdfs sdfsdfsd sdfsdfs', NULL, 17, '2025-10-30 04:32:08', '2025-10-30 04:32:08'),
(13, 'Demo Test Name 4', 'Demo Test Description 4', '/uploads/1761821907538-744613578.png', 15, '2025-10-30 05:32:25', '2025-10-30 10:58:27'),
(14, 'Demo Test Name 5', 'Demo Test Description 5', '/uploads/1761818918141-711901285.png', 15, '2025-10-30 05:32:52', '2025-10-30 10:08:38'),
(15, 'Demo Test Image Upload', 'Demo Test Image Descriptions', '/uploads/1761818889030-930664900.png', 15, '2025-10-30 09:13:08', '2025-10-30 10:08:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(22) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `updated_on` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `email`, `name`, `password`, `updated_on`, `deleted_at`) VALUES
(14, 'test4', 'test4@gmail.com', 'Demo4', '$2b$10$3Jjmbw/WjD1HBwiGE3FirOrBsHpVtuKqrf/fgHCzoF.xBZBkS6NYq', '2025-10-24 06:54:09', 0),
(15, 'sumit1234', 'sumit@gmail.com', 'Sumit Singh', '$2b$10$UosrgnWP8YdMbaOv2kgYJOHEMfJHdIRFb1wdvSdiKSngI2r0eU.Ua', '2025-10-24 06:55:22', 0),
(16, 'test5', 'test5@gmail.com', 'TestAccount1', '$2b$10$nRUpLNKQdo..Fc9aDAOLUu411Sr.l2FTe1ThrhbWi5ZFuj4BK.gd6', '2025-10-28 04:16:25', 0),
(17, 'monika1234', 'monika@gmail.com', 'Monika Yadav', '$2b$10$0seJm8K4c8FvjapkRPJO8.2bqR3JO6U9ruhhM6K7HzMhXpQMqO97S', '2025-10-28 07:03:22', 0),
(18, 'test6', 'test6@gmail.com', 'sumit test', '$2b$10$PX7wVUz2pFiqZRdEhstMTu0SL90GbD0FeSIyol3UL4clH5xuN1eX2', '2025-10-28 11:11:41', 0),
(19, 'dfg', 'r@gmail.com', 'dgdg', '$2b$10$XwMsfBQYInS15FhioHGPNefJ/pwOhs.wTl8n/65Ck6hpwAlOMw66i', '2025-10-28 12:23:46', 0),
(20, 'adarsh1', 'adash@gmail.com', 'Adarsh Dwivedi', '$2b$10$cJ03/FrP/Al0YMC4Q/YKQO4fGnMMEH9yaV2uO2lI89JToybbUyW0i', '2025-10-29 12:09:40', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
