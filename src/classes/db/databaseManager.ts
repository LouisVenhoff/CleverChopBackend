
var mysql = require('mysql');
import Product from "../static/Product";

class DatabaseManager
{

    host:string;
    username:string;
    password:string;
    sqlConnection:any;
   
    
    constructor(host:string, username:string, password:string)
    {
        this.host = host;
        this.username = username;
        this.password = password;
        this.connect();
    }


    public connect()
    {
        this.sqlConnection = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
        });

        this.sqlConnection.connect((err:any) => {
            if(!err)
            {
                console.log("Connection successfully!");
            }
            else
            {
                console.log("Connection error!");
            }
        });


    }

    public disconnect()
    {
        this.sqlConnection.end();
    }

    public checkProduct(ean:string):boolean
    {
        //TODO: Prüfen ob produkt vorhanden
        return true;
    }

    public addProduct(prod:Product)
    {
        //TODO: Neues Produkt hinzufügen
    }

    private checkOrigin(origin:string)
    {
        //TODO: Prüfen ob Herstellerland vorhanden
    }

    private addOrigin(origin:string)
    {
        //TODO: Herstellerland hinzufügen
    }

    private checkCategory(category:string)
    {
        //TODO: Prüfen ob Kategorie vorhandne
    }

    private addCategory(category:string)
    {
        //TODO: hinzufügen einer Kategorie
    }


}


export default DatabaseManager;