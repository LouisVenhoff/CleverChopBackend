var mysql = require("mysql");
import Product, { MinimalProduct } from "../static/Product";
import Tables from "../../enums/tables";
import EanApiController from "../eanSource/eanApiController";
import InfoSource from "../eanSource/infoSource";
import NetworkProvider from "../network/networkProvider";
import WebScraper from "../eanSource/webScraper";


class DatabaseManager {
  host: string;
  username: string;
  password: string;
  database:string;
  sqlConnection: any;
  //eanSource: InfoSource = new EanApiController("400000000");
  eanSource:InfoSource = new WebScraper();
  dbConAttempts:number = 0;

  private connectionState = false;

  constructor(host: string, username: string, password: string, database:string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.database = database;
    this.connect();
  }

  public async connect() {
    
    this.dbConAttempts++;
    
    this.sqlConnection = await mysql.createConnection({
      host: this.host,
      user: this.username,
      password: this.password,
      database: this.database,
    });

    this.sqlConnection.connect((err: any) => {
      if (!err) {
        console.log("Database Connection successfully!");
        this.connectionState = true;
      } else {
        if(this.dbConAttempts < 100)
        {
           setTimeout(() => {this.connect();}, 1000)
        }
        else
        {
          console.log("Connection error!");
        }
      }
    });
  }

  public disconnect() {
    this.sqlConnection.end();
  }

  public getConnectionState():boolean
  {
    return this.connectionState;
  }

  public async provideProduct(ean: string): Promise<MinimalProduct> 
  {
    
    return new Promise(async (resolve, reject) => {resolve(null)}
  }

  
  private async findProduct(ean: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      this.sqlConnection.query(
        `SELECT id FROM product WHERE Code = ?`,[ean],
        async (error: any, results: any, fields: any) => {
          
          if(error)
          {
            console.log("Error: " + error.message);
            return;
          }
          let checkedRes:any[] = [];
          
          if(results !== undefined)
          {
             checkedRes = results;
          }
          
          if (checkedRes.length === 0) {
            let Product: MinimalProduct = await this.eanSource.requestEan(ean);
            if(Product.error !== 0)
            {
                reject(Product.error);
                return;
            }
            await this.addProduct(Product);
            this.findProduct(ean).then((e: number) => {
              resolve(e);
            });
          } else {
            resolve(checkedRes[0].id);
          }
        }
      );
    });
  }

  private async addProduct(prod: MinimalProduct) {
   
  }

 

  private proveIsNotNaN(nr:number | null):number | null
  {
      if(nr === null)
      {
        return null;
      }
      else if(isNaN(nr))
      {
        return null;
      }
      else
      {
        return nr;
      }
  }

  

  private generateErrorObj(errorCode:number):MinimalProduct
  {
      return({error: errorCode,
             });
  }



}

export default DatabaseManager;
