const mongoose = require("mongoose");
// bcrypt
const bcrypt = require("bcryptjs");
//JWT
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
   name:{
       type:String,
       required:[true,"Please Provide Name"],
       maxlength:50,
       minlength:3
   },

    email:{
       type:String,
        required:[true,"Please Provide email"],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please Provide Validate Email"
        ],
        unique:true
    },
    password:{
       type:String,
        required:[true,"Please Provide password"],
        minlength:6
    }
});

UserSchema.pre("save",async function(next){
    let salt = await bcrypt.genSalt(10);
    this.password =await bcrypt.hash(this.password,salt);

    next();
});

UserSchema.methods.createJWT = function ()
{
    return  jwt.sign({userID:this._id,name:this.name},'JWTSecret',{expiresIn: "30d"});
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
}
module.exports = mongoose.model("User",UserSchema);