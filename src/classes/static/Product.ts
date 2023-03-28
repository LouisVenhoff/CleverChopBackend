
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
        this.name = product.name;
        this.weight = product.weight;
        this.manufacturer = product.manufacturer;
        this.packing = product.packing;
        this.category = product.category;
        this.allergen = product.allergen;
        this.badArgs = product.badArgs;
        this.goodArgs = product.goodArgs;
        this.commonInfo = product.commonInfo;
        this.nutriScore = product.nutriScore;
        this.ecoScore = product.ecoScore;
        this.code = product.code;  
    }

    // public setCode(code:string)
    // {
    //     this.code = code;
    // }


    public reduceObj():MinimalProduct
    {
           return this.minProduct;
    }

}

export default Product;