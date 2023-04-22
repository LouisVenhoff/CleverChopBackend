
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
    minProduct:MinimalProduct;

    constructor(product:MinimalProduct)
    {
        this.minProduct = product;
        this.error = product.error;
        this.writeArgsSafe(this.name,product.name);
        this.writeArgsSafe(this.weight, product.weight);
        this.writeArgsSafe(this.manufacturer, product.manufacturer);
        this.writeArgsSafe(this.packing, product.packing);
        this.writeArgsSafe(this.category, product.category);
        this.writeArgsSafe( this.allergen, product.allergen);
        this.writeArgsSafe(this.badArgs, product.badArgs);
        this.writeArgsSafe(this.goodArgs, product.goodArgs);
        this.writeArgsSafe(this.commonInfo, product.commonInfo);
        this.writeArgsSafe(this.nutriScore, product.nutriScore);
        this.writeArgsSafe(this.ecoScore, product.ecoScore);
        this.writeArgsSafe(this.code, product.code);  
    }

    // public setCode(code:string)
    // {
    //     this.code = code;
    // }

    public static getEmptyMinimalProduct():MinimalProduct
    {
        let outProd:MinimalProduct = {
            error: 0,
            name: "",
            weight: "",
            manufacturer: "",
            packing: "",
            category: [],
            allergen: [],
            badArgs: [],
            goodArgs: [],
            commonInfo: [],
            nutriScore: "",
            ecoScore: "",
            code: ""
        }

        return outProd;
    }



    public reduceObj():MinimalProduct
    {
           return this.minProduct;
    }

    private writeArgsSafe(arg:any, input:any)
    {
        if(input !== undefined)
        {
            arg = input;
        }
        
    }

}

export default Product;