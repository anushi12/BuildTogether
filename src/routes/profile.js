const express = require("express");
const { userAuth } = require("../middlewares/auth")
const {validateEditProfileData} = require("../utils/validations");

const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth, async (req, res)=>{
  try{
      const user = req.user;
      res.send(user);
  }catch(err){
  res.status(400).send("Error: "+ err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res)=>{
  
  try {
    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);

    // console.log(loggedInUser);
    await loggedInUser.save();

    res.json({
      message: "Profile updated!!",
      data: loggedInUser
    });
  } catch (err) {
    res.status(401).send("Error: "+ err.message);
  }


})

module.exports = profileRouter;