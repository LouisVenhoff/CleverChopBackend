class StrHelper
{

    public static cleanString(input:string):string
    {
        
       let output = input.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '').replace(/\\+/g, '');
        
        return output;
    }

}


export default StrHelper;