import EanApiController from "./src/classes/openEan/eanApiController";
import { MinimalProduct } from "./src/classes/static/Product";
var cors = require("cors");

const express = require("express");

const app = express();
const port = 3014;

app.use(cors());


const eanSource:EanApiController = new EanApiController("400000000");


app.get("/", (req:any, res:any) => {
    console.log("Working");
})

app.get("/api/sendCode/:code", async (req:any, res:any) => {
    

    let result:MinimalProduct = await eanSource.requestEan(req.params.code);

    res.send(JSON.stringify(result));
})

app.listen(port, () => {
    console.log("Listening on Port " + port);
})