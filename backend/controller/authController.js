const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {emailValidation,passwordValidation } = require("./validation");
const requireAuth = require('../middleware/authMiddleware')

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

// storing file in upload folder and changing path name
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "../uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
});

//multer to upload file in uploads folder
const maxSize = 4 * 1024 * 1024; //for 1 MB
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  limits: { fileSize: maxSize },
}).single("file");

//get function to get a user bu its id
module.exports.get_user = async(req,res) => {
  const id = req.params.id
  try{
    const user = await User.findById(id)
    res.status(200).send(user)
 }catch(err){
     res.status(400).send('User not found')
 }
}

//new user
module.exports.signup_post = async(req,res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json("File too large should be less than 4 MB");
          }else if (err) {
            return res
              .status(400)
              .json("Only .png, .jpg and .jpeg format filetype  allowed!");
          }else{
            var fieldValidation = [
              passwordValidation(req.body.password),
              emailValidation(req.body.email),
              ];
            const user = new User({
                file: req.file.path,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password,10),
            });
            try{
              const emailduplication = await User.findOne({ email: user.email });
              console.log(emailduplication)
              const error = [];
              if (emailduplication) {
                res.status(400).json("User with same email already exits");
            }else{
              if (fieldValidation[0] === true && fieldValidation[1] === true) {
                await  user.save((err,user) => {
                  if(err){
                      res.status(400).json({ message: err})
                      return;
                  }else{
                      res.status(201).json('New user created')
                  }
              })
              }else{
                fieldValidation.forEach((element) => {
                  if (typeof element === "string" || typeof element === false) {
                  error.push(element);
                  }
              });
              res.status(401).send(error);
              }          
            }              
             }catch (err) {
              console.log(err);
              }
          }
    })
}

//login function
module.exports.login_post = async(req,res) => {
   try{
       const { email,password } = req.body;
       //validate the user exits
       const user = await User.findOne({email});
       if(!user) return res.status(400).json('email is wrong')
       const validPassword = await bcrypt.compare(password,user.password)
       if(!validPassword) return res.status(400).json('password is wrong')
        //create token
        const token = await jwt.sign(
            {id : user._id},
            process.env.TOKEN_SECRET,
            {
                expiresIn: "2h"
            }
        );
          
        res.cookie('jwt', token, { httpOnly: true, maxAge:  86400 })
        res.setHeader('jwt', token)
        res.status(200).json({id: user._id,token: token})
   }catch(err){
     console.log(err);
   }
}


//update function to update file path
module.exports.user_update = async(req,res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send("File too large should be less than 1 MB");
    }else if (err) {
      return res
          .status(400)
          .send("Only .png, .jpg and .jpeg format filetype  allowed!");
    }else{
      const id = req.params.id
      try{
          const user = await User.findByIdAndUpdate(id,{
              $set: {file: req.file.path}
          })
          res.status(200).json('User Account updated');
      }catch(error){
          return res.status(500).send('You can only update your account')
      }
    }
  })
}

//to check the tokenSecret


