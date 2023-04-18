

class StrHelper
{

    public static cleanString(input:string):string | null
    {
        try{
            let output = input.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/\\+/g, '');
        
            return output;
        }
        catch{
            return null;
        }
       
    }

}


export default StrHelper;