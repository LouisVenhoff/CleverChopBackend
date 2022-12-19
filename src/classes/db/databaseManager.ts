
var mysql = require('mysql');
import Product, { MinimalProduct } from "../static/Product";
import Tables from "../../enums/tables";
import EanApiController from "../openEan/eanApiController";
class DatabaseManager
{

    host:string;
    username:string;
    password:string;
    sqlConnection:any;
    eanSource:EanApiController = new EanApiController("400000000");
    
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

    public provideProduct(ean:string):boolean
    {
        //TODO: Prüfen ob produkt vorhanden
        return true;
    }

    
    private async addProduct(prod:MinimalProduct)
    {
        //TODO: Neues Produkt hinzufügen
       let mainCatId:number = await this.provideSecTable(prod.mainCat, Tables.CATEGORY);
       let subCatId:number = await this.provideSecTable(prod.subCat, Tables.SUBCATEGORY);
       let originId:number = await this.provideSecTable(prod.origin, Tables.ORIGIN);

       await this.sqlConnection.query(`INSERT INTO product (Name, Detail, Code, Content, Pack, Description, OriginId, CatId, SubCatId)` +  
                                        `VALUES ('${prod.name}', '${prod.detail}', '${prod.code}', '${prod.contents}', '${prod.packageInfo}', '${prod.description}', '${originId}', '${mainCatId}', '${subCatId}')`);
    
    }

    private async checkProduct(ean:string):Promise<number>
    {
        
        return new Promise(async (resolve, reject) => {
            let rows:any[] = this.sqlConnection.query(`SELECT id FROM Product WHERE Code = '${ean}'`);

            if(rows.length === 0)
            {
               let Product:MinimalProduct = await this.eanSource.requestEan(ean);
               await this.addProduct(Product);
               this.checkProduct(ean).then((e:number) => {resolve(e)});
            }
            else
            {
                resolve(rows.length);
            }
        });
        
        
    }


    private async addToSecTable(value:string, table:Tables):Promise<boolean>
    {

        let catType:string
        let tableName:string;
        
        let dbConfig:any = this.getSecTableConfig(table);

        const rows:any[] = await this.sqlConnection.query(`INSERT INTO ${dbConfig.tableName} (${dbConfig.catType}) VALUES (${value})`);
    
       return new Promise((resolve, reject) => {
            if(rows.length > 0)
            {
                resolve(true);
            }
            else
            {
                resolve(false);
            }
       });

    }

    private async checkSecTable(value:string, table:Tables):Promise<number>
    {
        //const rows:any[] = await this.sqlConnection.query("SELECT id FROM ");

        let dbConfig:any = this.getSecTableConfig(table);

        let rows:any[] = await this.sqlConnection.query(`SELECT id FROM ${dbConfig.tableName} WHERE ${dbConfig.catType} = '${value}'`);

        return new Promise(async (resolve, reject) => {
            if(rows.length > 0)
            {
                resolve(parseInt(rows[0]));
            }
            else
            {
                resolve(0);
            }
        });
    }

    private async provideSecTable(value:string, table:Tables):Promise<number>
    {
        
        return new Promise(async (resolve, reject) => {
            let secId:number = await this.checkSecTable(value, table);

            let finalId:number;

            if(secId === 0)
            {
                await this.addToSecTable(value, table);
                resolve(await this.checkSecTable(value, table));
            }
            else
            {
                resolve(secId);
            }
        });


        
    }


    private getSecTableConfig(table:Tables):{catType:string, tableName:string} | null
    {
        let catType:string;
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
                return null;
        }
        
        
        return {catType:catType, tableName:tableName};
    }

   

}


export default DatabaseManager;