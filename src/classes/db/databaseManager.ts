var mysql = require("mysql");
import Product, { MinimalProduct } from "../static/Product";
import Tables, {HelpTables} from "../../enums/tables";
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


  private async doQuery(queryStr:string):Promise<any>
  {
      return new Promise(async(resolve, reject) => {

          this.sqlConnection.query(queryStr, (err:any, result:any) => 
          {
              if(err)
              {
                reject(null);
              }
              else
              {
                  resolve(result);
              }
          });


      });
  }

  public async provideProduct(ean: string): Promise<MinimalProduct> 
  {
    
    throw("Not implemented yet");
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
      //TODO: Provide all secundary tables
              //-Category
              //-Allergen
              //-Packing

      //Category
      this.provideMultipleSubtable(Tables.CATEGORY, prod.category);
      //Allergen
      this.provideMultipleSubtable(Tables.ALLERGEN, prod.allergen);
      //Packing
      let packingId:number = await this.provideSubtable(Tables.PACKING, prod.packing);
      //Manufacturer
      let manufacturerId:number = await this.provideSubtable(Tables.MANUFACTURER, prod.manufacturer);
      //NutriScore
      let nutriScoreId:number = await this.provideSubtable(Tables.NUTRISCORE, prod.nutriScore);
      //EcoScore
      let ecoScoreId:number = await this.provideSubtable(Tables.ECOSCORE, prod.ecoScore);

      



      
  }

  private async addToSubtable(tab:Tables, word:string)
  {
        let tableName:string = this.resolveTablesName(tab);
        let sqlQuery:string = `INSERT INTO ${tableName} VALUES (${word});`
        await this.sqlConnection.query(sqlQuery);
  }

  private async checkSubTable(tab:Tables, word:string):Promise<number>
  {
      let tableName:string = this.resolveTablesName(tab);
      let sqlQuery:string = `SELECT id FROM ${tableName} WHERE name = ${word}`;

      return new Promise(async(resolve, reject) => {

          let result:string[] = await this.sqlConnection.query(sqlQuery);

          if(result.length === 0)
          {
              resolve(parseInt(result[0]));
          }
          else
          {
              resolve(-1);
          }
      });

  }

  private async  provideMultipleSubtable(tab:Tables, word:string[])
  {
        for(let i = 0; i < word.length; i++)
        {
            await this.provideSubtable(tab, word[i]);
        }
  }

  private async provideSubtable(tab:Tables, word:string):Promise<number>
  {
        let id:number = await this.checkSubTable(tab, word);

        if(id === -1)
        {
           await this.addToSubtable(tab, word);
           return this.provideSubtable(tab, word);
        }
        else
        {
            return id;
        }
  } 


  private async addContableEntry(HelpTable:HelpTables, productId:string, elementId:string):Promise<number>
  {
      let tableName:string = this.resolveHelptableName(HelpTable);

      let sqlQuery:string = `INSER INTO ${tableName} (productId, elementId) VALUES (${productId}, ${elementId});`;

      return new Promise(async(resolve, reject) => {

          await this.doQuery(sqlQuery);



      });



  }

  private async getConnectionId(helpTable:HelpTables, productId:string, elementId:string):Promise<number>
  {
      let tableName = this.resolveHelptableName(helpTable);

      let sqlQuery:string = `SELECT id FROM ${tableName} WHERE productId = ${productId} AND elementId = ${elementId};`;

      return new Promise(async(resolve, reject) => {

        let result:string[] = await this.doQuery(sqlQuery);
        
        if(result.length === 0)
        {
            resolve(-1);
        }
        else
        {
          resolve(parseInt(result[0]));
        }

      });
  }




  private resolveTablesName(tab:Tables):string
  {
      switch(tab)
      {
        case Tables.PRODUCT:
            return "Product";
          break;
        case Tables.ALLERGEN:
          return "Allergen";
          break;
        case Tables.CATEGORY:
          return "Category";
          break;
        case Tables.ECOSCORE:
          return "Score";
          break;
        case Tables.NUTRISCORE:
          return "NutriScore";
          break;
        case Tables.PACKING:
          return "Packing";
          break;
        case Tables.MANUFACTURER:
          return "Manufacturer";
          break;
        default:
            throw("The input is not a Table!");
          break;
      }
  }


  private resolveHelptableName(tab:HelpTables):string
  {
      switch(tab)
      {
        case HelpTables.ProductAllergen:
          return "ProductAllergen"
          break;
        case HelpTables.ProductArgument:
          return "ProductArgument";
          break;
        case HelpTables.ProductCategory:
          return "ProductCategory";
          break;
        default:
          throw("The input is not a HelpTable");

      }
        
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
      return({
        error: errorCode,
        code: "",
        name: "",
        weight: "",
        manufacturer: "",
        packing: "",
        category: [],
        allergen: [],
        badArgs: [],
        goodArgs: [],
        commonInfo: [],
        nutriScore: "",
        ecoScore: "",
      });
  }



}

export default DatabaseManager;
