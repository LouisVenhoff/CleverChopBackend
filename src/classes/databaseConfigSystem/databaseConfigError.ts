export class DatabaseConfigError extends Error{

    constructor(message:string)
    {
        super(message);
    }

}

export default DatabaseConfigError;