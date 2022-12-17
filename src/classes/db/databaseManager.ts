
var mysql = require('mysql');


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


}


export default DatabaseManager;