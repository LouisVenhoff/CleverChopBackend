import DatabaseManager from "../db/databaseManager";
import { MinimalProduct } from "../static/Product";

class UnknownCodeSystem
{
    
    private dbMng:DatabaseManager;
    private codesInProcess:string[] = [];

    constructor(dbMng:DatabaseManager, force:boolean)
    {
        this.dbMng = dbMng;
        
        if(!force)
        {
            this.checkDbConnection();
        }
        
    }




    public async getCodeFromUnknownTable():Promise<string>
    {
        
        let rows:any[] = await this.dbMng.getUnknownCodeRows();
       
        let selectedCode:string;
        let counter:number = 1;

        

        if(rows.length === 0)
        {
            console.log();
            return "";
        }

        do
        {
           if(rows.length !== 0 && counter <= rows.length)
           {
              selectedCode = rows[rows.length - counter].code;
           }
           else
           {
              return "";
           }

           counter++;
        }
        while(!this.checkCode(selectedCode))
       
        this.codesInProcess.push(selectedCode);

        return selectedCode;
    }

    public async validateCode(code:string):Promise<boolean>
    {
        return new Promise(async (resolve, reject) => {

            let testObj:MinimalProduct = await this.dbMng.provideProduct(code);

            if(testObj.error === 0)
            {
                this.dbMng.deleteUnknownCode(code);
                resolve(true);
            }
            else
            {
                resolve(false);
            }

        });
    }

    private checkCode(code:string):boolean
    {
        for(let i:number = 0; i < this.codesInProcess.length; i++)
        {
            if(this.codesInProcess[i] === code)
            {
                return false;
            }
        }
        return true
    }

    private async checkDbConnection()
    {
        if(this.dbMng.getConnectionState())
        {
            return
        }
        else
        {
            await this.dbMng.connect();
            if(!this.dbMng.getConnectionState())
            {
                throw("Class UnknownCodeSystem: The DatabaseManager cant Connect!");
            }
        }
    }


}

export default UnknownCodeSystem;