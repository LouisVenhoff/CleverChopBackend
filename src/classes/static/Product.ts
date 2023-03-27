
export type MinimalProduct = {
    error:number,
    name:string,
    weight:string,
    manufacturer:string,
    packing: string,
    category:string[],
    allergen:string[],
    badArgs:string[],
    goodArgs:string[],
    commonInfo:string[],
    nutriScore:string,
    ecoScore:string,
    code:string
}

class Product
{
    error:number = 0;
    name:string = "";
    weight:string = "";
    manufacturer:string = "";
    packing:string = "";
    category:string[] = [];
    allergen:string[] = [];
    badArgs:string[] = [];
    goodArgs:string[] = [];
    commonInfo:string[] = [];
    nutriScore:string = "";
    ecoScore:string = "";
    public code:string = "";
   

    constructor(apiString:string)
    {
        this.convertApiString(apiString);   
    }

    // public setCode(code:string)
    // {
    //     this.code = code;
    // }



    private convertApiString(input:string)
    {
        let lineArr:string[] = input.split("\n");

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
        switch(processValue[0])
        {
            case "error":
                this.error = parseInt(processValue[1]);
                break;
            case "name":
                this.name = processValue[1];
                break;
            case "manufacturer":
                this.manufacturer = processValue[1];
                break;           
        }
    }



  

    public reduceObj():MinimalProduct
    {
           let outObj:MinimalProduct =  {
               error:this.error,
               name:this.name,
               weight:this.weight,
               manufacturer:this.manufacturer,
               packing: this.packing,
               category: this.category,
               allergen: this.allergen,
               badArgs: this.badArgs,
               goodArgs: this.goodArgs,
               commonInfo: this.commonInfo,
               nutriScore: this.nutriScore,
               ecoScore: this.ecoScore,
               code: this.code,
            }
        
            return outObj;
    }

}

export default Product;