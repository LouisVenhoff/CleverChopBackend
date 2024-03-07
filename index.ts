import { MinimalProduct } from "./src/classes/static/Product";
import DatabaseManager from "./src/classes/db/databaseManager";
import DatabaseConfigSystem from "./src/classes/databaseConfigSystem/databaseConfigSystem";
import { DatabaseConfig } from "./src/classes/databaseConfigSystem/databaseConfigSystem";
var pjson = require("./package.json");

var cors = require("cors");

const express = require("express");

const app = express();
const port = 3014;

//const dbMng:DatabaseManager = new DatabaseManager("eu-cdbr-west-03.cleardb.net", "b08e03be91e09c", "17c36724", "heroku_554b26e8f85d455");
//const dbMng:DatabaseManager = new DatabaseManager("eu-cdbr-west-03.cleardb.net", "b712eb9ae277d5", "865f45a8", "heroku_9e52a98d5b35c1a");
//const dbMng:DatabaseManager = new DatabaseManager("localhost", "root", "", "cleverchopdb");

const startSystem = (dbConfig: DatabaseConfig) => {
  console.log(dbConfig);
  const dbMng: DatabaseManager = new DatabaseManager(dbConfig);

  app.use(cors());

  app.get("/", (req: any, res: any) => {
    res.send({ version: pjson.version, status: "ok" });
  });

  app.get("/api/sendCode/:code", async (req: any, res: any) => {
    let result: MinimalProduct = await dbMng.provideProduct(req.params.code);

    res.send(JSON.stringify(result));
  });

  app.listen(port, () => {
    console.log("CleverChop Server Version: " + pjson.version);
    console.log("Listening on Port " + port);
  });
};

const dbConfig: DatabaseConfigSystem = new DatabaseConfigSystem("db.json", startSystem);

//Schatzi war hier und louis gehört nur mir !!

// You are my boyfriend forever i love you so much.<3<3
