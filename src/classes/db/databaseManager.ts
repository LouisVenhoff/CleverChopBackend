
var mysql = require('mysql');
import Product, { MinimalProduct } from "../static/Product";
import Tables from "../../enums/tables";
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

    
    public async addProduct(prod:MinimalProduct)
    {
        //TODO: Neues Produkt hinzufügen
        const categoryRows:any = await this.sqlConnection.query(`SELECT * FROM category WHERE name = ${prod.mainCat}`);
    
    }

    private async addToSecTable(value:string, table:Tables)
    {

        let catType:string
        let tableName:string;
        
        switch(table)
        {
            case Tables.CATEGORY:
                catType = "Category";
                tableName = "category"
                break;
            case Tables.SUBCATEGORY:
                catType = "Category";
                tableName = "subcategory"
                break;
            case Tables.ORIGIN:
                catType = "Origin";
                tableName = "origin"
                break;
            default:
                return;

        }

        const rows:any = await this.sqlConnection.query(`INSERT INTO ${tableName} (${catType}) VALUES (${value})`);
    
    }

    private async checkSecTable(value:string, table:Tables):Promise<number>
    {
        //const rows:any[] = await this.sqlConnection.query("SELECT id FROM ");

        return new Promise(async (resolve, reject) => {
            
        });
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

    private checkConnection()
    {
        if(this.sqlConnection.Conne)
    }


}


export default DatabaseManager;