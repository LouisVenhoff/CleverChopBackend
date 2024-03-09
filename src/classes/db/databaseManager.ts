var mysql = require("mysql");
import Product, { MinimalProduct } from "../static/Product";
import Tables, {HelpTables} from "../../enums/tables";
import EanApiController from "../eanSource/eanApiController";
import InfoSource from "../eanSource/infoSource";
import NetworkProvider from "../network/networkProvider";
import WebScraper from "../eanSource/webScraper";
import StrHelper from "../helpers/strhelper";
import { DatabaseConfig } from "../databaseConfigSystem/databaseConfigSystem";

class DatabaseManager {
  host: string;
  username: string;
  password: string;
  database:string;
  sqlConnection: any;
  altEanSource: InfoSource = new EanApiController("400000000");
  eanSource:InfoSource = new WebScraper();
  dbConAttempts:number = 0;

  private connectionState = false;

  constructor(config:DatabaseConfig) {
    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.database = config.database;
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
        if(this.dbConAttempts < 10)
        {
           setTimeout(() => {this.connect();}, 1000)
        }
        else
        {
          console.log("Connection error!",err);
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
    FROM product
    JOIN manufacturer ON manufacturer.id = manufacturer 
    JOIN packing ON packing.id = packing
    JOIN nutriScore ON nutriScore.id = nutriScore
    JOIN ecoScore ON ecoScore.id = ecoScore
    WHERE code = ${ean}`;

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
          resolve(outElement);
      }
      else
      {
        let newProduct:MinimalProduct = await this.eanSource.requestEan(ean);
       
        if(newProduct.error > 0)
        {
            newProduct = await this.altEanSource.requestEan(ean);
            
        }
       
        
        await this.addProduct(newProduct);
        resolve(newProduct);
      }
    });

    
  }

  public async fetchBackup():Promise<string[]>{
    
    const queryString:string = "SELECT code from product";
    
    return new Promise(async(resolve, reject) => {
        let result:any = await this.doQuery(queryString);
        
        let outArr:string[] = [];

        for(let i = 0; i < result.length; i++){
          outArr.push(result[i].code);
        }

        resolve(outArr);
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

      await this.provideMultipleSubtable(Tables.CATEGORY, prod.category);
      //Allergen
      await this.provideMultipleSubtable(Tables.ALLERGEN, prod.allergen);
      //Arguments
      await this.provideMultipleArguments("average", prod.commonInfo);
      await this.provideMultipleArguments("bad", prod.badArgs);
      await this.provideMultipleArguments("good", prod.goodArgs);
      
      this.checkArgumentArr(prod.commonInfo);
      this.checkArgumentArr(prod.badArgs);
      this.checkArgumentArr(prod.goodArgs);

        let emptyArr:string[] = [];

        let allArgs:string[] = emptyArr.concat(prod.badArgs, prod.goodArgs, prod.commonInfo);
        // console.log(allArgs);
      
      
      //Packing
      let packingId:number|null = await this.provideSubtable(Tables.PACKING, prod.packing);
      //Manufacturer
      let manufacturerId:number|null = await this.provideSubtable(Tables.MANUFACTURER, prod.manufacturer);
      //NutriScore
      let nutriScoreId:number|null = await this.provideSubtable(Tables.NUTRISCORE, prod.nutriScore);
      //EcoScore
      let ecoScoreId:number|null = await this.provideSubtable(Tables.ECOSCORE, prod.ecoScore);
     
      await this.doQuery(`INSERT INTO product (name, code,  weight, manufacturer, packing, nutriScore, ecoScore) VALUES ("${prod.name}", "${prod.code}" ,"${prod.weight}", ${manufacturerId}, ${packingId}, ${nutriScoreId}, ${ecoScoreId});`);
      
      let productId:number = await this.findProduct(prod.code);
      
      if(prod.category.length !== 0){
        await this.createConnectionArr(HelpTables.ProductCategory,Tables.CATEGORY, productId, prod.category);
      }

      if(prod.allergen.length !== 0){
        await this.createConnectionArr(HelpTables.ProductAllergen, Tables.ALLERGEN, productId, prod.allergen);
      }

      if(allArgs.length !== 0)
      {
        await this.createConnectionArr(HelpTables.ProductArgument, Tables.ARGUMENTS, productId, allArgs);
      }
      
  }

  private checkArgumentArr(processStr:string[]){

    if(processStr === undefined){
     
      processStr = [];
    }
    
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
      let columnName:string = "name";
      
      if(tab == Tables.ARGUMENTS)
      {
        columnName = "text";
      }
      
      
      let sqlQuery:string = `SELECT id FROM ${tableName} WHERE ${columnName} = "${StrHelper.cleanString(word)}";`;
     
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
        if(word === undefined){
          return;
        }

        if(word.length === 0)
        {
            return;
        }
  
        for(let i = 0; i < word.length; i++)
        {
            await this.provideSubtable(tab, word[i]);
        }
  }

  private async provideSubtable(tab:Tables, word:string):Promise<number | null>
  {
       
    return new Promise(async(resolve, reject) => {

      if(word === "" || word === undefined)
      {
         
          resolve(null);
          return;
      }

      let id:number = await this.checkSubTable(tab, word);
      if(id === -1)
      {
         await this.addToSubtable(tab, word);
         resolve(await this.provideSubtable(tab, word));
      }
      else
      {
          resolve(id);
      }


    });

        
  } 


  private async provideMultipleArguments(effect:string, text:string[])
  {
      if(text === undefined){
        return;
      }

      if(text.length === 0){
        return;
      }

      for(let i = 0; i < text.length; i++)
      {
          this.provideArgumentSubtable(effect, text[i]);
      }
  }

  private async provideArgumentSubtable(effect:string, text:string):Promise<number>
  {
      return new Promise(async(resolve, reject) => {

        let checkResult:number = await this.checkArgumentSubtable(text);

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
      let sqlQuery:string = `SELECT id FROM argument WHERE text = "${StrHelper.cleanString(text)}"`;

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
      let effectId:number|null = await this.provideSubtable(Tables.EFFECT, effect);

      let cleanedArgument:string | null  = StrHelper.cleanString(argument);


      let sqlQuery:string = `INSERT INTO argument (text, effectId) VALUES ("${cleanedArgument}","${effectId}")`;

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
        
        let elementId:number|null = await this.provideSubtable(subTable, elements[i]);
        
        if(elementId === null){
          continue;
        }
        await this.addContableEntry(helpTable, productId, elementId);
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
            return "product";
          break;
        case Tables.ALLERGEN:
          return "allergen";
          break;
        case Tables.CATEGORY:
          return "category";
          break;
        case Tables.ECOSCORE:
          return "ecoScore";
          break;
        case Tables.NUTRISCORE:
          return "nutriScore";
          break;
        case Tables.PACKING:
          return "packing";
          break;
        case Tables.MANUFACTURER:
          return "manufacturer";
          break;
        case Tables.EFFECT:
          return "effect";
          break;
        case Tables.ARGUMENTS:
          return "argument";
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
          return "productAllergen"
          break;
        case HelpTables.ProductArgument:
          return "productArgument";
          break;
        case HelpTables.ProductCategory:
          return "productCategory";
          break;
        case HelpTables.ProductArgument:
          return "productArgument";
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
    JOIN productArgument ON argument.id = productArgument.elementid
    JOIN product ON productId = product.id
    JOIN effect ON argument.effectId = effect.id
    WHERE effect.name = "${effect}"
    AND product.id = ${productId};`;

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
      JOIN productAllergen ON allergen.id = productAllergen.elementId
      JOIN product ON product.id = productAllergen.productId
      WHERE product.id = ${productId};`

      return new Promise(async(resolve, reject) => 
      {
        let allergens:string[] = [];
        let results:any[] = await this.doQuery(sqlQuery);

        for(let i = 0; i < results.length; i++)
        {
          allergens.push(results[i].name);
        }

        resolve(allergens);

      });
  }

  private async getCategorys(productId:string):Promise<string[]>
  {
    let sqlQuery:string = `SELECT category.name 
    FROM category
    JOIN productCategory ON category.id = productCategory.elementId
    JOIN product ON product.id = productCategory.productId
    WHERE product.id = ${productId};`

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
