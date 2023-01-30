class NetworkProvider
{
    static async checkConnection():Promise<boolean>
    {
        return new Promise((resolve, reject) => {

            require("dns").resolve("www.google.com", function (err:any){
                if(!err)
                {
                    resolve(true);
                }
                else
                {
                    resolve(false);
                }
            })

        });
    }
}

export default NetworkProvider;