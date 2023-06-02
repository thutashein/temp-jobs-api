
let UserModel = require("../models/User");
let jwt = require("jsonwebtoken");
let {UnauthenticatedError} = require("../errors");


const auth = async function(req,res,next){

    let authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("Authentication Invalid");
    }

    let token = authHeader.split(" ")[1];
    // console.log(token);
    try{
        let payload = jwt.verify(token,'JWTSecret',{expiresIn: "30d"});
        // console.log(payload)
        req.user = {userId:payload.userID,name:payload.name};
        next();
    }catch(err){
        throw new UnauthenticatedError("Authentication Invalid");
    }

}

module.exports = auth;