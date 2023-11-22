const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../models/userModel')
const requireAuth = (req, res, next) => {
  const token = req.cookies.userJWT;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/signin");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/signin");
  }
};

const checkuser = (req,res,next)=>{
    const token = req.cookies.userJWT;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async(err, decodedToken) => {
        if (err) {
          
          res.locals.user=null
          next()
        } else {
            const user = await User.findById(decodedToken.id)
            res.locals.user=user;
          next();
        }
      });
    } else {
        res.locals.user=null
        next()
    }
}
module.exports={requireAuth ,checkuser}
