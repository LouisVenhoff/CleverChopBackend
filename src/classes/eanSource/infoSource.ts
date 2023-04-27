import { MinimalProduct } from "../static/Product";

abstract class InfoSource
{
    //This method must be overwritten!
    public async requestEan(ean:string):Promise<MinimalProduct>
    {
        throw("RequestEan function is not implemented in subclass");
    }

}



export default InfoSource;

