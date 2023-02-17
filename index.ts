import EanApiController from "./src/classes/openEan/eanApiController";
import { MinimalProduct } from "./src/classes/static/Product";
import DatabaseManager from "./src/classes/db/databaseManager";
import UnknownCodeSystem from "./src/classes/unknownCodeSystem/unknownCodeSystem";
var cors = require("cors");

const express = require("express");

const app = express();
const port = 3014;

const dbMng:DatabaseManager = new DatabaseManager("localhost", "system", "Iwaaz2001g!", "cleverchopdb");
//const dbMng:DatabaseManager = new DatabaseManager("eu-cdbr-west-03.cleardb.net", "b08e03be91e09c", "17c36724", "heroku_554b26e8f85d455");
const unknownSys:UnknownCodeSystem = new UnknownCodeSystem(dbMng, true);

app.use(cors());


const eanSource:EanApiController = new EanApiController("400000000");


app.get("/", (req:any, res:any) => {
    console.log("Working");
})

app.get("/api/sendCode/:code", async (req:any, res:any) => {
    
    let result:MinimalProduct = await dbMng.provideProduct(req.params.code);
    console.log("Result: ");
    console.log(result);
    if(result.error === 1)
    {
        dbMng.writeUnknownEan(req.params.code);
    }

    res.send(JSON.stringify(result));
})

app.get("/api/admin/addtodb", async (req:any, res:any) => 
{
    //TODO: Picke den letzten wert aus der Unknown tabelle und schicke ihn zurück
    let newCode:string = await unknownSys.getCodeFromUnknownTable();

    let parsedObj:{code:string} = {code:newCode};

    res.send(JSON.stringify(parsedObj));
});

app.get("/api/admin/validateUnknown/:code", async (req:any, res:any) => 
{
    //TODO: Prüfe ob code vorhanden wenn ja: schicke true und lösche code aus der Unknown tabelle
    let validationState:boolean = await unknownSys.validateCode(req.params.code);
    
    let validatedObj:{validated:boolean} = {validated:validationState};

    res.send(JSON.stringify(validatedObj));
});

app.listen(port, () => {
    console.log("Listening on Port " + port);
    
})