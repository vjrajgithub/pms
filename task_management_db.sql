-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 08, 2025 at 09:35 AM
-- Server version: 9.1.0
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `task_management_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` bigint UNSIGNED NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `properties` json DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_logs_subject_type_subject_id_index` (`subject_type`,`subject_id`),
  KEY `activity_logs_user_id_created_at_index` (`user_id`,`created_at`),
  KEY `activity_logs_action_index` (`action`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `order` int UNSIGNED NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_parent_id_order_index` (`parent_id`,`order`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `parent_id`, `order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'External', 8, 0, 1, '2025-11-18 02:57:11', '2025-11-18 03:50:31'),
(2, 'LG', 1, 0, 1, '2025-11-18 02:57:45', '2025-11-18 02:58:33'),
(3, 'HA', 2, 0, 1, '2025-11-18 02:59:13', '2025-11-18 02:59:13'),
(4, 'REF', 3, 0, 1, '2025-11-18 02:59:28', '2025-11-18 02:59:40'),
(5, 'Double Door', 4, 0, 1, '2025-11-18 02:59:54', '2025-11-18 02:59:54'),
(6, 'Single Door', 4, 0, 1, '2025-11-18 03:00:22', '2025-11-18 03:00:22'),
(7, 'Internal', 8, 0, 1, '2025-11-18 03:01:00', '2025-11-18 03:50:40'),
(8, 'Clients', NULL, 0, 1, '2025-11-18 03:36:17', '2025-11-18 03:36:17'),
(9, 'HSAD', 7, 0, 1, '2025-11-18 03:53:36', '2025-11-18 03:53:36'),
(10, 'Digital', 9, 0, 1, '2025-11-18 03:53:58', '2025-11-18 03:53:58'),
(11, 'a', 10, 0, 1, '2025-11-26 06:00:07', '2025-11-26 06:00:07'),
(12, 'b', 11, 0, 1, '2025-11-26 06:00:14', '2025-11-26 06:00:14');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2024_01_01_000001_create_roles_table', 1),
(3, '2024_01_01_000002_create_users_table', 1),
(4, '2024_01_01_000003_create_projects_table', 1),
(5, '2024_01_01_000004_create_teams_table', 1),
(6, '2024_01_01_000005_create_team_members_table', 1),
(7, '2024_01_01_000006_create_rooms_table', 1),
(8, '2024_01_01_000007_create_tasks_table', 1),
(9, '2024_01_01_000008_create_task_attachments_table', 1),
(10, '2024_01_01_000009_create_task_comments_table', 1),
(11, '2024_01_01_000010_create_notifications_table', 1),
(12, '2024_01_01_000011_create_activity_logs_table', 1),
(13, '2024_01_01_000012_create_otp_verifications_table', 1),
(14, '2025_09_14_000001_add_created_by_to_teams_table', 1),
(15, '2025_11_17_000100_add_attachment_paths_to_task_comments_table', 2),
(16, '2025_11_18_091500_create_categories_table', 3),
(17, '2024_01_01_000020_create_project_comments_table', 4),
(18, '2024_01_01_000021_alter_teams_make_project_id_nullable', 5),
(19, '2024_01_01_000030_add_action_url_to_notifications_table', 6),
(20, '2024_01_01_000031_add_progress_to_projects_table', 7),
(21, '2024_01_01_000032_create_permissions_table', 8),
(22, '2025_12_03_000100_create_project_team_table', 9),
(23, '2025_12_03_000200_add_deleted_at_to_rooms_table', 10);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `data` json DEFAULT NULL,
  `action_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `delivery_method` enum('in_app','email','sms','push') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'in_app',
  `is_sent` tinyint(1) NOT NULL DEFAULT '0',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notifications_user_id_is_read_created_at_index` (`user_id`,`is_read`,`created_at`),
  KEY `notifications_type_is_sent_index` (`type`,`is_sent`)
) ENGINE=MyISAM AUTO_INCREMENT=557 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `action_url`, `priority`, `is_read`, `read_at`, `delivery_method`, `is_sent`, `sent_at`, `created_at`, `updated_at`) VALUES
(1, 1, 'system', 'Welcome to Task Management System', 'Welcome to our task management platform! Start by exploring your dashboard and creating your first project.', '{\"action\": \"welcome\"}', NULL, 'medium', 1, '2025-09-12 18:49:07', 'in_app', 0, NULL, '2025-09-11 18:49:07', '2025-09-13 18:49:07'),
(2, 1, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: \"Setup project environment\". Please check your task list for details.', '{\"task_id\": 1, \"task_title\": \"Setup project environment\"}', NULL, 'high', 1, '2025-09-13 15:49:07', 'in_app', 0, NULL, '2025-09-13 12:49:07', '2025-09-13 18:49:07'),
(3, 1, 'deadline_reminder', 'Team Meeting Reminder', 'Don\'t forget about the team meeting scheduled for tomorrow at 10:00 AM.', '{\"date\": \"tomorrow\", \"meeting_time\": \"10:00 AM\"}', NULL, 'medium', 0, '2025-12-01 05:00:19', 'in_app', 0, NULL, '2025-09-13 16:49:07', '2025-12-01 05:00:19'),
(9, 3, 'system', 'Welcome to Task Management System', 'Welcome to our task management platform! Start by exploring your dashboard and creating your first project.', '{\"action\": \"welcome\"}', NULL, 'medium', 1, '2025-09-12 18:49:07', 'in_app', 0, NULL, '2025-09-11 18:49:07', '2025-09-13 18:49:07'),
(10, 3, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: \"Setup project environment\". Please check your task list for details.', '{\"task_id\": 1, \"task_title\": \"Setup project environment\"}', NULL, 'high', 1, '2025-09-13 15:49:07', 'in_app', 0, NULL, '2025-09-13 12:49:07', '2025-09-13 18:49:07'),
(11, 3, 'deadline_reminder', 'Team Meeting Reminder', 'Don\'t forget about the team meeting scheduled for tomorrow at 10:00 AM.', '{\"date\": \"tomorrow\", \"meeting_time\": \"10:00 AM\"}', NULL, 'medium', 0, NULL, 'in_app', 0, NULL, '2025-09-13 16:49:07', '2025-09-13 18:49:07'),
(12, 3, 'project_updated', 'Project Update Available', 'A new update is available for your project. Click here to view the latest changes.', '{\"project_id\": 1, \"update_type\": \"feature\"}', NULL, 'low', 0, '2025-09-14 22:25:38', 'in_app', 0, NULL, '2025-09-13 18:19:07', '2025-09-14 22:25:38'),
(13, 4, 'system', 'Welcome to Task Management System', 'Welcome to our task management platform! Start by exploring your dashboard and creating your first project.', '{\"action\": \"welcome\"}', NULL, 'medium', 1, '2025-09-12 18:49:07', 'in_app', 0, NULL, '2025-09-11 18:49:07', '2025-09-13 18:49:07'),
(14, 4, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: \"Setup project environment\". Please check your task list for details.', '{\"task_id\": 1, \"task_title\": \"Setup project environment\"}', NULL, 'high', 1, '2025-09-13 15:49:07', 'in_app', 0, NULL, '2025-09-13 12:49:07', '2025-09-13 18:49:07'),
(15, 4, 'deadline_reminder', 'Team Meeting Reminder', 'Don\'t forget about the team meeting scheduled for tomorrow at 10:00 AM.', '{\"date\": \"tomorrow\", \"meeting_time\": \"10:00 AM\"}', NULL, 'medium', 0, NULL, 'in_app', 0, NULL, '2025-09-13 16:49:07', '2025-09-13 18:49:07'),
(16, 4, 'project_updated', 'Project Update Available', 'A new update is available for your project. Click here to view the latest changes.', '{\"project_id\": 1, \"update_type\": \"feature\"}', NULL, 'low', 0, NULL, 'in_app', 0, NULL, '2025-09-13 18:19:07', '2025-09-13 18:49:07'),
(17, 5, 'system', 'Welcome to Task Management System', 'Welcome to our task management platform! Start by exploring your dashboard and creating your first project.', '{\"action\": \"welcome\"}', NULL, 'medium', 1, '2025-09-12 18:49:07', 'in_app', 0, NULL, '2025-09-11 18:49:07', '2025-09-13 18:49:07'),
(18, 5, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: \"Setup project environment\". Please check your task list for details.', '{\"task_id\": 1, \"task_title\": \"Setup project environment\"}', NULL, 'high', 1, '2025-09-13 15:49:07', 'in_app', 0, NULL, '2025-09-13 12:49:07', '2025-09-13 18:49:07'),
(19, 5, 'deadline_reminder', 'Team Meeting Reminder', 'Don\'t forget about the team meeting scheduled for tomorrow at 10:00 AM.', '{\"date\": \"tomorrow\", \"meeting_time\": \"10:00 AM\"}', NULL, 'medium', 0, NULL, 'in_app', 0, NULL, '2025-09-13 16:49:07', '2025-09-13 18:49:07'),
(20, 5, 'project_updated', 'Project Update Available', 'A new update is available for your project. Click here to view the latest changes.', '{\"project_id\": 1, \"update_type\": \"feature\"}', NULL, 'low', 0, NULL, 'in_app', 0, NULL, '2025-09-13 18:19:07', '2025-09-13 18:49:07'),
(21, 6, 'system', 'Welcome to Task Management System', 'Welcome to our task management platform! Start by exploring your dashboard and creating your first project.', '{\"action\": \"welcome\"}', NULL, 'medium', 1, '2025-09-12 18:49:07', 'in_app', 0, NULL, '2025-09-11 18:49:07', '2025-09-13 18:49:07'),
(22, 6, 'task_assigned', 'New Task Assigned', 'You have been assigned a new task: \"Setup project environment\". Please check your task list for details.', '{\"task_id\": 1, \"task_title\": \"Setup project environment\"}', NULL, 'high', 1, '2025-09-13 15:49:07', 'in_app', 0, NULL, '2025-09-13 12:49:07', '2025-09-13 18:49:07'),
(23, 6, 'deadline_reminder', 'Team Meeting Reminder', 'Don\'t forget about the team meeting scheduled for tomorrow at 10:00 AM.', '{\"date\": \"tomorrow\", \"meeting_time\": \"10:00 AM\"}', NULL, 'medium', 0, NULL, 'in_app', 0, NULL, '2025-09-13 16:49:07', '2025-09-13 18:49:07'),
(24, 6, 'project_updated', 'Project Update Available', 'A new update is available for your project. Click here to view the latest changes.', '{\"project_id\": 1, \"update_type\": \"feature\"}', NULL, 'low', 0, NULL, 'in_app', 0, NULL, '2025-09-13 18:19:07', '2025-09-13 18:49:07'),
(26, 3, 'team_updated', 'Team Member Added', 'A new team member has been added to your team. Please help them get started.', '{\"action\": \"member_added\", \"team_id\": 1}', NULL, 'medium', 0, NULL, 'in_app', 0, NULL, '2025-09-13 14:49:07', '2025-09-13 18:49:07'),
(27, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:49:41', 'in_app', 0, NULL, '2025-12-02 04:22:38', '2025-12-02 05:49:41'),
(28, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:38', '2025-12-02 04:22:38'),
(29, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:39', '2025-12-02 04:22:39'),
(30, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:39', '2025-12-02 04:22:39'),
(31, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:39', '2025-12-02 04:22:39'),
(32, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:39', '2025-12-02 04:22:39'),
(33, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:39', '2025-12-02 04:22:39'),
(34, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:22:40', '2025-12-02 05:30:40'),
(35, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:49:41', 'in_app', 0, NULL, '2025-12-02 04:22:40', '2025-12-02 05:49:41'),
(36, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:40', '2025-12-02 04:22:40'),
(37, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:40', '2025-12-02 04:22:40'),
(38, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:41', '2025-12-02 04:22:41'),
(39, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:41', '2025-12-02 04:22:41'),
(40, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:41', '2025-12-02 04:22:41'),
(41, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:41', '2025-12-02 04:22:41'),
(42, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:22:41', '2025-12-02 05:30:40'),
(43, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 04:23:38', 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:23:38'),
(44, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:22:55'),
(45, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:22:55'),
(46, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:22:55'),
(47, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:22:55'),
(48, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:22:55'),
(49, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:55', '2025-12-02 04:22:55'),
(50, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:22:56', '2025-12-02 05:30:40'),
(51, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:49:41', 'in_app', 0, NULL, '2025-12-02 04:22:56', '2025-12-02 05:49:41'),
(52, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:56', '2025-12-02 04:22:56'),
(53, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:56', '2025-12-02 04:22:56'),
(54, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:56', '2025-12-02 04:22:56'),
(55, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:56', '2025-12-02 04:22:56'),
(56, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:57', '2025-12-02 04:22:57'),
(57, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:22:57', '2025-12-02 04:22:57'),
(58, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:22:57', '2025-12-02 05:30:40'),
(59, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:49:41', 'in_app', 0, NULL, '2025-12-02 04:26:50', '2025-12-02 05:49:41'),
(60, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:50', '2025-12-02 04:26:50'),
(61, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:50', '2025-12-02 04:26:50'),
(62, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:50', '2025-12-02 04:26:50'),
(63, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:51', '2025-12-02 04:26:51'),
(64, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:51', '2025-12-02 04:26:51'),
(65, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:51', '2025-12-02 04:26:51'),
(66, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:26:51', '2025-12-02 05:30:40'),
(67, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:49:41', 'in_app', 0, NULL, '2025-12-02 04:26:51', '2025-12-02 05:49:41'),
(68, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:51', '2025-12-02 04:26:51'),
(69, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:52', '2025-12-02 04:26:52'),
(70, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:52', '2025-12-02 04:26:52'),
(71, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:52', '2025-12-02 04:26:52'),
(72, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:52', '2025-12-02 04:26:52'),
(73, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:26:52', '2025-12-02 04:26:52'),
(74, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:26:52', '2025-12-02 05:30:40'),
(75, 2, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:49:41', 'in_app', 0, NULL, '2025-12-02 04:31:29', '2025-12-02 05:49:41'),
(76, 3, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:31:29', '2025-12-02 04:31:29'),
(77, 4, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:31:29', '2025-12-02 04:31:29'),
(78, 5, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:31:30', '2025-12-02 04:31:30'),
(79, 6, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:31:30', '2025-12-02 04:31:30'),
(80, 7, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:31:30', '2025-12-02 04:31:30'),
(81, 8, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-02 04:31:30', '2025-12-02 04:31:30'),
(82, 9, 'project_overdue', 'Project Overdue', 'Project \"KooK MIN Website\" has exceeded its deadline of 30/9/2025', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1', 'high', 0, '2025-12-02 05:30:40', 'in_app', 0, NULL, '2025-12-02 04:31:30', '2025-12-02 05:30:40'),
(83, 3, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:09:22'),
(84, 4, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:09:22'),
(85, 5, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:09:22'),
(86, 6, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:09:22'),
(87, 7, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:09:22'),
(88, 8, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:09:22'),
(89, 9, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"tytrytrytrytrytr\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, '2025-12-02 05:21:38', 'in_app', 0, NULL, '2025-12-02 05:09:22', '2025-12-02 05:21:38'),
(90, 3, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:12:59'),
(91, 4, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:12:59'),
(92, 5, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:12:59'),
(93, 6, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:12:59'),
(94, 7, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:12:59'),
(95, 8, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:12:59'),
(96, 9, 'project_comment', 'New Comment on Project', 'Admin commented on project \"KooK MIN Website\": \"ytuyuytuytuytu\"', '{\"project_id\": 1, \"project_name\": \"KooK MIN Website\"}', '/projects/1#comments', 'medium', 0, '2025-12-02 05:31:02', 'in_app', 0, NULL, '2025-12-02 05:12:59', '2025-12-02 05:31:02'),
(97, 3, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(98, 4, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(99, 5, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(100, 6, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(101, 7, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(102, 8, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(103, 9, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"rtytrytrr ryrty rtytryr ty\"', '{\"comment_id\": 16, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, '2025-12-02 05:31:00', 'in_app', 0, NULL, '2025-12-02 05:29:02', '2025-12-02 05:31:00'),
(104, 3, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(105, 4, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(106, 5, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(107, 6, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(108, 7, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(109, 8, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(110, 9, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tytryrtyr yrtytryryr\"', '{\"comment_id\": 17, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, '2025-12-02 05:31:06', 'in_app', 0, NULL, '2025-12-02 05:29:44', '2025-12-02 05:31:06'),
(111, 4, 'project_comment', 'New Comment on Project', 'vj raj commented on project \"PMS (Project Management System)\": \"tyryry yryry rrty yt\"', '{\"comment_id\": 18, \"project_id\": 2, \"project_name\": \"PMS (Project Management System)\", \"commenter_name\": \"vj raj\"}', '/projects/2#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:38:55', '2025-12-02 05:38:55'),
(112, 6, 'project_comment', 'New Comment on Project', 'vj raj commented on project \"PMS (Project Management System)\": \"tyryry yryry rrty yt\"', '{\"comment_id\": 18, \"project_id\": 2, \"project_name\": \"PMS (Project Management System)\", \"commenter_name\": \"vj raj\"}', '/projects/2#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:38:55', '2025-12-02 05:38:55'),
(113, 7, 'project_comment', 'New Comment on Project', 'vj raj commented on project \"PMS (Project Management System)\": \"tyryry yryry rrty yt\"', '{\"comment_id\": 18, \"project_id\": 2, \"project_name\": \"PMS (Project Management System)\", \"commenter_name\": \"vj raj\"}', '/projects/2#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:38:55', '2025-12-02 05:38:55'),
(114, 4, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"PMS (Project Management System)\": \"ryrytryrtytytryr\"', '{\"comment_id\": 19, \"project_id\": 2, \"project_name\": \"PMS (Project Management System)\", \"commenter_name\": \"Admin Manager\"}', '/projects/2#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:48:43', '2025-12-02 05:48:43'),
(115, 6, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"PMS (Project Management System)\": \"ryrytryrtytytryr\"', '{\"comment_id\": 19, \"project_id\": 2, \"project_name\": \"PMS (Project Management System)\", \"commenter_name\": \"Admin Manager\"}', '/projects/2#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:48:43', '2025-12-02 05:48:43'),
(116, 7, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"PMS (Project Management System)\": \"ryrytryrtytytryr\"', '{\"comment_id\": 19, \"project_id\": 2, \"project_name\": \"PMS (Project Management System)\", \"commenter_name\": \"Admin Manager\"}', '/projects/2#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:48:43', '2025-12-02 05:48:43'),
(117, 3, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(118, 4, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(119, 5, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(120, 6, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(121, 7, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(122, 8, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(123, 9, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"tryryryry\"', '{\"comment_id\": 20, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(124, 3, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(125, 4, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(126, 5, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(127, 6, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(128, 7, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(129, 8, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(130, 9, 'project_comment', 'New Comment on Project', 'Admin Manager commented on project \"KooK MIN Website\": \"ttyryry tryryryr\"', '{\"comment_id\": 21, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Admin Manager\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(131, 3, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(132, 4, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(133, 5, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(134, 6, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(135, 7, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(136, 8, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(137, 9, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(138, 10, 'project_comment', 'New Comment on Project', 'Rahul Chopra commented on project \"KooK MIN Website\": \"hfhfhfhf\"', '{\"comment_id\": 23, \"project_id\": 1, \"project_name\": \"KooK MIN Website\", \"commenter_name\": \"Rahul Chopra\"}', '/projects/1#comments', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25'),
(139, 3, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(140, 4, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(141, 5, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(142, 6, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(143, 7, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(144, 8, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(145, 9, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(146, 10, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(147, 12, 'task_comment', 'New Comment on Task', 'Admin Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 43, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, '2025-12-03 00:01:54', 'in_app', 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:54'),
(148, 3, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(149, 4, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(150, 5, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(151, 6, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(152, 7, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(153, 8, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(154, 9, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(155, 10, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:12:53'),
(156, 12, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Completed', '{\"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"active\", \"project_id\": 1}', '/projects/1', 'high', 0, '2025-12-03 00:13:14', 'in_app', 0, NULL, '2025-12-03 00:12:53', '2025-12-03 00:13:14'),
(157, 3, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(158, 4, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(159, 5, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(160, 6, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(161, 7, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(162, 8, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(163, 9, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(164, 10, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:00'),
(165, 12, 'project_status_change', 'Project Status Changed', 'Admin Manager changed project \"KooK MIN Website\" status to Active', '{\"changed_by\": 2, \"new_status\": \"active\", \"old_status\": \"completed\", \"project_id\": 1}', '/projects/1', 'medium', 0, '2025-12-03 00:14:26', 'in_app', 0, NULL, '2025-12-03 00:14:00', '2025-12-03 00:14:26');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `action_url`, `priority`, `is_read`, `read_at`, `delivery_method`, `is_sent`, `sent_at`, `created_at`, `updated_at`) VALUES
(166, 3, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(167, 4, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(168, 5, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(169, 6, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(170, 7, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(171, 8, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(172, 9, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(173, 10, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:16:42'),
(174, 12, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'medium', 0, '2025-12-03 00:17:14', 'in_app', 0, NULL, '2025-12-03 00:16:42', '2025-12-03 00:17:14'),
(175, 3, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(176, 4, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(177, 5, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(178, 6, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(179, 7, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(180, 8, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(181, 9, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(182, 10, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:23'),
(183, 12, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, '2025-12-03 00:21:49', 'in_app', 0, NULL, '2025-12-03 00:21:23', '2025-12-03 00:21:49'),
(184, 3, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(185, 4, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(186, 5, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(187, 6, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(188, 7, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(189, 8, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(190, 9, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(191, 10, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:34:04'),
(192, 12, 'task_status_change', 'Task Status Changed', 'Admin Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, '2025-12-03 00:40:02', 'in_app', 0, NULL, '2025-12-03 00:34:04', '2025-12-03 00:40:02'),
(193, 3, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(194, 4, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(195, 5, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(196, 6, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(197, 7, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(198, 8, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(199, 9, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(200, 10, 'task_comment', 'New Comment on Task', 'Rahul Chopra commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 44, \"project_id\": 1, \"commented_by\": 12}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(201, 3, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(202, 4, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(203, 5, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(204, 6, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(205, 7, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(206, 8, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(207, 9, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(208, 10, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(209, 12, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: yttryrtytry', '{\"task_id\": 5, \"comment_id\": 45, \"project_id\": 1, \"commented_by\": 2}', '/tasks/5', 'medium', 0, '2025-12-03 03:17:01', 'in_app', 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:17:01'),
(210, 3, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(211, 4, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(212, 5, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(213, 6, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(214, 7, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(215, 8, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(216, 9, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(217, 10, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 03:39:35'),
(218, 2, 'task_status_change', 'Task Status Changed', 'Rahul Chopra changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 12, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, '2025-12-03 05:03:58', 'in_app', 0, NULL, '2025-12-03 03:39:35', '2025-12-03 05:03:58'),
(219, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:54', '2025-12-03 03:45:54'),
(220, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:54', '2025-12-03 03:45:54'),
(221, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:54', '2025-12-03 03:45:54'),
(222, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:54', '2025-12-03 03:45:54'),
(223, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(224, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(225, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(226, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(227, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(228, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(229, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(230, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 03:45:55'),
(231, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/2', 'high', 0, '2025-12-03 04:02:33', 'in_app', 0, NULL, '2025-12-03 03:45:55', '2025-12-03 04:02:33'),
(232, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(233, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(234, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(235, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(236, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(237, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(238, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(239, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 03:45:57'),
(240, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'high', 0, '2025-12-03 04:02:24', 'in_app', 0, NULL, '2025-12-03 03:45:57', '2025-12-03 04:02:24'),
(241, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 04:08:33', '2025-12-03 04:08:33'),
(242, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 04:08:33', '2025-12-03 04:08:33'),
(243, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 04:08:35', '2025-12-03 04:08:35'),
(244, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 04:08:35', '2025-12-03 04:08:35'),
(245, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, '2025-12-03 06:20:34', 'in_app', 0, NULL, '2025-12-03 04:08:37', '2025-12-03 06:20:34'),
(246, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 04:08:37', '2025-12-03 04:08:37'),
(247, 3, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(248, 4, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(249, 5, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(250, 6, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(251, 7, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(252, 8, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(253, 9, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(254, 10, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(255, 12, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(256, 14, 'task_comment', 'New Comment on Task', 'Manager Manager commented on task: test', '{\"task_id\": 6, \"comment_id\": 46, \"project_id\": 1, \"commented_by\": 2}', '/tasks/6', 'medium', 0, '2025-12-03 21:55:38', 'in_app', 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:38'),
(257, 3, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(258, 4, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(259, 5, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(260, 6, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(261, 7, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(262, 8, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(263, 10, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(264, 12, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(265, 14, 'task_comment', 'New Comment on Task', 'vj raj commented on task: Project Setup', '{\"task_id\": 4, \"comment_id\": 47, \"project_id\": 2, \"commented_by\": 9}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32'),
(266, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(267, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(268, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(269, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(270, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(271, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(272, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(273, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(274, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(275, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to In progress', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:28:26', '2025-12-04 05:28:26'),
(276, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(277, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(278, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(279, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(280, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(281, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, '2025-12-04 05:44:30', 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:30'),
(282, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(283, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(284, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Review', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-04 05:44:16', '2025-12-04 05:44:16'),
(285, 2, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:38', '2025-12-05 03:28:38'),
(286, 3, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(287, 9, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(288, 6, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(289, 5, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(290, 7, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(291, 4, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(292, 10, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:39', '2025-12-05 03:28:39'),
(293, 12, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:40', '2025-12-05 03:28:40'),
(294, 14, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:40', '2025-12-05 03:28:40'),
(295, 2, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:40', '2025-12-05 03:28:40'),
(296, 3, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:41', '2025-12-05 03:28:41'),
(297, 9, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:41', '2025-12-05 03:28:41'),
(298, 6, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:41', '2025-12-05 03:28:41'),
(299, 5, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:41', '2025-12-05 03:28:41'),
(300, 7, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:42', '2025-12-05 03:28:42'),
(301, 4, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:42', '2025-12-05 03:28:42'),
(302, 10, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:42', '2025-12-05 03:28:42'),
(303, 12, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:42', '2025-12-05 03:28:42'),
(304, 14, 'project_overdue', 'Project Overdue', 'Project \"fhfhfghgfh\" has exceeded its deadline of 5/12/2025', '{\"project_id\": 3, \"project_name\": \"fhfhfghgfh\"}', '/projects/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 03:28:42', '2025-12-05 03:28:42'),
(305, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(306, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(307, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(308, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(309, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(310, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(311, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(312, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(313, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:03', '2025-12-05 04:28:03'),
(314, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(315, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(316, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(317, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(318, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(319, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(320, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(321, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(322, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:08', '2025-12-05 04:28:08'),
(323, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(324, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `action_url`, `priority`, `is_read`, `read_at`, `delivery_method`, `is_sent`, `sent_at`, `created_at`, `updated_at`) VALUES
(325, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(326, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(327, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(328, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(329, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(330, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(331, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(332, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Completed', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:11', '2025-12-05 04:28:11'),
(333, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(334, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(335, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(336, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(337, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(338, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(339, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(340, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(341, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"test\" status to Pending', '{\"task_id\": 6, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/6', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:15', '2025-12-05 04:28:15'),
(342, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(343, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(344, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(345, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(346, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(347, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(348, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(349, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(350, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(351, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:17', '2025-12-05 04:28:17'),
(352, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(353, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(354, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(355, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(356, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(357, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(358, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(359, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(360, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:19', '2025-12-05 04:28:19'),
(361, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(362, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(363, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(364, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(365, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(366, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(367, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(368, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(369, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to In progress', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/5', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:21', '2025-12-05 04:28:21'),
(370, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(371, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(372, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(373, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(374, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(375, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(376, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(377, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(378, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:28:24', '2025-12-05 04:28:24'),
(379, 3, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:44', '2025-12-05 04:43:44'),
(380, 4, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:44', '2025-12-05 04:43:44'),
(381, 5, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:44', '2025-12-05 04:43:44'),
(382, 6, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:45', '2025-12-05 04:43:45'),
(383, 7, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:45', '2025-12-05 04:43:45'),
(384, 10, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:45', '2025-12-05 04:43:45'),
(385, 12, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:45', '2025-12-05 04:43:45'),
(386, 14, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:45', '2025-12-05 04:43:45'),
(387, 2, 'task_status_change', 'Task Status Changed', 'vj raj changed task \"Project Setup\" status to Completed', '{\"task_id\": 4, \"changed_by\": 9, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 04:43:45', '2025-12-05 04:43:45'),
(388, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(389, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(390, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(391, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(392, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(393, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(394, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(395, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(396, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Completed', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:32', '2025-12-05 06:24:32'),
(397, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(398, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(399, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(400, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(401, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(402, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(403, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(404, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(405, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:24:39', '2025-12-05 06:24:39'),
(406, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(407, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(408, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(409, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(410, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(411, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(412, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(413, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(414, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Review', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 1}', '/tasks/2', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:30', '2025-12-05 06:28:30'),
(415, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(416, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(417, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(418, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(419, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(420, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(421, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(422, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(423, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(424, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:28:33', '2025-12-05 06:28:33'),
(425, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(426, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(427, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(428, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(429, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(430, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(431, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(432, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(433, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to In progress', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:04', '2025-12-05 06:30:04'),
(434, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(435, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(436, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(437, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(438, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(439, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(440, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(441, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(442, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tryrytry\" status to Completed', '{\"task_id\": 2, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/2', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:06', '2025-12-05 06:30:06'),
(443, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(444, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(445, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(446, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(447, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(448, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(449, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(450, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(451, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(452, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:30:11', '2025-12-05 06:30:11'),
(453, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(454, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(455, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(456, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(457, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(458, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(459, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(460, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(461, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Home page design rrtt\" status to Review', '{\"task_id\": 1, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/1', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:16', '2025-12-05 06:32:16'),
(462, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(463, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(464, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(465, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(466, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(467, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(468, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(469, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(470, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25'),
(471, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:25', '2025-12-05 06:32:25');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `action_url`, `priority`, `is_read`, `read_at`, `delivery_method`, `is_sent`, `sent_at`, `created_at`, `updated_at`) VALUES
(472, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(473, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(474, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(475, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(476, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(477, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(478, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(479, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(480, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"yttryrtytry\" status to Completed', '{\"task_id\": 5, \"changed_by\": 2, \"new_status\": \"completed\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/5', 'high', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:32:38', '2025-12-05 06:32:38'),
(481, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(482, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(483, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(484, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(485, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(486, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(487, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(488, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(489, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(490, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:34:24', '2025-12-05 06:34:24'),
(491, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(492, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(493, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(494, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(495, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(496, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(497, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(498, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(499, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Review', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"completed\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:19', '2025-12-05 06:35:19'),
(500, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(501, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(502, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(503, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(504, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(505, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(506, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(507, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(508, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"review\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:35:21', '2025-12-05 06:35:21'),
(509, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:44', '2025-12-05 06:37:44'),
(510, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:44', '2025-12-05 06:37:44'),
(511, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(512, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(513, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(514, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(515, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(516, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(517, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(518, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Pending', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:45', '2025-12-05 06:37:45'),
(519, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(520, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(521, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(522, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(523, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(524, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(525, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(526, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(527, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to Pending', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"pending\", \"old_status\": \"in_progress\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:37:50', '2025-12-05 06:37:50'),
(528, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(529, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(530, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(531, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(532, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(533, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(534, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(535, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(536, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"Project Setup\" status to In progress', '{\"task_id\": 4, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 2}', '/tasks/4', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:01', '2025-12-05 06:38:01'),
(537, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(538, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(539, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(540, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(541, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(542, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(543, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(544, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(545, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(546, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to In progress', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"in_progress\", \"old_status\": \"pending\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:16', '2025-12-05 06:38:16'),
(547, 3, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(548, 4, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(549, 5, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(550, 6, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(551, 7, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(552, 9, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(553, 10, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(554, 12, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(555, 14, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24'),
(556, 8, 'task_status_change', 'Task Status Changed', 'Manager Manager changed task \"tytrytrytr bbb\" status to Review', '{\"task_id\": 3, \"changed_by\": 2, \"new_status\": \"review\", \"old_status\": \"in_progress\", \"project_id\": 1}', '/tasks/3', 'medium', 0, NULL, 'in_app', 0, NULL, '2025-12-05 06:38:24', '2025-12-05 06:38:24');

-- --------------------------------------------------------

--
-- Table structure for table `otp_verifications`
--

DROP TABLE IF EXISTS `otp_verifications`;
CREATE TABLE IF NOT EXISTS `otp_verifications` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('email_verification','password_reset','two_factor') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `used_at` timestamp NULL DEFAULT NULL,
  `ip_address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `otp_verifications_email_type_is_used_index` (`email`,`type`,`is_used`),
  KEY `otp_verifications_expires_at_index` (`expires_at`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_name_unique` (`name`),
  KEY `permissions_category_index` (`category`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `display_name`, `description`, `category`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'users.create', 'Create Users', NULL, 'users', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(2, 'users.view', 'View Users', NULL, 'users', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(3, 'users.update', 'Update Users', NULL, 'users', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(4, 'users.delete', 'Delete Users', NULL, 'users', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(5, 'users.manage_roles', 'Manage User Roles', NULL, 'users', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(6, 'teams.create', 'Create Teams', NULL, 'teams', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(7, 'teams.view', 'View Teams', NULL, 'teams', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(8, 'teams.update', 'Update Teams', NULL, 'teams', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(9, 'teams.delete', 'Delete Teams', NULL, 'teams', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(10, 'teams.manage_members', 'Manage Team Members', NULL, 'teams', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(11, 'projects.create', 'Create Projects', NULL, 'projects', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(12, 'projects.view', 'View Projects', NULL, 'projects', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(13, 'projects.update', 'Update Projects', NULL, 'projects', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(14, 'projects.delete', 'Delete Projects', NULL, 'projects', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(15, 'projects.manage_team', 'Manage Project Teams', NULL, 'projects', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(16, 'tasks.create', 'Create Tasks', NULL, 'tasks', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(17, 'tasks.view', 'View Tasks', NULL, 'tasks', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(18, 'tasks.update', 'Update Tasks', NULL, 'tasks', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(19, 'tasks.delete', 'Delete Tasks', NULL, 'tasks', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(20, 'tasks.change_status', 'Change Task Status', NULL, 'tasks', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(21, 'tasks.assign', 'Assign Tasks', NULL, 'tasks', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(22, 'comments.create', 'Create Comments', NULL, 'comments', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(23, 'comments.update', 'Update Comments', NULL, 'comments', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(24, 'comments.delete', 'Delete Comments', NULL, 'comments', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(25, 'files.upload', 'Upload Files', NULL, 'files', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(26, 'files.delete', 'Delete Files', NULL, 'files', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(27, 'notifications.view', 'View Notifications', NULL, 'notifications', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(28, 'reports.view', 'View Reports', NULL, 'reports', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(29, 'roles.manage', 'Manage Roles', NULL, 'system', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(30, 'permissions.manage', 'Manage Permissions', NULL, 'system', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10'),
(31, 'settings.manage', 'Manage Settings', NULL, 'system', 1, '2025-12-02 11:39:10', '2025-12-02 11:39:10');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('planning','active','on_hold','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'planning',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `progress` int NOT NULL DEFAULT '0',
  `manager_id` bigint UNSIGNED NOT NULL,
  `team_lead_id` bigint UNSIGNED DEFAULT NULL,
  `settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projects_team_lead_id_foreign` (`team_lead_id`),
  KEY `projects_status_priority_index` (`status`,`priority`),
  KEY `projects_manager_id_team_lead_id_index` (`manager_id`,`team_lead_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `status`, `priority`, `start_date`, `end_date`, `budget`, `progress`, `manager_id`, `team_lead_id`, `settings`, `created_at`, `updated_at`) VALUES
(1, 'KooK MIN Website', 'KooK MIN Website', 'active', 'medium', '2025-09-16', '2025-12-30', 500000.00, 14, 2, 3, '[]', '2025-09-14 22:05:51', '2025-12-03 00:14:00'),
(2, 'PMS (Project Management System)', 'fkjhkjgdf k gdkfhgdf gdkjghd gdkjfhg kjdfg hdkfjg hdjf ieryireuyt ei iedfhkjdfghdf dkfjhgkjdfh dfgjdfh kjhdfkfdjkhgkj', 'planning', 'high', '2025-12-03', '2025-12-06', 20000000.00, 20, 2, 9, '[]', '2025-12-01 04:35:31', '2025-12-02 05:36:57'),
(3, 'fhfhfghgfh', 'fghgfhfhfgh', 'planning', 'high', '2025-12-03', '2025-12-05', 5000000.00, 0, 2, 3, '[]', '2025-12-02 02:25:21', '2025-12-02 02:25:21'),
(4, 'yyyyyyy', 'yyyyyyyyyyy', 'active', 'high', '2025-12-11', '2025-12-11', NULL, 0, 2, 3, '[]', '2025-12-02 02:26:31', '2025-12-02 02:26:31');

-- --------------------------------------------------------

--
-- Table structure for table `project_comments`
--

DROP TABLE IF EXISTS `project_comments`;
CREATE TABLE IF NOT EXISTS `project_comments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `attachment_paths` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_comments_user_id_foreign` (`user_id`),
  KEY `project_comments_project_id_created_at_index` (`project_id`,`created_at`),
  KEY `project_comments_parent_id_index` (`parent_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_comments`
--

INSERT INTO `project_comments` (`id`, `project_id`, `user_id`, `comment`, `parent_id`, `attachment_paths`, `created_at`, `updated_at`) VALUES
(2, 1, 2, 'yrtyrytrytr', NULL, '[\"project_comment_attachments/gOJZ8PWcnBPQmG8cHMU2XJRXh4s5RNZLDQNlsUo8.png\"]', '2025-11-19 02:52:24', '2025-11-19 02:52:24'),
(3, 1, 2, 'retretertretert', NULL, NULL, '2025-11-19 02:52:33', '2025-11-19 02:52:33'),
(4, 1, 2, '@[vj raj](9)', NULL, NULL, '2025-11-19 02:53:15', '2025-11-19 02:53:15'),
(5, 1, 2, 'tytryrrtyrtyryyrty', NULL, NULL, '2025-11-19 06:17:37', '2025-11-19 06:17:37'),
(6, 1, 2, 'ytutuytuytuytu', NULL, NULL, '2025-11-19 06:19:25', '2025-11-19 06:19:25'),
(7, 2, 2, 'yuytuytutyut', NULL, NULL, '2025-12-01 04:35:49', '2025-12-01 04:35:49'),
(8, 4, 2, 'uiyiyiyi', NULL, NULL, '2025-12-02 02:55:40', '2025-12-02 02:55:40'),
(9, 1, 2, 'yuiuiyuiyui', 3, '[\"project_comment_attachments/KzmNdx6MIXdTeZQZxXLaRJXHOgQrezXp2GZ7diGm.png\"]', '2025-12-02 03:50:28', '2025-12-02 03:50:28'),
(10, 1, 2, 'tytrytrytrytrytr', NULL, NULL, '2025-12-02 05:09:21', '2025-12-02 05:09:21'),
(11, 1, 2, 'ytuyuytuytuytu', 10, NULL, '2025-12-02 05:12:58', '2025-12-02 05:12:58'),
(12, 2, 2, 'ryyrtrr ryrtytrytryr', NULL, NULL, '2025-12-02 05:19:53', '2025-12-02 05:19:53'),
(13, 2, 2, 'ytuytuytutyuytu', NULL, NULL, '2025-12-02 05:20:25', '2025-12-02 05:20:25'),
(14, 2, 9, 'uuytuty uytuytuty', NULL, NULL, '2025-12-02 05:26:52', '2025-12-02 05:26:52'),
(15, 2, 2, 'yyutyutuyt 675757655 676576565', NULL, NULL, '2025-12-02 05:27:11', '2025-12-02 05:27:11'),
(16, 1, 2, 'rtytrytrr ryrty rtytryr ty', NULL, NULL, '2025-12-02 05:29:02', '2025-12-02 05:29:02'),
(17, 1, 2, 'tytryrtyr yrtytryryr', NULL, NULL, '2025-12-02 05:29:44', '2025-12-02 05:29:44'),
(18, 2, 9, 'tyryry yryry rrty yt', NULL, NULL, '2025-12-02 05:38:55', '2025-12-02 05:38:55'),
(19, 2, 2, 'ryrytryrtytytryr', NULL, NULL, '2025-12-02 05:48:43', '2025-12-02 05:48:43'),
(20, 1, 2, 'tryryryry', NULL, NULL, '2025-12-02 05:50:04', '2025-12-02 05:50:04'),
(21, 1, 2, 'ttyryry tryryryr', NULL, NULL, '2025-12-02 11:54:57', '2025-12-02 11:54:57'),
(22, 4, 2, 'ertertetre', NULL, NULL, '2025-12-02 12:19:21', '2025-12-02 12:19:21'),
(23, 1, 12, 'hfhfhfhf', NULL, NULL, '2025-12-02 23:50:25', '2025-12-02 23:50:25');

-- --------------------------------------------------------

--
-- Table structure for table `project_team`
--

DROP TABLE IF EXISTS `project_team`;
CREATE TABLE IF NOT EXISTS `project_team` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint UNSIGNED NOT NULL,
  `team_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_team_project_id_team_id_unique` (`project_id`,`team_id`),
  KEY `project_team_team_id_foreign` (`team_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `project_team`
--

INSERT INTO `project_team` (`id`, `project_id`, `team_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-12-03 05:02:42', '2025-12-03 05:02:42'),
(2, 3, 2, '2025-12-03 05:02:42', '2025-12-03 05:02:42'),
(3, 4, 2, '2025-12-03 05:03:38', '2025-12-03 05:03:38'),
(4, 2, 1, '2025-12-03 05:03:48', '2025-12-03 05:03:48'),
(5, 3, 1, '2025-12-03 05:06:33', '2025-12-03 05:06:33'),
(6, 4, 1, '2025-12-03 05:06:40', '2025-12-03 05:06:40');

-- --------------------------------------------------------

--
-- Table structure for table `resource_access`
--

DROP TABLE IF EXISTS `resource_access`;
CREATE TABLE IF NOT EXISTS `resource_access` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `resource_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `resource_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `owner_id` bigint UNSIGNED DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `resource_access_resource_type_resource_id_index` (`resource_type`,`resource_id`),
  KEY `resource_access_created_by_index` (`created_by`),
  KEY `resource_access_owner_id_index` (`owner_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `display_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `permissions` json NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_name_unique` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `display_name`, `description`, `permissions`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'super_admin', 'Super Admin', 'Complete system access with all administrative privileges', '{\"rooms\": [\"create\", \"read\", \"update\", \"delete\"], \"tasks\": [\"create\", \"read\", \"update\", \"delete\", \"assign\"], \"teams\": [\"create\", \"read\", \"update\", \"delete\"], \"users\": [\"create\", \"read\", \"update\", \"delete\", \"manage_all_roles\"], \"system\": [\"full_access\"], \"reports\": [\"view_all\", \"export\"], \"projects\": [\"create\", \"read\", \"update\", \"delete\", \"assign_team_lead\"], \"settings\": [\"manage\"], \"notifications\": [\"send_all\"]}', 1, '2025-09-13 18:48:27', '2025-09-13 18:48:27'),
(2, 'manager', 'Manager', 'Project management with team lead and team member management', '[\"users.create\", \"users.view\", \"users.update\", \"users.delete\", \"users.manage_roles\", \"teams.create\", \"teams.view\", \"teams.update\", \"teams.delete\", \"teams.manage_members\"]', 1, '2025-09-13 18:48:27', '2025-12-03 02:47:24'),
(3, 'team_lead', 'Team Lead', 'Team management with team member management only', '{\"rooms\": [\"create\", \"read\", \"update_own\", \"delete_own\"], \"tasks\": [\"create\", \"read\", \"update\", \"assign_to_team\"], \"teams\": [\"read\", \"update_own\", \"manage_members\"], \"users\": [\"create_team_member\", \"read_team_members\", \"update_team_member\"], \"reports\": [\"view_team\"], \"projects\": [\"read\"], \"notifications\": [\"send_team\"]}', 1, '2025-09-13 18:48:27', '2025-09-13 18:48:27'),
(4, 'team_member', 'Team Member', 'Basic task management and collaboration capabilities', '{\"rooms\": [\"read_team\", \"participate\"], \"tasks\": [\"read_assigned\", \"update_own\", \"comment\"], \"teams\": [\"read_own\"], \"users\": [\"read_team_members\"], \"reports\": [\"view_own\"], \"projects\": [\"read_assigned\"], \"notifications\": [\"receive\"]}', 1, '2025-09-13 18:48:27', '2025-09-13 18:48:27'),
(5, 'admin', 'Admin', 'Can manage everything inside the organization', '{\"rooms\": [\"create\", \"read\", \"update\", \"delete\"], \"tasks\": [\"create\", \"read\", \"update\", \"delete\", \"assign\"], \"teams\": [\"create\", \"read\", \"update\", \"delete\"], \"users\": [\"create\", \"read\", \"update\", \"delete\", \"manage_all_roles\"], \"system\": [\"full_access\"], \"reports\": [\"view_all\", \"export\"], \"projects\": [\"create\", \"read\", \"update\", \"delete\", \"assign_team_lead\"], \"settings\": [\"manage\"], \"notifications\": [\"send_all\"]}', 1, '2025-12-02 11:39:36', '2025-12-03 02:59:38');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `role_id` bigint UNSIGNED NOT NULL,
  `permission_id` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_id_permission_id_unique` (`role_id`,`permission_id`),
  KEY `role_permissions_role_id_index` (`role_id`),
  KEY `role_permissions_permission_id_index` (`permission_id`)
) ENGINE=MyISAM AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(1, 1, 1, NULL, NULL),
(2, 1, 2, NULL, NULL),
(3, 1, 3, NULL, NULL),
(4, 1, 4, NULL, NULL),
(5, 1, 5, NULL, NULL),
(6, 1, 6, NULL, NULL),
(7, 1, 7, NULL, NULL),
(8, 1, 8, NULL, NULL),
(9, 1, 9, NULL, NULL),
(10, 1, 10, NULL, NULL),
(11, 1, 11, NULL, NULL),
(12, 1, 12, NULL, NULL),
(13, 1, 13, NULL, NULL),
(14, 1, 14, NULL, NULL),
(15, 1, 15, NULL, NULL),
(16, 1, 16, NULL, NULL),
(17, 1, 17, NULL, NULL),
(18, 1, 18, NULL, NULL),
(19, 1, 19, NULL, NULL),
(20, 1, 20, NULL, NULL),
(21, 1, 21, NULL, NULL),
(22, 1, 22, NULL, NULL),
(23, 1, 23, NULL, NULL),
(24, 1, 24, NULL, NULL),
(25, 1, 25, NULL, NULL),
(26, 1, 26, NULL, NULL),
(27, 1, 27, NULL, NULL),
(28, 1, 28, NULL, NULL),
(29, 1, 29, NULL, NULL),
(30, 1, 30, NULL, NULL),
(31, 1, 31, NULL, NULL),
(116, 2, 6, NULL, NULL),
(115, 2, 5, NULL, NULL),
(114, 2, 3, NULL, NULL),
(113, 2, 4, NULL, NULL),
(112, 2, 2, NULL, NULL),
(111, 2, 1, NULL, NULL),
(120, 2, 10, NULL, NULL),
(119, 2, 9, NULL, NULL),
(118, 2, 8, NULL, NULL),
(117, 2, 7, NULL, NULL),
(86, 3, 12, NULL, NULL),
(87, 3, 13, NULL, NULL),
(88, 3, 15, NULL, NULL),
(89, 3, 16, NULL, NULL),
(90, 3, 17, NULL, NULL),
(91, 3, 18, NULL, NULL),
(92, 3, 20, NULL, NULL),
(93, 3, 21, NULL, NULL),
(94, 3, 22, NULL, NULL),
(95, 3, 23, NULL, NULL),
(96, 3, 24, NULL, NULL),
(97, 3, 25, NULL, NULL),
(98, 3, 26, NULL, NULL),
(99, 3, 27, NULL, NULL),
(100, 3, 28, NULL, NULL),
(101, 4, 12, NULL, NULL),
(102, 4, 17, NULL, NULL),
(103, 4, 18, NULL, NULL),
(104, 4, 20, NULL, NULL),
(105, 4, 22, NULL, NULL),
(106, 4, 23, NULL, NULL),
(107, 4, 24, NULL, NULL),
(108, 4, 25, NULL, NULL),
(109, 4, 26, NULL, NULL),
(110, 4, 27, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE IF NOT EXISTS `rooms` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `team_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `type` enum('meeting','workspace','discussion','private') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'workspace',
  `capacity` int NOT NULL DEFAULT '50',
  `status` enum('active','inactive','archived') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rooms_team_id_status_index` (`team_id`,`status`),
  KEY `rooms_created_by_index` (`created_by`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'medium',
  `status` enum('pending','in_progress','review','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `deadline` datetime DEFAULT NULL,
  `estimated_hours` int DEFAULT NULL,
  `actual_hours` int DEFAULT NULL,
  `progress` decimal(5,2) NOT NULL DEFAULT '0.00',
  `project_id` bigint UNSIGNED NOT NULL,
  `assigned_to` bigint UNSIGNED DEFAULT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `parent_task_id` bigint UNSIGNED DEFAULT NULL,
  `recurrence_type` enum('none','daily','weekly','monthly') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `recurrence_settings` json DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `tags` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_parent_task_id_foreign` (`parent_task_id`),
  KEY `tasks_project_id_status_priority_index` (`project_id`,`status`,`priority`),
  KEY `tasks_assigned_to_status_index` (`assigned_to`,`status`),
  KEY `tasks_created_by_deadline_index` (`created_by`,`deadline`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `priority`, `status`, `deadline`, `estimated_hours`, `actual_hours`, `progress`, `project_id`, `assigned_to`, `created_by`, `parent_task_id`, `recurrence_type`, `recurrence_settings`, `completed_at`, `tags`, `created_at`, `updated_at`) VALUES
(1, 'Home page design rrtt', '<p>Home page design</p><p>tret</p><p><br></p><p>eert</p><p>r</p><p>te</p><p>tre</p><p>t</p><p>ert</p><p><br></p><p><br></p>', 'medium', 'review', '2025-09-17 00:00:00', NULL, 4, 100.00, 1, 6, 2, NULL, 'none', NULL, '2025-12-05 11:54:32', NULL, '2025-09-14 22:07:21', '2025-12-05 06:32:16'),
(2, 'tryrytry', 'rtytryrty', 'medium', 'completed', '2025-11-20 00:00:00', NULL, NULL, 100.00, 1, 3, 2, NULL, 'none', NULL, '2025-12-05 12:00:06', NULL, '2025-11-12 05:49:24', '2025-12-05 06:30:06'),
(3, 'tytrytrytr bbb', '<p>rtytrytrytr tryryrtyr rtyry</p>', 'medium', 'review', '2025-11-20 00:00:00', NULL, NULL, 100.00, 1, 8, 2, NULL, 'none', NULL, '2025-12-05 09:58:11', NULL, '2025-11-17 22:10:37', '2025-12-05 06:38:24'),
(4, 'Project Setup', '<p><strong>yrerey yt iuetiueytiuet ie iue ytiueyte yteiutyeiutye tieu tiueryte tieuyteiu teiu yteiut yeu teiu</strong></p>', 'medium', 'in_progress', '2025-12-02 00:00:00', NULL, NULL, 100.00, 2, 7, 2, NULL, 'none', NULL, '2025-12-05 10:13:44', NULL, '2025-12-01 04:37:26', '2025-12-05 06:38:01'),
(5, 'yttryrtytry', '<p>rtytrytry</p>', 'medium', 'completed', '2025-12-12 00:00:00', NULL, NULL, 100.00, 1, 12, 2, NULL, 'none', NULL, '2025-12-05 12:02:38', NULL, '2025-12-02 23:49:35', '2025-12-05 06:32:38'),
(6, 'test', '<p>yuyuyttut tutyuytut</p>', 'low', 'pending', '2025-12-05 00:00:00', NULL, NULL, 0.00, 1, 14, 2, NULL, 'none', NULL, NULL, NULL, '2025-12-03 21:54:39', '2025-12-05 04:28:15');

-- --------------------------------------------------------

--
-- Table structure for table `task_attachments`
--

DROP TABLE IF EXISTS `task_attachments`;
CREATE TABLE IF NOT EXISTS `task_attachments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` bigint UNSIGNED NOT NULL,
  `uploaded_by` bigint UNSIGNED NOT NULL,
  `filename` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `original_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mime_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_attachments_task_id_index` (`task_id`),
  KEY `task_attachments_uploaded_by_index` (`uploaded_by`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_comments`
--

DROP TABLE IF EXISTS `task_comments`;
CREATE TABLE IF NOT EXISTS `task_comments` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `task_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` bigint UNSIGNED DEFAULT NULL,
  `attachment_paths` json DEFAULT NULL,
  `is_edited` tinyint(1) NOT NULL DEFAULT '0',
  `edited_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `task_comments_parent_id_foreign` (`parent_id`),
  KEY `task_comments_task_id_created_at_index` (`task_id`,`created_at`),
  KEY `task_comments_user_id_index` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `task_comments`
--

INSERT INTO `task_comments` (`id`, `task_id`, `user_id`, `comment`, `parent_id`, `attachment_paths`, `is_edited`, `edited_at`, `created_at`, `updated_at`) VALUES
(1, 1, 3, 'ryeuteteoteote', NULL, NULL, 0, NULL, '2025-09-15 13:04:57', '2025-09-15 13:04:57'),
(2, 1, 3, 'uyriurwytuirtywiutwtwtw\r\n\r\neiwyiuweywutwotwt', NULL, NULL, 0, NULL, '2025-09-15 13:05:13', '2025-09-15 13:05:13'),
(3, 1, 2, 'jldfhgdfghdfl', NULL, NULL, 0, NULL, '2025-09-15 13:16:08', '2025-09-15 13:16:08'),
(4, 1, 2, 'euwoiruwoeuroiewr erreeretret', NULL, NULL, 0, NULL, '2025-11-12 03:18:22', '2025-11-12 03:18:22'),
(5, 1, 2, 'ertretretret', NULL, NULL, 0, NULL, '2025-11-12 03:18:46', '2025-11-12 03:18:46'),
(6, 1, 2, 'ertretretret', NULL, NULL, 0, NULL, '2025-11-12 03:18:50', '2025-11-12 03:18:50'),
(7, 1, 2, 'ertretretret', NULL, NULL, 0, NULL, '2025-11-12 03:18:54', '2025-11-12 03:18:54'),
(8, 1, 2, 'ertretretret', NULL, NULL, 0, NULL, '2025-11-12 03:19:26', '2025-11-12 03:19:26'),
(9, 1, 3, 'hfkshkfsff etrtt yeye', NULL, NULL, 0, NULL, '2025-11-13 21:48:52', '2025-11-13 21:48:52'),
(10, 1, 2, 'ytutyuytuytuyt ytuytuyt tyuty utyu tyuyt', NULL, NULL, 0, NULL, '2025-11-17 01:03:08', '2025-11-17 01:03:08'),
(11, 1, 2, 'rtyrtyryrtyrtyr', NULL, NULL, 0, NULL, '2025-11-17 01:27:30', '2025-11-17 01:27:30'),
(12, 1, 2, 'rtyrtyryrtyrtyr', NULL, NULL, 0, NULL, '2025-11-17 01:27:47', '2025-11-17 01:27:47'),
(13, 1, 2, 'tutyuytt ytuytutyuytut tyuytuytuty tyuyt', NULL, NULL, 0, NULL, '2025-11-17 03:03:17', '2025-11-17 03:03:17'),
(14, 1, 2, 'aaaaaaaaaaaaaa', NULL, NULL, 0, NULL, '2025-11-17 03:05:07', '2025-11-17 21:56:17'),
(15, 1, 2, 'tutyuytt ytuytutyuytut tyuytuytuty tyuyt', NULL, NULL, 0, NULL, '2025-11-17 03:05:33', '2025-11-17 03:05:33'),
(16, 1, 2, 'cxvcxvcxvx dgfddgdgdfgd fdgdgd', NULL, '[\"task_comment_attachments/EIGtyspb1JtTqEe9xWjyvye8Z8k0a5iKplmPERSP.png\"]', 0, NULL, '2025-11-17 03:09:25', '2025-11-17 03:09:25'),
(17, 1, 2, 'hhfjhjhgjg ytutyutu', NULL, '[\"task_comment_attachments/FjhmPsCcnBCjHHBP463yYZfY3XPKqc0OtfuiAy2A.png\", \"task_comment_attachments/wGQamu40TdlSYL9srxQUfUNpg3cJPHfXx7jEDy9c.png\", \"task_comment_attachments/W9BA6zU2clnV3pG0F6hhDnhtpT6A8G94dzcbnPcV.png\", \"task_comment_attachments/uThrLv7YY6Lj054MHkuYjRnIybPkCSsE5cKG3D3K.png\"]', 0, NULL, '2025-11-17 03:10:17', '2025-11-17 03:10:17'),
(18, 1, 2, 'bmnbmbnmnb uutu tyuyu', NULL, '[\"task_comment_attachments/SfbdQK1v8u4SCp8af1U8kFX6qvHlQZ8S9XviGJlZ.png\"]', 0, NULL, '2025-11-17 03:13:34', '2025-11-17 03:13:34'),
(19, 1, 2, 'utyututmyuiyiyimyuiyuimyu', 1, '[\"task_comment_attachments/8I3TN8JyYW7I9mheXwNI48tB6wC4uQFwWaFeraWy.png\", \"task_comment_attachments/mSenWkKZoajfb8hvJnOvzqlMzHkQoEQsCoqbP9NF.png\", \"task_comment_attachments/L8CxslUg8SfVjp2Uo1PNispBNxCegBFHWqPUXGsI.png\", \"task_comment_attachments/F2SRfe4p9V9kUT6cvYLIwO9q8NLTCwaxdEQfmVEb.png\"]', 0, NULL, '2025-11-17 03:31:54', '2025-11-17 22:54:35'),
(20, 1, 2, 'ytutyut', 1, '[\"task_comment_attachments/eysHVOrO8UdfT8atsMMG2Rpx7ziBcNYWv1aqw36v.png\"]', 0, NULL, '2025-11-17 03:34:29', '2025-11-17 03:34:29'),
(21, 1, 2, 'tyryr yryrt', NULL, '[\"task_comment_attachments/pIaUwk1IDdTTYnAqOSTg1zdwawEpR10r6FDymhWj.png\"]', 0, NULL, '2025-11-17 04:29:39', '2025-11-17 04:29:39'),
(22, 1, 2, 'yrruu', 20, NULL, 0, NULL, '2025-11-17 04:45:06', '2025-11-17 04:45:06'),
(23, 1, 2, 'rrrrrr', 22, '[\"task_comment_attachments/I4AFWnRMw5MthcHi2CaFpCtPRNeyDnBZrSN6VTdn.png\"]', 0, NULL, '2025-11-17 04:45:37', '2025-11-17 04:45:37'),
(25, 1, 2, 'ttrytryrryrtyry tertrete', NULL, '[\"task_comment_attachments/vetF7lHv3tmrWGmwHM6GSkCTjv74NTfZloPepDBW.pdf\"]', 0, NULL, '2025-11-17 04:48:22', '2025-11-17 04:48:22'),
(26, 1, 2, 'uytutyuytt', 19, '[\"task_comment_attachments/b99DcYxYkRm9RHzDX2S8yd8juQjC8DBIEWHpMSmY.png\"]', 0, NULL, '2025-11-17 05:06:21', '2025-11-17 05:06:21'),
(27, 1, 2, 'uiyuiuyiyu', 26, '[\"task_comment_attachments/rWCruo9ETHu2wjPlemi5EdVlnHxitaT6sOqAbOfx.pdf\"]', 0, NULL, '2025-11-17 05:06:53', '2025-11-17 05:06:53'),
(28, 1, 2, 'trryryrtyr', NULL, NULL, 0, NULL, '2025-11-17 06:25:54', '2025-11-17 06:25:54'),
(29, 1, 2, 'trytrytrytryr ryrtytr', NULL, NULL, 0, NULL, '2025-11-17 06:28:37', '2025-11-17 06:28:37'),
(30, 1, 2, 'rteerter etertre', NULL, NULL, 0, NULL, '2025-11-17 06:36:32', '2025-11-17 06:36:32'),
(31, 1, 2, 'uuytuyttuytutu', NULL, NULL, 0, NULL, '2025-11-17 06:40:51', '2025-11-17 06:40:51'),
(32, 1, 2, 'yutuytuytyutyut', NULL, NULL, 0, NULL, '2025-11-17 06:45:18', '2025-11-17 06:45:18'),
(33, 1, 2, 'ytutyutuytuytut', 32, NULL, 0, NULL, '2025-11-17 06:45:37', '2025-11-17 06:45:37'),
(34, 1, 2, 'ytuytuytutyuytutut', NULL, NULL, 0, NULL, '2025-11-17 21:49:23', '2025-11-17 21:49:23'),
(36, 1, 2, '@[Vijayraj Chaudhary](8)', NULL, NULL, 0, NULL, '2025-11-17 22:08:43', '2025-11-17 22:08:43'),
(37, 1, 2, 'ytiytiytiuytinttyoituonyuornyuroy  ryyiuyr r', NULL, '[\"task_comment_attachments/jMalegZJVc1OCG3BM74KgmOaUW7fuYsxVgRqnhqF.png\", \"task_comment_attachments/yVimtFZY5cxhOsg99D25LInxQSDosnZznS7UPaAH.png\", \"task_comment_attachments/RRh9ogHMrIs6h9I5EFCXOSGRly17HdrCHBh2Qrda.png\", \"task_comment_attachments/iwWjpredYNeuVFaPpDVwfEgyyVDvkNQBuSvc9q2R.png\", \"task_comment_attachments/m6ywxma2ZuIMLKuFueTqO7WOqDKjrI4aEwx9lceh.png\", \"task_comment_attachments/DMq4tPK10TXha0mi0S9g8MyopP4bFBA4lhnpYhNr.png\", \"task_comment_attachments/IIzyMN5tT35CeagqoWBYWyY8sFPJE6tVgj7mLgKn.png\", \"task_comment_attachments/U4Qtqw6b78ByqSFZxsgzM3D8WpVjRmtFWQHzKJrJ.png\", \"task_comment_attachments/rV3xrBBdte34VYN1KBjYLLDXS27sqZv2bdIe6JQk.png\", \"task_comment_attachments/5FC7nhdzxLiz82RcDUnTQu2vNPIaisB8OhJNX7nt.png\"]', 0, NULL, '2025-11-17 22:15:56', '2025-11-17 22:15:56'),
(38, 1, 2, 'https://www.lgindiasocial.com/microsites/cfm', NULL, NULL, 0, NULL, '2025-11-19 00:08:58', '2025-11-19 00:08:58'),
(39, 1, 2, '@[Vijayraj Chaudhary](8)', NULL, NULL, 0, NULL, '2025-12-01 00:29:02', '2025-12-01 00:29:02'),
(40, 5, 2, 'yuytut yruyrryrur', NULL, NULL, 0, NULL, '2025-12-02 23:51:57', '2025-12-02 23:51:57'),
(41, 5, 12, 'gdgdgdfgdfg', NULL, NULL, 0, NULL, '2025-12-02 23:52:47', '2025-12-02 23:52:47'),
(42, 5, 2, 'hfjffjf trytrrtyr rtrtyrt r', NULL, NULL, 0, NULL, '2025-12-02 23:57:14', '2025-12-02 23:57:14'),
(43, 5, 2, 'fhfghfgh trytryr', NULL, NULL, 0, NULL, '2025-12-03 00:01:33', '2025-12-03 00:01:33'),
(44, 5, 12, 'tuytutyuytut', NULL, NULL, 0, NULL, '2025-12-03 03:16:02', '2025-12-03 03:16:02'),
(45, 5, 2, 'uttutyuytuyt', NULL, NULL, 0, NULL, '2025-12-03 03:16:46', '2025-12-03 03:16:46'),
(46, 6, 2, 'yrtytryry', NULL, NULL, 0, NULL, '2025-12-03 21:55:10', '2025-12-03 21:55:10'),
(47, 4, 9, 'ututtyuyt', NULL, NULL, 0, NULL, '2025-12-04 00:15:32', '2025-12-04 00:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
CREATE TABLE IF NOT EXISTS `teams` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `project_id` bigint UNSIGNED DEFAULT NULL,
  `team_lead_id` bigint UNSIGNED NOT NULL,
  `max_members` int NOT NULL DEFAULT '10',
  `status` enum('active','inactive','disbanded') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_by` bigint UNSIGNED DEFAULT NULL,
  `settings` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teams_project_id_status_index` (`project_id`,`status`),
  KEY `teams_team_lead_id_index` (`team_lead_id`),
  KEY `teams_created_by_foreign` (`created_by`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `description`, `project_id`, `team_lead_id`, `max_members`, `status`, `created_by`, `settings`, `created_at`, `updated_at`) VALUES
(1, 'DotCom Team s', 'DotCom Team', 4, 9, 10, 'active', 2, NULL, '2025-09-14 22:06:36', '2025-12-03 05:49:50'),
(2, 'PMS TEAM', 'yjghjhgjhg yuytuty ytuytut', 4, 3, 100, 'active', 2, NULL, '2025-12-01 04:49:12', '2025-12-03 05:17:38'),
(3, 'jghhgjgh', 'hgjhgjhgj', NULL, 9, 10, 'active', 2, NULL, '2025-12-02 01:17:11', '2025-12-02 01:17:11');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
CREATE TABLE IF NOT EXISTS `team_members` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `team_id` bigint UNSIGNED NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `role` enum('member','senior_member','coordinator') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'member',
  `joined_at` date NOT NULL,
  `left_at` date DEFAULT NULL,
  `status` enum('active','inactive','removed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_members_team_id_user_id_unique` (`team_id`,`user_id`),
  KEY `team_members_team_id_status_index` (`team_id`,`status`),
  KEY `team_members_user_id_index` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `team_members`
--

INSERT INTO `team_members` (`id`, `team_id`, `user_id`, `role`, `joined_at`, `left_at`, `status`, `created_at`, `updated_at`) VALUES
(2, 1, 6, 'member', '2025-09-15', NULL, 'active', '2025-09-15 12:33:00', '2025-09-15 12:33:00'),
(4, 1, 5, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:43:10', '2025-12-01 04:43:10'),
(5, 1, 3, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:43:13', '2025-12-01 04:43:13'),
(6, 1, 9, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:43:17', '2025-12-01 04:43:17'),
(7, 1, 7, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:43:19', '2025-12-01 04:43:19'),
(8, 1, 4, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:43:22', '2025-12-01 04:43:22'),
(9, 2, 4, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:52:00', '2025-12-01 04:52:00'),
(10, 2, 6, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:52:04', '2025-12-01 04:52:04'),
(11, 2, 7, 'member', '2025-12-01', NULL, 'active', '2025-12-01 04:52:12', '2025-12-01 04:52:12'),
(12, 3, 4, 'member', '2025-12-02', NULL, 'active', '2025-12-02 01:17:54', '2025-12-02 01:17:54'),
(13, 3, 6, 'member', '2025-12-02', NULL, 'active', '2025-12-02 01:18:01', '2025-12-02 01:18:01'),
(14, 3, 5, 'member', '2025-12-02', NULL, 'active', '2025-12-02 01:18:10', '2025-12-02 01:18:10'),
(15, 1, 10, 'member', '2025-12-02', NULL, 'active', '2025-12-02 12:00:59', '2025-12-02 12:00:59'),
(16, 1, 12, 'member', '2025-12-03', NULL, 'active', '2025-12-02 23:26:00', '2025-12-02 23:26:00'),
(17, 1, 14, 'member', '2025-12-04', NULL, 'active', '2025-12-03 21:53:19', '2025-12-03 21:53:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `role_id` bigint UNSIGNED NOT NULL,
  `status` enum('active','inactive','suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `two_factor_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `two_factor_secret` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_recovery_codes` json DEFAULT NULL,
  `last_login_at` timestamp NULL DEFAULT NULL,
  `timezone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTC',
  `preferences` json DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  KEY `users_email_status_index` (`email`,`status`),
  KEY `users_role_id_index` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `email_verified_at`, `password`, `phone`, `avatar`, `role_id`, `status`, `two_factor_enabled`, `two_factor_secret`, `two_factor_recovery_codes`, `last_login_at`, `timezone`, `preferences`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Super', 'Admin', 'superadmin@example.com', '2025-09-13 18:48:51', '$2y$12$mlmzytl.v/azI7CTfEO3VevHFXG6zCVJ77kdNW4GDznzG.5HpbJqG', '+1234567889', NULL, 1, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-13 18:48:51', '2025-09-13 18:48:51'),
(2, 'Manager', 'Manager', 'admin@example.com', '2025-09-13 18:48:52', '$2y$12$a6VgfFe4tjJE2FJN3DPZSe5/RlgKLaSkDkEEfZihz1P0nbDB2bqZu', '+1234567890', 'http://localhost:8000/storage/avatars/2_1764748715.png', 2, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-13 18:48:52', '2025-12-03 02:49:47'),
(3, 'EditedFromTest', 'Doe r', 'teamlead@example.com', '2025-09-13 18:48:52', '$2y$12$QyK0kZa4KCcKkwznJ535r.wrJa/ZNq21PwjcBTzSLFePnflRjWESC', '+9999999999', NULL, 3, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-13 18:48:52', '2025-09-15 05:40:58'),
(4, 'Jane', 'Smith', 'member@example.com', '2025-09-13 18:48:52', '$2y$12$IhPrtNsTk3OxlIbLskTG1e750yQqNpWgn3oPfMNrmSEqsVGhX5hb6', '+1234567892', NULL, 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-13 18:48:52', '2025-09-13 18:48:52'),
(5, 'Mike', 'Johnson', 'mike@example.com', '2025-09-13 18:48:52', '$2y$12$GqtvK/zczH3iVj3KdHjl/.ZFw2huOgNVM1UpJ0bnCILfyKe5oi8p2', '+1234567893', NULL, 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-13 18:48:52', '2025-09-13 18:48:52'),
(6, 'Sarah', 'Wilson', 'sarah@example.com', '2025-09-13 18:48:53', '$2y$12$.8FJk6ZsaaJwzB9h9zusYu.9PcuQ1dLClSuevCTpFjwTF2O5px0LW', '+1234567894', NULL, 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-13 18:48:53', '2025-09-13 18:48:53'),
(7, 'Vijayraj', 'Chaudhary', 'rajvraj121@gmail.com', '2025-09-13 18:48:53', '$2y$12$Wva7mbE0b6RLgfqN327GJeoT/Mih9ywABtrRIdTRUjGvJFeba12jK', '8791907205', NULL, 3, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-15 05:43:24', '2025-09-15 05:43:24'),
(8, 'Vijayraj', 'Chaudhary', 'rajvraj1221@gmail.com', '2025-09-13 18:48:53', '$2y$12$tCNnB25Ksf2jvAvlzBEKyuEVsQWrHLC07PTqw8iD5vJ1j5tL56.Ma', '67657567', NULL, 3, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-15 05:49:28', '2025-09-15 05:49:55'),
(9, 'vj', 'raj', 'rtreter@ytryrt.rrert', '2025-09-13 18:48:53', '$2y$12$0DgAFAQZUScXVorF1h61RuDy76qHREjsc0QY/kZ4CZKINtDYaL4Ri', '8686786765', NULL, 3, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-09-15 06:02:48', '2025-12-02 05:15:54'),
(10, 'test', 'tyyt', 'test@gmail.com', '2025-09-13 18:48:53', '$2y$12$wwAwqCctcykxzpWVMeXcru8zsHEcNAOPE.ARJiEuPpMyqWUXu9/wG', '6575756756757', NULL, 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-12-02 11:57:52', '2025-12-02 22:44:25'),
(11, 'Amit', 'Singh', 'amit@gmail.com', '2025-09-13 18:48:53', '$2y$12$wo7Wss730lainVrk/qhiVuech/WIHmFwY77xgIVlXx.e.XmRItonC', '759769769645645', NULL, 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-12-02 23:09:12', '2025-12-02 23:09:12'),
(12, 'Rahul', 'Chopra', 'rahulchopra@gmail.com', NULL, '$2y$12$O6HcE4ahm9wSLTnPAulUregHiPNhyMd6.23skAWtGxQzY9kF/7Qm.', '9834562453', 'http://localhost:8000/storage/avatars/12_1764749093.jpg', 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-12-02 23:11:55', '2025-12-03 02:34:53'),
(13, 'Admin', 'Admin', 'admin@gmail.com', NULL, '$2y$12$lGSJY5gfY2C4O7TswK6RPuHmCHELDn45T9wTQxPz3WiIwL9AbF5vK', '63563465376583', NULL, 5, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-12-03 02:49:28', '2025-12-03 02:49:28'),
(14, 'Vijayraj', 'Chaudhary', 'vijayraj@gmail.com', NULL, '$2y$12$e9wiNnbALh5.GWz8HJS.heMV.XBGoUBNcDGZHMYhiPoasKGt1Hy1m', '8765654343', 'http://localhost:8000/storage/avatars/14_1764818911.jpg', 4, 'active', 0, NULL, NULL, NULL, 'UTC', NULL, NULL, '2025-12-03 21:46:26', '2025-12-03 21:58:31');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `role_id` bigint UNSIGNED NOT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `assigned_by` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_user_id_role_id_unique` (`user_id`,`role_id`),
  KEY `user_roles_assigned_by_foreign` (`assigned_by`),
  KEY `user_roles_user_id_index` (`user_id`),
  KEY `user_roles_role_id_index` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
