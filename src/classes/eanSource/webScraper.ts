import { MinimalProduct } from "../static/Product";
import InfoSource from "./infoSource";
import axios from "axios";
const cheerio = require("cheerio");


class WebScraper extends InfoSource
{

    private queryUri:string = "https://de.openfoodfacts.org/produkt/";



    public async requestEan(ean:string):Promise<MinimalProduct>
    {

        let productQuery:string = this.queryUri + ean;

        return new Promise<MinimalProduct>(async (resolve, reject) => 
        {

                let resultHtml:any;
            
            
                try
                {
                    let result = await axios.request({
                        method: 'GET',
                        url: productQuery,
                        responseType: 'arraybuffer',
                        responseEncoding: 'binary'
                    });

                    resultHtml = result.data;
                }
                catch(ex:any)
                {
                    console.error(ex.message);
                    throw("Error whil accessing Product Source!");
                }

                let resultHtmlStr:string = resultHtml.toString("latin1");

                console.log(this.generateMinimalProduct(resultHtml));


        });
    }



    private generateMinimalProduct(html:string):MinimalProduct
    {
        
        const $:any = cheerio.load(html);

        let tempObj:MinimalProduct =  {
            error:0,
            name:"",
            detail:"",
            manufacturer:"",
            mainCat:"",
            subCat:"",
            contents:0,
            packageInfo:0,
            description:"",
            origin:"",
            code:"",
        }

        if(!this.checkProductProvided($))
        {
            tempObj.error = 1;
            return tempObj;
        }



        tempObj.name = $('.title-1').text();
        tempObj.detail = ""
        
        return tempObj;
    }



    private checkProductProvided(htmlData:any):boolean
    {
        if(htmlData("if-empty-dnone").text() === "Error")
        {
            return false;
        }
        else
        {
             return true;
        }
        
        
       
    }








}


export default WebScraper;



