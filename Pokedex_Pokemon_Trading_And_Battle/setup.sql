-- Author: Zoheb Siddiqui
-- Date created: 06/02/2019

-- This is the setup.sql file

--Here we create the database and use it.
CREATE DATABASE hw5db;
USE hw5db;
-- Here we create the Pokedex table with 3 columns.
--1 for name, 1 for nickname and 1 for date-time.
CREATE TABLE Pokedex(
  name varchar(30),
  nickname varchar(30),
  datefound DATETIME,
  PRIMARY KEY(name)
);
