-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 06, 2020 at 09:14 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react-from-scratch`
--

-- --------------------------------------------------------

--
-- Table structure for table `AdminDetails`
--

CREATE TABLE `AdminDetails` (
  `id` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mobileNumber` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `AdminDetails`
--

INSERT INTO `AdminDetails` (`id`, `name`, `mobileNumber`, `email`) VALUES
(1, 'Sethu Kumar', '8886257181', 'sethukumar@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `projectDetails`
--

CREATE TABLE `projectDetails` (
  `projectId` int(200) NOT NULL,
  `projectName` varchar(100) NOT NULL,
  `projectDesc` varchar(100) NOT NULL,
  `mainTask` varchar(100) NOT NULL,
  `subTask` varchar(100) NOT NULL,
  `status` varchar(200) NOT NULL DEFAULT 'Pending',
  `projectLead` varchar(100) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `projectDetails`
--

INSERT INTO `projectDetails` (`projectId`, `projectName`, `projectDesc`, `mainTask`, `subTask`, `status`, `projectLead`, `createdAt`, `updatedAt`) VALUES
(1, 'Bank-Application', 'Banking App', '0', '0', 'Pending', '1', '2020-07-06 18:54:40', '0000-00-00 00:00:00'),
(2, 'Shopping cart Application', 'Shopping Application', '0', '0', 'Pending', '2', '2020-07-06 18:54:59', '0000-00-00 00:00:00'),
(3, 'Movie-Booking', 'Booking Application', '0', '0', 'Pending', '3', '2020-07-06 18:56:57', '0000-00-00 00:00:00'),
(4, 'Expense Management', 'Tracking expense', '0', '0', 'Pending', '4', '2020-07-06 18:57:01', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `projectTaskData`
--

CREATE TABLE `projectTaskData` (
  `id` int(100) NOT NULL,
  `projectId` int(100) NOT NULL,
  `mainTaskId` int(100) NOT NULL,
  `subTaskId` int(100) NOT NULL,
  `userId` int(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `userRegistration`
--

CREATE TABLE `userRegistration` (
  `userId` int(100) NOT NULL,
  `userName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `userRegistration`
--

INSERT INTO `userRegistration` (`userId`, `userName`, `email`, `mobileNumber`, `password`, `role`) VALUES
(1, 'sethu', '1@gmail.com', '876578967', '$2a$10$BK6vizuPL35ETKUMh7YWpeNoT17Hnf0G/txO0/tTkXmwNR3cZuKPm', ''),
(2, 'sethu', '2@gmail.com', '654456789', '$2a$10$ZDWYhfwyv.6L6y7gybzVyOWZ9nuenxBHUkShVz8x05twLa8omBQk.', ''),
(3, 'jasmi', 'j@gmail.com', '9876456789', '$2a$10$TFzRyElXFxnuvhC1HbJoJuNrNOKp4ML292MSUWL/1fA5Vwe4gSBTi', ''),
(4, 'sethu', 'sk@gmail.com', '5643214545', '$2a$10$/tZzUNpxf.lLJzKl9InboeJwsYl2minEC3/GC/yzQA1DepNrUK2g2', '');

-- --------------------------------------------------------

--
-- Table structure for table `usersDetails`
--

CREATE TABLE `usersDetails` (
  `id` int(200) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `technology` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usersDetails`
--

INSERT INTO `usersDetails` (`id`, `userName`, `email`, `technology`) VALUES
(1, 'sethu', 'sethu@gmail.com', 'Reactjs'),
(2, 'supriya', 'supriya@gmail.com', 'full stack'),
(3, 'Nani', 'nani@gmail.com', 'Nodejs'),
(4, 'Jasmi', 'jasmi@gmail.com', 'Mongodb');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AdminDetails`
--
ALTER TABLE `AdminDetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projectDetails`
--
ALTER TABLE `projectDetails`
  ADD PRIMARY KEY (`projectId`);

--
-- Indexes for table `projectTaskData`
--
ALTER TABLE `projectTaskData`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userRegistration`
--
ALTER TABLE `userRegistration`
  ADD PRIMARY KEY (`userId`);

--
-- Indexes for table `usersDetails`
--
ALTER TABLE `usersDetails`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AdminDetails`
--
ALTER TABLE `AdminDetails`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `projectDetails`
--
ALTER TABLE `projectDetails`
  MODIFY `projectId` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projectTaskData`
--
ALTER TABLE `projectTaskData`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `userRegistration`
--
ALTER TABLE `userRegistration`
  MODIFY `userId` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `usersDetails`
--
ALTER TABLE `usersDetails`
  MODIFY `id` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
