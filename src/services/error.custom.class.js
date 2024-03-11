class CustomError extends Error {
    constructor(obj){
        super(obj.message);
        this.code = obj.code;
    }
}

export default CustomError;