class ValidationObj
{
    code:string;
    listOfCodes:string[];

    public obsolete:boolean = false;

    private onExpire:(productName:string) => void = (productName:string) => {};

    constructor(code:string, listOfProducts:string[], expirationTime:number, onExpire?:(productName:string) => void)
    {
        this.code = code;
        this.listOfCodes = listOfProducts;

        if(onExpire != undefined)
        {
            this.onExpire = onExpire;
        }

        setTimeout(() => {
            this.expire();
        }, expirationTime);
    }

    public getCode():string
    {
        return this.code;
    }


    private expire()
    {
        this.deleteFromList();
        this.obsolete = true;
        this.onExpire(this.code);
    }

    private deleteFromList()
    {
        let tempList:string[] = [];

        for(let i = 0; i < this.listOfCodes.length; i++)
        {
            if(this.listOfCodes[i] != this.code)
            {
                tempList.push(this.listOfCodes[i]);
            }
        }

        this.listOfCodes = tempList;
    }




}

export default ValidationObj;