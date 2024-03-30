import { MinimalProduct } from "../static/Product";

abstract class InfoSource
{
    //This method must be overwritten!
    public async requestEan(ean:string):Promise<MinimalProduct>
    {
        throw("RequestEan function is not implemented in subclass");
    }

    protected getErrorObj(errorCode:number, ean:string):MinimalProduct
    {
        let tempObj: MinimalProduct = {
            error: errorCode,
            name:  "",
            weight: "",
            manufacturer: "",
            packing: "",
            category: [],
            allergen: [],
            badArgs: [],
            goodArgs: [],
            commonInfo:[],
            nutriScore: "",
            ecoScore: "",
            code: ean
          };

          return tempObj;
    }

}



export default InfoSource;

