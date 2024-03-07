import DatabaseConfigError from "./databaseConfigError";
const fs = require("fs");

export type DatabaseConfig = {
    host:string,
    username:string,
    password:string,
    database:string,
}


class DatabaseConfigSystem{

    private configObj:DatabaseConfig | undefined;

    private configFileName:string;

    private startCallback:(config:DatabaseConfig) => void;

    constructor(configFileName:string, startCallback:(config:DatabaseConfig) => void)
    {
        this.configFileName = configFileName;
        this.startCallback = startCallback;
        this.readConfigFile();
    }

    public get config():DatabaseConfig
    {
        if(this.configObj !== undefined)
        {
            return this.configObj;
        }
        else
        {
            throw new DatabaseConfigError("Database Config could not be loaded!");
        }
    }

    private async readConfigFile()
    {
        fs.readFile(this.configFileName, "utf8", async (err:any, data:any) => {
            if(err){
                await this.createConfigFile();
                console.error(`Please enter the database credentials to: ${this.configFileName}`);
                process.exit(1);
            }
            else{
                try
                {
                    this.configObj = JSON.parse(data);
                    this.startCallback(this.configObj!);
                }
                catch
                {
                    throw new DatabaseConfigError(`Config file (${this.configFileName}) is corrupt, please delete it and let the software recreate it!`);
                }
            }
        });
    }

    private async createConfigFile():Promise<boolean>
    {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.configFileName, JSON.stringify({host:"", username:"", password:"", database:""}), (err:any) => {
                if(err){
                    reject();
                }
                else{
                    resolve(true);
                }
            })
        });   
    }

}

export default DatabaseConfigSystem;


