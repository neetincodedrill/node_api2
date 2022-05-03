const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');


//handle errors
const handleErrors = (err) => {
  console.log(err.message,err.code)
  let errors = { email: '',password: ''};

  //duplicate error code
  if(err.code === 11000){
      errors.email = 'This email is already registerd';
      return errors;
  }

  //validate errors
  if(err.message.includes('user validation failed')){
     Object.values(err.errors).forEach(({properties}) => {
         errors[properties.path] = properties.message;
     })
  }
  return errors
}

//new user
module.exports.signup_post = async(req,res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password,10),
        file: req.body.file
    });

    try{
       await  user.save((err,user) => {
            if(err){
                res.status(500).send({ message: err})
                return;
            }else{
                res.status(201).json(user)
            }
        })
    }catch(error){
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
}

//login function
module.exports.login_post = async(req,res) => {
   try{
       const { email,password } = req.body;
       //validate the user exits
       const user = await User.findOne({email});
       if(user && (await bcrypt.compare(password,user.password))){
           //create token
           const token = await jwt.sign(
               {id : user._id},
               process.env.TOKEN_SECRET,
               {
                   expiresIn: "2h"
               }
           );
            // save user token
            // user.token = token;
            res.cookie('jwt', token, { httpOnly: true, maxAge:  86400 })
            res.setHeader('jwt', token, { httpOnly: true, maxAge: 86400 })
           res.status(200).send({ user: user
        })
       }
   }catch(err){
     console.log(err);
   }
}
