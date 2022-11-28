import EanApiController from "./src/classes/openEan/eanApiController";
import { MinimalProduct } from "./src/classes/static/Product";

const express = require("express");

const app = express();
const port = 3014;

const eanSource:EanApiController = new EanApiController("400000000");


app.get("/", (req:any, res:any) => {
    console.log("Working");
})

app.get("/api/sendCode/:code", async (req:any, res:any) => {
    console.log("Got code Route" + req.params.code);

    let result:MinimalProduct = await eanSource.requestEan(req.params.code);

    let test:string = JSON.stringify(result);

    console.log(test);
})

app.listen(port, () => {
    console.log("Listening on Port " + port);
})