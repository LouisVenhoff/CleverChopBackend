import { MinimalProduct } from "../static/Product";
import InfoSource from "./infoSource";
import axios from "axios";
import StrHelper from "../helpers/strhelper";
const cheerio = require("cheerio");

class WebScraper extends InfoSource {
  private queryUri: string = "https://de.openfoodfacts.org/produkt/";

  public async requestEan(ean: string): Promise<MinimalProduct> {
    
    let productQuery: string = this.queryUri + ean;

    return new Promise<MinimalProduct>(async (resolve, reject) => {
      let resultHtml: any;

      try {
        let result = await axios.request({
          method: "GET",
          url: productQuery,
          responseType: "arraybuffer",
          responseEncoding: "binary",
        });

        resultHtml = result.data;
      } catch (ex: any) {
        console.error(ex.message);
        throw "Error while accessing Product Source!";
      }

      let resultHtmlStr: string = resultHtml.toString("latin1");

      resolve(this.generateMinimalProduct(resultHtmlStr, ean));
      
    });
  }

  private generateMinimalProduct(html: string, ean:string): MinimalProduct {
    const $: any = cheerio.load(html);

    let weight: string;
    let packing: string;
    let manufacturer: string;
    let category: string[];
    let badArgs: string[];
    let goodArgs: string[];
    let commonInfo: string[];
    let nutriScore: string;
    let ecoScore: string;

    let tempObj: MinimalProduct = {
      error: 0,
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

    if (!this.checkProductProvided($)) {
      tempObj.error = 1;
      return tempObj;
    }

    tempObj.name = this.loadName($);
    tempObj.weight = this.loadWeight($);
    tempObj.manufacturer = this.loadManufacturer($);
    tempObj.packing = this.loadPacking($);
    tempObj.category = this.loadCategorys($);
    tempObj.allergen = this.loadAllergenes($);
    tempObj.badArgs = this.loadBadArguments($);
    tempObj.goodArgs = this.loadGoodArguments($);
    tempObj.commonInfo = this.loadCommonInfo($);
    
    this.applyScores($, tempObj);

    return tempObj;
  }


  private loadName($:any )
  {
      return $(".title-1").text();
  }


  private loadWeight($: any): string {
    let weight:string = $("#field_quantity_value").text(); //Gewicht/Anzahl

    weight = this.checkProperty(weight);

    return weight;
  }

  private loadPacking($: any): string {
    let packing:string =  $("#field_packaging_value").first().text();

    packing = this.checkProperty(packing);
    
    return packing;
  }

  private loadManufacturer($: any): string {
    let manufacturer:string =  $("#field_brands_value").first().text();

   manufacturer = this.checkProperty(manufacturer);

    return manufacturer;
  }


  private checkProperty(input:string):string{

    if(input !== undefined){
        if(input !== ""){
            return input;
        }
    }
      
      return("Keine Informationen");
  }

  private applyScores($: any, prod:MinimalProduct) 
  {
    
    let ecoScore:string = "X";
    let nutriScore:string =  "X";
    $(".grade_a_title").each((index: number, child: any) => {
        if(this.isEcoScore($(child).text()))
        {
            ecoScore="A";
        }
        else
        {
            nutriScore="A";
        }
      });
    $(".grade_b_title").each((index: number, child: any) =>  {
      if(this.isEcoScore($(child).text()))
      {
        ecoScore = "B";
      }
      else
      {
        nutriScore = "B";
      }
    });
    $(".grade_c_title").each((index: number, child: any) => {
        if(this.isEcoScore($(child).text()))
        {
            ecoScore="C";
        }
        else
        {
            nutriScore="C";
        }
    });
    $(".grade_d_title").each((index: number, child: any) => {
        if(this.isEcoScore($(child).text()))
        {
            ecoScore="D";
        }
        else
        {
            nutriScore="D";
        }
    });
    $(".grade_e_title").each((index: number, child: any) => {
        if(this.isEcoScore($(child).text()))
        {
            ecoScore="E";
        }
        else
        {
            nutriScore="E";
        }
    });

    


    prod.ecoScore = ecoScore;
    prod.nutriScore = nutriScore;
    
  }

  
  private isEcoScore(input:string):boolean
  {
        let ecoRegex:any = RegExp("Eco*");

        let result:any = ecoRegex.exec(input)

        if(result === null)
        {
            return false;
        }
        else
        {
            return true;
        }
  }

  private loadCategorys($: any): string[] {
    return this.loadArrInfoWithChild($, "#field_categories_value");
  
  }

  private loadAllergenes($:any):string[]
  {
    return this.loadArrInfo($, ".allergen");
  }

  private loadGoodArguments($: any): string[] {
    return this.loadArrInfo($, ".evaluation_good_title");
  }

  private loadBadArguments($: any): string[] {
    return this.loadArrInfo($, ".evaluation_bad_title");
  }

  private loadCommonInfo($: any): string[] {
    return this.loadArrInfo($, ".evaluation__title");
  }


  private loadArrInfoWithChild($: any, cssLink: string): string[] {
    let temp: string[] = [];

    $(cssLink)
      .children()
      .each(function (index: number, child: any) {
        temp.push($(child).text());
      });

    return temp;
  }

  private loadArrInfo($:any, cssLink:string):string[]
  {
      let temp:string[] = [];

      $(cssLink)
      .each(function (index:number, child:any) {
        temp.push($(child).text());
      })

      return temp;
  }

  private checkProductProvided(htmlData: any): boolean {
    if (htmlData(".if-empty-dnone").text() === "Fehler") {
      return false;
    } else {
      return true;
    }
  }
}

export default WebScraper;
