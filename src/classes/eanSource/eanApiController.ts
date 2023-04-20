import axios from "axios";
import StrHelper from "../helpers/strhelper";
import Product from "../static/Product";
import { MinimalProduct } from "../static/Product";
import InfoSource from "./infoSource";

class EanApiController extends InfoSource
{ 
    private _userId:string;

    constructor(_userId:string)
    {
        super();
        this._userId = _userId
    }

 public async requestEan(ean:string):Promise<MinimalProduct>
 {
    const queryString:string = `http://opengtindb.org/?ean=${ean}&cmd=query&queryid=${this._userId}`

    
    return new Promise(async (resolve, reject) => {

        try
        {
            let result:any = await axios.request({
                method: 'GET',
                url: queryString,
                responseType: 'arraybuffer',
                responseEncoding: 'binary'
            });
           

            //TODO: Result.data.toString("latin1") muss in ein MinimalProduct Konvertiert werden!


             let outObj:Product = new Product(this.rawToMinProduct(result.data.toString("latin1"), ean));
             outObj.code = ean;
             resolve(outObj.reduceObj());
        }
        catch(Err:any)
        {
            console.log(Err.message);
            reject(null);
        }
        
    
    });

 }
 
 
    private rawToMinProduct(rawString:string, ean:string):MinimalProduct
    {
        let outProd = Product.getEmptyMinimalProduct();    //Der Produktname wird aus dem String gefiltert und einem neuen leeren Minimalprodukt zugewiesen
        outProd.code = ean;
        let cleanedInfo = rawString.split("\n");

        for(let i = 0; i < cleanedInfo.length; i++){
            
            let infoPair:string[] = cleanedInfo[i].split("=");
            if(infoPair[0] === "name"){
                outProd.name = infoPair[1];
                break;
            }


        }

        return outProd;

    }


    


}


export default EanApiController;