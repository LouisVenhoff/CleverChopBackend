import axios from "axios";

class EanApiController
{ 
    private _userId:string;

    constructor(_userId:string)
    {
        this._userId = _userId
    }

 public async requestEan(ean:string)
 {
    const queryString:string = `http://opengtindb.org/?ean=${ean}&cmd=query&queryid=${this._userId}`

    let test:any = await axios.get(queryString);

    console.log(test.data);
 }
 
 
//  public get userId()
//  {
//     return this._userId;
//  }



}


export default EanApiController;