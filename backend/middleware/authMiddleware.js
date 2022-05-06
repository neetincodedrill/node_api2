const jwt = require('jsonwebtoken');
const User = require("../model/user");

const requireAuth = async(req,res,next) => {
    const token =  req.headers["jwt"];
  
    //check json web token exits and its verified
    if(!token) return res.status(403).send('A token is required for authentication')
    try{
        const decode =await jwt.verify(token,process.env.TOKEN_SECRET)
        const user = await User.findOne({ _id : decode.id})
        req.user = user
    
    }catch(error){
        res.status(401).send('Invalid token')
    }
    return next();
}

module.exports = requireAuth 