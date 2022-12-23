var mysql = require("mysql");
import Product, { MinimalProduct } from "../static/Product";
import Tables from "../../enums/tables";
import EanApiController from "../openEan/eanApiController";
class DatabaseManager {
  host: string;
  username: string;
  password: string;
  sqlConnection: any;
  eanSource: EanApiController = new EanApiController("400000000");

  constructor(host: string, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.connect();
  }

  public connect() {
    this.sqlConnection = mysql.createConnection({
      host: this.host,
      user: this.username,
      password: this.password,
      database: "heroku_554b26e8f85d455",
    });

    this.sqlConnection.connect((err: any) => {
      if (!err) {
        console.log("Connection successfully!");
      } else {
        console.log("Connection error!");
      }
    });
  }

  public disconnect() {
    this.sqlConnection.end();
  }

  public async provideProduct(ean: string): Promise<MinimalProduct> {
    
    return new Promise(async (resolve, reject) => {
      

      let errorCode:number = 0;
      let productId:number = 0;
      
      await this.findProduct(ean)
      .then((e:number) => {
        productId = e;
      })
      .catch((e:number) => {
        errorCode = e;
      });
      
      if(errorCode === 0)
      {
        try {
          await this.sqlConnection.query(
            `SELECT Name, Detail, Code, Content, Pack, Description, Origin, Category.category as MainCat, Subcategory.Category as SubCat FROM Product
                                                                      JOIN Origin ON Origin.id = Product.originId
                                                                      JOIN category ON Category.id = Product.catId
                                                                      JOIN subcategory ON Subcategory.id = Product.SubCatId
                                                                      WHERE Product.id = "${productId}";`,
            (error: any, results: any, fields: any) => {
              console.log(results);
              if (results.length === 0) {
                console.log("Article Not Found!");
              }
  
              let loadedItem: MinimalProduct = {
                error: 0,
                name: results[0].Name,
                detail: results[0].Detail,
                code: results[0].Code,
                contents: results[0].Content,
                packageInfo: results[0],
                description: results[0].Description,
                origin: results[0].Origin,
                mainCat: results[0].MainCat,
                subCat: results[0].SubCat,
                manufacturer: "",
              };
  
              resolve(loadedItem);
            }
          );
        } catch {
          //reject(null);
        }
      }
      else
      {
        resolve(this.generateErrorObj(errorCode));
      }
      
    });
  }

  public async writeUnknownEan(ean:string):Promise<boolean>
  {
      return new Promise((resolve, reject) => {
            this.sqlConnection.query(`INSERT INTO unknowncode (Code) VALUES (${ean})`);
        });
  }

  private async findProduct(ean: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      this.sqlConnection.query(
        `SELECT id FROM Product WHERE Code = '${ean}'`,
        async (error: any, results: any, fields: any) => {
          if (results.length === 0) {
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
            resolve(results[0].id);
          }
        }
      );
    });
  }

  private async addProduct(prod: MinimalProduct) {
    let mainCatId: number = await this.provideSecTable(prod.mainCat, Tables.CATEGORY);
    let subCatId: number = await this.provideSecTable(prod.subCat, Tables.SUBCATEGORY);
    let originId: number = await this.provideSecTable(prod.origin,Tables.ORIGIN);

    await this.sqlConnection.query(
      `INSERT INTO product (Name, Detail, Code, Content, Pack, Description, OriginId, CatId, SubCatId)` +
        `VALUES ('${prod.name}', '${prod.detail}', '${prod.code}', '${prod.contents}', '${prod.packageInfo}', '${prod.description}', '${originId}', '${mainCatId}', '${subCatId}')`
    );
  }

  private async addToSecTable(value: string, table: Tables): Promise<boolean> {
    let catType: string;
    let tableName: string;

    return new Promise(async (resolve, reject) => {
      let dbConfig: any = this.getSecTableConfig(table);

      await this.sqlConnection.query(
        `INSERT INTO ${dbConfig.tableName} (${dbConfig.catType}) VALUES ('${value}')`,
        async (error: any, results: any, fields: any) => {
          if (error) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  private async checkSecTable(value: string, table: Tables): Promise<number> {
    //const rows:any[] = await this.sqlConnection.query("SELECT id FROM ");

    let dbConfig: any = this.getSecTableConfig(table);

    return new Promise(async (resolve, reject) => {
      await this.sqlConnection.query(
        `SELECT id FROM ${dbConfig.tableName} WHERE ${dbConfig.catType} = '${value}'`,
        (error: any, result: any, fields: any) => {
          if (result.length > 0) {
            resolve(parseInt(result[0].id));
          } else {
            resolve(0);
          }
        }
      );
    });
  }

  private async provideSecTable(value: string, table: Tables): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let secId: number = await this.checkSecTable(value, table);
      let finalId: number;

      if (secId === 0) {
        await this.addToSecTable(value, table);
        resolve(await this.checkSecTable(value, table));
      } else {
        resolve(secId);
      }
    });
  }


  private getSecTableConfig(
    table: Tables
  ): { catType: string; tableName: string } | null {
    let catType: string;
    let tableName: string;

    switch (table) {
      case Tables.CATEGORY:
        catType = "Category";
        tableName = "category";
        break;
      case Tables.SUBCATEGORY:
        catType = "Category";
        tableName = "subcategory";
        break;
      case Tables.ORIGIN:
        catType = "Origin";
        tableName = "origin";
        break;
      default:
        return null;
    }

    return { catType: catType, tableName: tableName };
  }

  private generateErrorObj(errorCode:number):MinimalProduct
  {
      return({error: errorCode,
              name: "",
              detail: "",
              code: "",
              contents: 0,
              packageInfo: 0,
              description: "",
              origin: "",
              mainCat: "",
              subCat: "",
              manufacturer: ""});
  }



}

export default DatabaseManager;
