
type MinimalProduct = {
    error:number,
    name:string,
    detail:string,
    manufacturer:string,
    mainCat:string,
    subCat:string,
    contents:number,
    packageInfo:number,
    description:string,
    origin:string
}

class Product
{
    error:number = 0;
    name:string = "";
    detail:string = "";
    manufacturer:string = "";
    mainCat:string = "";
    subCat:string = "";
    contents:number = 0;
    packageInfo:number = 0;
    description:string = "";
    origin:string = "";

   

    constructor(apiString:string)
    {
        this.convertApiString(apiString);

        
    }


    

    private convertApiString(input:string)
    {
        let lineArr:string[] = input.split("\n\r");

        for(let i:number = 0; i < lineArr.length; i++)
        {
           this.fillObjData(lineArr[i]);
        }
    }

    private fillObjData(input:string)
    {
        if(!input.includes("="))
        {
            return;
        }

        let processValue:string[] = input.split("=");

        switch(input[0])
        {
            case "error":
                this.error = parseInt(processValue[1]);
                break;
            case "name":
                this.name = processValue[1];
                break;
            case "vendor":
                this.manufacturer = processValue[1];
                break;
            case "maincat":
                this.mainCat = processValue[1];
                break;
            case "subcat":
                this.subCat = processValue[1];
                break;
            case "contents":
                this.contents = parseInt(processValue[1]);
                break;
            case "pack":
                this.packageInfo = parseInt(processValue[1]);
                break;
            case "desc":
                this.description = processValue[1];
                break;
            case "origin":
                this.origin = processValue[1]
                break;
            default:
                return;
                break;
        }
    }

    public reduceObj():MinimalProduct
    {
        
           let outObj:MinimalProduct =  {
                error:this.error,
                name:this.name,
                detail:this.detail,
                manufacturer:this.manufacturer,
                mainCat:this.mainCat,
                subCat:this.subCat,
                contents:this.contents,
                packageInfo:this.packageInfo,
                description:this.description,
                origin:this.origin,
            }
        

            return outObj;
    }

}