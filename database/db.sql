CREATE DATABASE CleverChopDb;

USE CleverChopDb;

CREATE TABLE effect
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE argument
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     text VARCHAR(255),
     effectId INT ,
     FOREIGN KEY (effectId) REFERENCES effect(id)
);

CREATE TABLE packing
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name VARCHAR (255)
);

CREATE TABLE category
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name VARCHAR(255)
);

CREATE TABLE manufacturer
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name VARCHAR(255)
);

CREATE TABLE nutriScore
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name CHAR(1)
);

CREATE TABLE ecoScore
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     name CHAR(1)
);

CREATE TABLE allergen
(
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name VARCHAR(255)
);

CREATE TABLE product
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    code VARCHAR(14),
    weight VARCHAR(100),
    manufacturer INT,
    packing INT,
    nutriScore INT,
    ecoScore INT,
    FOREIGN KEY (manufacturer) REFERENCES manufacturer(id),
    FOREIGN KEY (packing) REFERENCES packing(id),
    FOREIGN KEY (nutriScore) REFERENCES nutriScore(id),
    FOREIGN KEY (ecoScore) REFERENCES ecoScore(id)
);


CREATE TABLE productAllergen
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    productId INT,
    elementId INT,
    FOREIGN KEY (productId) REFERENCES product(id),
    FOREIGN KEY (elementId) REFERENCES allergen(id)
);


CREATE TABLE productCategory
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     productId INT, 
     elementId INT,
     FOREIGN KEY (productId) REFERENCES product(id),
     FOREIGN KEY (elementId) REFERENCES category(id)
);

CREATE TABLE productArgument
(
     id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
     productId INT,
     elementId INT,
     FOREIGN KEY (productId) REFERENCES product(id),
     FOREIGN KEY (elementId) REFERENCES argument(id)
);