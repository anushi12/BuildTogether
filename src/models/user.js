const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 20,
  },
  lastName:{
    type: String,
    required: true,
  },
  emailId:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid Email Address " + value)
      }
    }
  },
  password: {
     type: String,
     required: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    validate(value){
      if(!["male", "female", "Others"].includes(value)){
        throw new Error("Gender data is not valid");
      }
    }
  }, 
  photo:{
    type : String,
  },
  about:{
    type : String,
  },
  skills:{
    type : [String],
    default: "C++, Python,..."
  }
}, {timeStamps : true});


userSchema.methods.getJWT = async function(){
  const user = this;

  const token = await jwt.sign({_id : user._id}, "Oreo@Hike$1209",{
    expiresIn: "1d"
  });

  return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;

  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema);

// module.exports = User ;