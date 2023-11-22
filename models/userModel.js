const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,'Please enter a username.']
    }
    ,
    userEmail:{
        type:String,
        required:[true,'Please enter an email.'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a vaild email.']
    }
    ,
    userPassword:{
        type:String,
        required:[true,'Please enter a password.'],
        minlength:[6,'Minimum length of password is 6 characters.']
    }
})

// static method to signin user

userSchema.statics.signin = async function(email,password)
{
    const user = await this.findOne({userEmail:email})
    if(user)
    {
        const auth = await bcrypt.compare(password,user.userPassword )
        if(auth)
        {
            return user
        }
        throw Error('Incorrect password.')
    }
    throw Error('Incorrect email.')
}

userSchema.pre('save',async function (next){
    const salt =await bcrypt.genSalt()
    this.userPassword = await bcrypt.hash(this.userPassword,salt)
    next()
})
const User = mongoose.model('chatApplicationUser' , userSchema)

module.exports = User;