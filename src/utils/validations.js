const validator = require('validator')


const validateSignupData = (req) =>{

  const {firstName, lastName, emailId, password} = req.body;

  if(!firstName || !lastName){
    throw new Error("Please enter your name");
  }
  else if(!validator.isEmail(emailId)){
    throw new Error("enter valid email");
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("enter  strong password");
  }
};

const validateEditProfileData = (req)=>{
  const allowedEdits = ["firstName", "lastName", "about", "gender", "skills", "age", "photo"];

  const isAllowedFields = Object.keys(req.body).every((field) => allowedEdits.includes(field));
  
  return isAllowedFields;
}
module.exports = {
  validateSignupData,
  validateEditProfileData
};