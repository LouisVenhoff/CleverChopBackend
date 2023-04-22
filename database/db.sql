CREATE DATABASE CleverChopDb;

USE CleverChopDb;

CREATE TABLE Effect
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE Argument
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     text VARCHAR(255),
     effectId INT ,
     FOREIGN KEY (effectId) REFERENCES Effect(id)
);

CREATE TABLE Packing
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name VARCHAR (255)
);

CREATE TABLE Category
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name VARCHAR(255)
);

CREATE TABLE Manufacturer
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name VARCHAR(255)
);

CREATE TABLE NutriScore
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name CHAR(1)
);

CREATE TABLE EcoScore
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name CHAR(1)
);

CREATE TABLE Allergen
(
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name VARCHAR(255)
);

CREATE TABLE Product
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    code VARCHAR(14),
    weight VARCHAR(10),
    manufacturer INT,
    packing INT,
    nutriScore INT,
    ecoScore INT,
    FOREIGN KEY (manufacturer) REFERENCES Manufacturer(id),
    FOREIGN KEY (packing) REFERENCES Packing(id),
    FOREIGN KEY (nutriScore) REFERENCES NutriScore(id),
    FOREIGN KEY (ecoScore) REFERENCES EcoScore(id)
);


CREATE TABLE ProductAllergen
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    productId INT,
    elementId INT,
    FOREIGN KEY (productId) REFERENCES Product(id),
    FOREIGN KEY (elementId) REFERENCES Allergen(id)
);


CREATE TABLE ProductCategory
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     productId INT, 
     elementId INT,
     FOREIGN KEY (productId) REFERENCES Product(id),
     FOREIGN KEY (elementId) REFERENCES Category(id)
);

CREATE TABLE ProductArgument
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     productId INT,
     elementId INT,
     FOREIGN KEY (productId) REFERENCES Product(id),
     FOREIGN KEY (elementId) REFERENCES Argument(id)
);