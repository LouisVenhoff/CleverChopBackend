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


  private async doQuery(queryStr:string):Promise<any[]>
  {
      return new Promise(async(resolve, reject) => {

          this.sqlConnection.query(queryStr, (err:any, result:any) => 
          {
              if(err)
              {
                reject(err);
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
  
    let sqlQuery:string = `SELECT product.id as id, product.name, code, weight, manufacturer.name as manufacturer, packing.name as packing, nutriScore.name as nutriScore, ecoScore.name as ecoScore 
    FROM Product
    JOIN manufacturer ON manufacturer.id = manufacturer 
    JOIN packing ON packing.id = packing
    JOIN nutriScore ON nutriScore.id = nutriScore
    JOIN ecoScore ON ecoScore.id = ecoScore`;

    return new Promise(async(resolve, reject) => 
    {
      let results:any[] = await this.doQuery(sqlQuery);
     
      if(results.length != 0)
      {
          
          let commonArgs:string[] = await this.getArguments("common", results[0].id);
          let badArgs:string[] = await this.getArguments("bad", results[0].id);
          let goodArgs:string[] = await this.getArguments("good", results[0].id);
          let allergens:string[] = await this.getAllergens(results[0].id);
          let categorys:string[] = await this.getCategorys(results[0].id);


          let outElement:MinimalProduct = 
          {
            error:0,
            code: results[0].code,
            name: results[0].name,
            weight: results[0].weight,
            manufacturer: results[0].manufacturer,
            packing: results[0].packing,
            category: categorys,
            allergen: allergens,
            badArgs: badArgs,
            goodArgs: goodArgs,
            commonInfo: commonArgs,
            nutriScore: results[0].nutriScore,
            ecoScore: results[0].ecoScore,
          }

          console.log(outElement);
      }
      else
      {
        let newProduct:MinimalProduct = await this.eanSource.requestEan(ean);
        await this.addProduct(newProduct);
        resolve(newProduct);
      }
    });

    
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
              let currentProduct:MinimalProduct = await this.eanSource.requestEan(ean);
              this.addProduct(currentProduct);
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
      //Arguments
      this.provideMultipleArguments("average", prod.commonInfo);
      this.provideMultipleArguments("bad", prod.badArgs);
      this.provideMultipleArguments("good", prod.goodArgs);
      let allArgs:string[] = prod.commonInfo.concat(prod.badArgs, prod.goodArgs);
      //Packing
      let packingId:number = await this.provideSubtable(Tables.PACKING, prod.packing);
      //Manufacturer
      let manufacturerId:number = await this.provideSubtable(Tables.MANUFACTURER, prod.manufacturer);
      //NutriScore
      let nutriScoreId:number = await this.provideSubtable(Tables.NUTRISCORE, prod.nutriScore);
      //EcoScore
      let ecoScoreId:number = await this.provideSubtable(Tables.ECOSCORE, prod.ecoScore);

      await this.doQuery(`INSERT INTO Product (name, ean,  weight, manufacturer, packing, nutriScore, ecoScore) VALUES ("${prod.name}", "${prod.code}" ,"${prod.weight}, "${manufacturerId}", "${packingId}", "${nutriScoreId}", "${ecoScoreId}")`);

      let productId:number = await this.findProduct(prod.code);
      
      this.createConnectionArr(HelpTables.ProductCategory,Tables.CATEGORY, productId, prod.category);
      this.createConnectionArr(HelpTables.ProductAllergen, Tables.ALLERGEN, productId, prod.allergen);
      this.createConnectionArr(HelpTables.ProductArgument, Tables.ARGUMENTS, productId, allArgs);
  }

  private async addToSubtable(tab:Tables, word:string)
  {
        let tableName:string = this.resolveTablesName(tab);
        let sqlQuery:string = `INSERT INTO ${tableName} (name) VALUES ("${word}");`
        await this.sqlConnection.query(sqlQuery);
  }

  private async checkSubTable(tab:Tables, word:string):Promise<number>
  {
      let tableName:string = this.resolveTablesName(tab);
      let sqlQuery:string = `SELECT id FROM ${tableName} WHERE name = "${word}";`;
     
      return new Promise(async(resolve, reject) => {

          let result:any[] = await this.doQuery(sqlQuery);
          if(result.length !== 0)
          {
              resolve(parseInt(result[0].id));
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


  private async provideMultipleArguments(effect:string, text:string[])
  {
      for(let i = 0; i < text.length; i++)
      {
          this.provideArgumentSubtable(effect, text[i]);
      }
  }

  private async provideArgumentSubtable(effect:string, text:string):Promise<number>
  {
      let checkResult:number = await this.checkArgumentSubtable(text);
      


      return new Promise(async(resolve, reject) => {


        if(checkResult != -1)
        {
          resolve(checkResult);
        }
        else
        {
          resolve(await this.addArgument(effect, text));
        }


      });

  }

  private async checkArgumentSubtable(text:string):Promise<number>
  {
      let sqlQuery:string = `SELECT id FROM Argument WHERE text = ${text}`;

      return new Promise(async(resolve, reject) => {

          let results:any[] = await this.doQuery(sqlQuery);

          if(results.length == 0)
          {
            resolve(-1);
          }
          else
          {
            resolve(parseInt(results[0]));
          }
      });
  }

  private async addArgument(effect:string, argument:string):Promise<number>
  {
      let effectId:number = await this.provideSubtable(Tables.EFFECT, effect);

      let sqlQuery:string = `INSERT INTO Argument (text, effectId) VALUES ("${argument}","${effect}")`;

      return new Promise(async (resolve, reject) => 
      {
          await this.doQuery(sqlQuery);
          resolve(await this.checkArgumentSubtable(argument));
      });


      
  }


  private async addContableEntry(helpTable:HelpTables, productId:number, elementId:number):Promise<number>
  {
      let tableName:string = this.resolveHelptableName(helpTable);

      let sqlQuery:string = `INSERT INTO ${tableName} (productId, elementId) VALUES ("${productId}", "${elementId}");`;

      let checkQuery:string = `SELECT id FROM ${tableName} WHERE productId = ${productId} AND elementId = ${elementId};`;

      return new Promise(async(resolve, reject) => {

          await this.doQuery(sqlQuery); //Insert Query
          let checkResult:any[] = await this.doQuery(checkQuery);

          resolve(parseInt(checkResult[0]));
      });
  }

  private async createConnectionArr(helpTable:HelpTables, subTable:Tables, productId:number, elements:string[])
  {
      for(let i = 0; i < elements.length; i++)
      {
        await this.addContableEntry(helpTable, productId, await this.provideSubtable(subTable, elements[i]));
      }
  }

  private async getConnectionId(helpTable:HelpTables, productId:string, elementId:string):Promise<number>
  {
      let tableName = this.resolveHelptableName(helpTable);

      let sqlQuery:string = `SELECT id FROM ${tableName} WHERE productId = ${productId} AND elementId = ${elementId};`;

      return new Promise(async(resolve, reject) => {

        let result:any[] = await this.doQuery(sqlQuery);
        
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

  private async getAllConnectionIds(helpTabs:HelpTables, productId:number):Promise<number[]>
  {
      
      let sqlQuery:string = `SELECT id FROM ${this.resolveHelptableName(helpTabs)} WHERE productId = ${productId}`;
    
      return new Promise(async(resolve, reject) => {

        let results:any[] = await this.doQuery(sqlQuery);

        let resultNumbers:number[] = [];
        
        for(let i = 0; i < results.length; i++)
        {
            resultNumbers.push(parseInt(results[i]));
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
          return "EcoScore";
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
        case Tables.EFFECT:
          return "Effect";
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


  private async getArguments(effect:string, productId:string):Promise<string[]>
  {
    let sqlQuery:string = `SELECT argument.text 
    FROM argument
    JOIN ProductArgument ON argument.id = ProductArgument.elementid
    JOIN Product ON productId = Product.id
    JOIN Effect ON Argument.effectId = Effect.id
    WHERE Effect.name = "${effect}"
    AND Product.id = ${productId};`;

    return new Promise(async(resolve, reject) => {

        let outArr:string[] = [];
        
        let results:any[] = await this.doQuery(sqlQuery);
  
        if(results.length == 0)
        {
          resolve(outArr);
        }

        for(let i = 0; i < results.length; i++)
        {
          outArr.push(results[i].text);
        }

        resolve(outArr);

    });


  }

  private async getAllergens(productId:string):Promise<string[]>
  {
      let sqlQuery:string = `SELECT allergen.name
      FROM allergen
      JOIN ProductAllergen ON allergen.id = ProductAllergen.elementId
      JOIN Product ON Product.id = ProductAllergen.productId
      WHERE Product.id = ${productId};`

      return new Promise(async(resolve, reject) => 
      {
        let allergens:string[] = [];
        let results:any[] = await this.doQuery(sqlQuery);

        for(let i = 0; i < results.length; i++)
        {
          allergens.push(results[i]);
        }

        resolve(allergens);

      });
  }

  private async getCategorys(productId:string):Promise<string[]>
  {
    let sqlQuery:string = `SELECT Category.name 
    FROM Category
    JOIN ProductCategory ON Category.id = ProductCategory.elementId
    JOIN Product ON Product.id = productCategory.productId
    WHERE Product.id = ${productId};`

    return new Promise(async(resolve, reject) => 
    {
      let categorys:string[] = [];
      let results:any[] = await this.doQuery(sqlQuery);

      for(let i = 0; i < results.length; i++)
      {
          categorys.push(results[i].name);
      }

      resolve(categorys);

    });
  }



}

export default DatabaseManager;
