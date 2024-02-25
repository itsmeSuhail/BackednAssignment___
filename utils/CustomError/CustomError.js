class CustomError extends Error{
  constructor(message, statusCode,body){
      super(message);
      this.statusCode = statusCode;
      this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
      this.body=body
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
  }
}

export default CustomError;
