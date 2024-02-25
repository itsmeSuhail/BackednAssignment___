import CustomError from "../utils/CustomError/CustomError.js";


const castErrorHandler = (err) => {
    return new CustomError("invalid value", 400,{[err.path]:`${err.path} is not valid`});
}

const duplicateKeyErrorHandler = (err) => {
 const name = err.keyValue.name;
 return new CustomError("fileds required", 400,{[name]:"duplicate is not allowed"});
}

const validationErrorHandler = (err) => {
    const errorBucket={}
    Object.values(err.errors).map(error=>{
        const key=error.path||"";
        errorBucket[key]= error.message;
    });
    return new CustomError("fields required", 400,errorBucket);
}

const prodErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
            ...(error.body&&({body:error.body}))
        });
    }else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}

export default (error, req, res, next) => {
    console.log(error)
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
        if(error.name === 'CastError') error = castErrorHandler(error);
        if(error.code === 11000) error = duplicateKeyErrorHandler(error);
        if(error.name === 'ValidationError') error = validationErrorHandler(error);

        prodErrors(res, error);
}