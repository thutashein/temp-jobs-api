const UserModel = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors");


const register = async (req,res)=>{

    const user = await  UserModel.create({...req.body});
    const token =await user.createJWT();

    res.status(StatusCodes.CREATED).json({user:{name:user.name},token});
}


const login = async (req,res)=>{
    let {email,password} = req.body;

    if(!email || !password){
        throw new BadRequestError("Please Provide Email and Password");
    }

    let user = await UserModel.findOne({email});


    if(!user){
        throw new UnauthenticatedError("Email Invalid Credential");
    }

    let isMatch = await user.comparePassword(password);
    if(!isMatch){
        console.log("not Match pw");
        throw new UnauthenticatedError("Email Invalid Credential");
    }


        let token =await user.createJWT();
        return res.status(StatusCodes.OK).json({user:{name:user.name},token});



}

module.exports = {
    register,
    login
}