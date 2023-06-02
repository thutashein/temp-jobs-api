const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCodes : err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something Went Wrong"
  };

  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

    if(err.name === "ValidationError"){
        customError.statusCodes = StatusCodes.BAD_REQUEST;
        customError.msg = Object.values(err.errors).map((item)=> item.message).join(",");
    }

    if(err.name === "CastError"){
        customError.statusCodes = StatusCodes.BAD_REQUEST;
        customError.msg = `No Job with that id:${err.value}`;
    }

  if(err.code && err.code === 11000){
     customError.statusCodes = StatusCodes.BAD_REQUEST;
     customError.msg = `Your email is duplicate please try with other ${Object.keys(err.keyValue)}`;
  }

  // return res.status(customError.statusCodes).json({ err });
  return res.status(customError.statusCodes).json({ msg:customError.msg });
}

module.exports = errorHandlerMiddleware
