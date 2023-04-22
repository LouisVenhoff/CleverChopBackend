import EanApiController from "./src/classes/eanSource/eanApiController";
import WebScraper from "./src/classes/eanSource/webScraper";
import { MinimalProduct } from "./src/classes/static/Product";
import DatabaseManager from "./src/classes/db/databaseManager";
import InfoSource from "./src/classes/eanSource/infoSource";



var cors = require("cors");

const express = require("express");

const app = express();
const port = 3014;

//const dbMng:DatabaseManager = new DatabaseManager("localhost", "system", "Iwaaz2001g!", "cleverchopdb");
//const dbMng:DatabaseManager = new DatabaseManager("eu-cdbr-west-03.cleardb.net", "b08e03be91e09c", "17c36724", "heroku_554b26e8f85d455");
//const dbMng:DatabaseManager = new DatabaseManager("eu-cdbr-west-03.cleardb.net", "b712eb9ae277d5", "865f45a8", "heroku_9e52a98d5b35c1a");
const dbMng:DatabaseManager = new DatabaseManager("localhost", "root", "", "cleverchopdb");


app.use(cors());


app.get("/", (req:any, res:any) => {
    console.log("Working");
})

app.get("/api/sendCode/:code", async (req:any, res:any) => {
    
    let result:MinimalProduct = await dbMng.provideProduct(req.params.code);
    console.log("Result: ");
    console.log(result);
    

    res.send(JSON.stringify(result));
})


app.listen(port, () => {
    console.log("Listening on Port " + port);
    
})

//Schatzi war hier und louis gehört nur mir !!

// You are my boyfriend forever i love you so much.<3<3