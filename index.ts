import EanApiController from "./src/classes/openEan/eanApiController";
import { MinimalProduct } from "./src/classes/static/Product";
import DatabaseManager from "./src/classes/db/databaseManager";
var cors = require("cors");

const express = require("express");

const app = express();
const port = 3014;

const dbMng:DatabaseManager = new DatabaseManager("eu-cdbr-west-03.cleardb.net", "b08e03be91e09c", "17c36724");

app.use(cors());


const eanSource:EanApiController = new EanApiController("400000000");


app.get("/", (req:any, res:any) => {
    console.log("Working");
})

app.get("/api/sendCode/:code", async (req:any, res:any) => {
    

    let result:MinimalProduct = await dbMng.provideProduct(req.params.code);

    res.send(JSON.stringify(result));
})

app.listen(port, () => {
    console.log("Listening on Port " + port);
    
})