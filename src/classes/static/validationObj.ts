class ValidationObj
{
    productName:string;
    listOfProducts:string[];

    public obsolete:boolean = false;

    private onExpire:() => void = () => {};

    constructor(productName:string, listOfProducts:string[], expirationTime:number, onExpire?:() => void)
    {
        this.productName = productName;
        this.listOfProducts = listOfProducts;

        if(onExpire != undefined)
        {
            this.onExpire = onExpire;
        }

        setTimeout(() => {
            this.deleteFromList();
            this.obsolete = true;
            this.onExpire();
        }, expirationTime);
    }

    private expire()
    {
        this.deleteFromList();
        this.obsolete = true;
        if()
    }

    private deleteFromList()
    {
        let tempList:string[] = [];

        for(let i = 0; i < this.listOfProducts.length; i++)
        {
            if(this.listOfProducts[i] != this.productName)
            {
                tempList.push(this.listOfProducts[i]);
            }
        }

        this.listOfProducts = tempList;
    }




}

export default ValidationObj;