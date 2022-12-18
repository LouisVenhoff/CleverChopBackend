import axios from "axios";
import Product from "../static/Product";
import { MinimalProduct } from "../static/Product";

class EanApiController
{ 
    private _userId:string;

    constructor(_userId:string)
    {
        this._userId = _userId
    }

 public async requestEan(ean:string):Promise<MinimalProduct>
 {
    const queryString:string = `http://opengtindb.org/?ean=${ean}&cmd=query&queryid=${this._userId}`

    
    return new Promise(async (resolve, reject) => {

        try
        {
            let result:any = await axios.get(queryString);
            let outObj:Product = new Product(result.data);
            outObj.Code = ean;
            resolve(outObj.reduceObj());
        }
        catch
        {
            reject(null);
        }
        
    
    });

 }
 
 
//  public get userId()
//  {
//     return this._userId;
//  }



}


export default EanApiController;