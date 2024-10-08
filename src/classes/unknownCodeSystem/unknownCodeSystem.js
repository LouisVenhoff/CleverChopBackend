// import DatabaseManager from "../db/databaseManager";
// import { MinimalProduct } from "../static/Product";
// import ValidationObj from "../../classes/static/validationObj";
// class UnknownCodeSystem
// {
//     private dbMng:DatabaseManager;
//     private codesInProcess:string[] = [];
//     private expireControllers:ValidationObj[] =[];
//     constructor(dbMng:DatabaseManager, force:boolean)
//     {
//         this.dbMng = dbMng;
//         if(!force)
//         {
//             this.checkDbConnection();
//         }
//     }
//     public async getCodeFromUnknownTable():Promise<string>
//     {
//         let rows:any[] = await this.dbMng.getUnknownCodeRows();
//         let selectedCode:string;
//         let counter:number = 1;
//         if(rows.length === 0)
//         {
//             console.log();
//             return "";
//         }
//         do
//         {
//            if(rows.length !== 0 && counter <= rows.length)
//            {
//               selectedCode = rows[rows.length - counter].code;
//            }
//            else
//            {
//               return "";
//            }
//            counter++;
//         }
//         while(!this.checkCode(selectedCode))
//         this.codesInProcess.push(selectedCode);
//         this.expireControllers.push(new ValidationObj(selectedCode, this.codesInProcess, 600000, (code:string) => {this.codeExpireHandler(code)}));
//         return selectedCode;
//     }
//     public async validateCode(code:string):Promise<boolean>
//     {
//         return new Promise(async (resolve, reject) => {
//             let testObj:MinimalProduct = await this.dbMng.provideProduct(code);
//             if(testObj.error === 0)
//             {
//                 this.dbMng.deleteUnknownCode(code);
//                 this.codesInProcess = this.codesInProcess.filter(element => element !== code);
//                 resolve(true);
//             }
//             else
//             {
//                 resolve(false);
//             }
//         });
//     }
//     private checkCode(code:string):boolean
//     {
//         for(let i:number = 0; i < this.codesInProcess.length; i++)
//         {
//             if(this.codesInProcess[i] === code)
//             {
//                 return false;
//             }
//         }
//         return true
//     }
//     private async checkDbConnection()
//     {
//         if(this.dbMng.getConnectionState())
//         {
//             return
//         }
//         else
//         {
//             await this.dbMng.connect();
//             if(!this.dbMng.getConnectionState())
//             {
//                 throw("Class UnknownCodeSystem: The DatabaseManager cant Connect!");
//             }
//         }
//     }
//     private codeExpireHandler(expiredCode:string)
//     {
//         let tempValidationList:ValidationObj[] = [];
//         let tempCodeList:string[] = [];
//         for(let i = 0; i < this.expireControllers.length; i++)
//         {
//             if(this.expireControllers[i].getCode() !== expiredCode)
//             {
//                 tempValidationList.push(this.expireControllers[i]);
//                 tempCodeList.push(this.expireControllers[i].getCode());
//             }
//         }
//         this.codesInProcess = tempCodeList;
//         //Check if code is Deleted from the CodesInProcess Method
//         let checkNumber:number = this.codesInProcess.findIndex(function(value:string, index:number, arr:string[]) 
//         {
//             return value === expiredCode;
//         });
//         if(checkNumber !== -1)
//         {
//             console.log(`Warning: The Code: ${expiredCode} could not deleted from the CodesInProcess list!` );
//         }
//         else
//         {
//             console.log(`${expiredCode} expired!`);
//         }
//         this.expireControllers = tempValidationList;
//     }
// }
// export default UnknownCodeSystem;
