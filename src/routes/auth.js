const express = require("express");
const {validateSignupData} = require("../utils/validations")
const User = require("../models/user")
const bcrypt = require('bcrypt');



const authRouter = express.Router();

authRouter.post("/signup", async (req, res)=>{
  // console.log(req.body);
  try{

    validateSignupData(req);

    const {firstName, lastName, emailId, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 15);
    // console.log(passwordHash);


    const user = new User({firstName, lastName, emailId, password:passwordHash});

    await user.save();
    res.send("User added successfully");
  }
  catch(err){
    res.status(400).send("Error:  "+ err.message)
 }
});

authRouter.post("/login", async(req, res)=>{
  try {
    const {emailId, password} = req.body;

    const user = await User.findOne({emailId: emailId});
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if(isPasswordValid){
      const token = await user.getJWT();
      // console.log(token);
      res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});
      res.send("Login Successful");
    }else{
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: "+ err.message);
  }
});

authRouter.post("/logout", async (req,res)=>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful")
})

module.exports = authRouter;