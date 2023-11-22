const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config()
function handleErrors (error) {
    let errors = {userName:'',userEmail:'',userPassword:''}
    console.log(error.message,error.code)
    if(error.code===11000)
    {
        errors.userEmail='This email is already registered.'
        return errors
    }
   // Incorrect Email

   if(error.message==='Incorrect email.')
   {
       errors.userEmail='This email is not registered.'
   }

   // Incorrect Password
   if(error.message === 'Incorrect password.')
   {
       errors.userPassword = 'Incorrect password.'
   }
   // Duplicate error code


    
    if(error.message.includes('validation failed')){
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        });
    }
    return errors
}
const maxAge=60*60*24

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:maxAge})
}
module.exports.signin_get=(req,res)=>{
    res.render('SignInIndex')
}

module.exports.signin_post=async(req,res)=>{
    let { userEmail , userPassword} = req.body
    try{
      const user = await User.signin(userEmail,userPassword)
      const token = createToken(user._id)
      res.cookie('userJWT',token,{httpOnly:true,maxAge:maxAge})
      res.status(200).json({user:user._id});
    } 
    catch(error)
    {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
}

module.exports.signup_get=(req,res)=>{
    res.render('SignUpIndex')
}

module.exports.signup_post = async (req,res)=>{
    
    let {userName , userEmail , userPassword} = req.body
    
    try{
      let user = await  User.create({userName,userEmail,userPassword})
      const token = createToken(user.id)
      res.cookie('userJWT',token,{httpOnly:true,maxAge:maxAge*1000})
      res.status(201).json({user:user._id});
    } 
    catch(error)
    {
        const errors = handleErrors(error)
        res.status(400).json({errors})
    }
}

module.exports.signout_get=(req,res)=>{
    res.cookie('userJWT','',{maxAge:1})
    res.redirect('/')
}