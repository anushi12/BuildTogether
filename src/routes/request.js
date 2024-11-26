const express = require("express");
const { userAuth } = require("../middlewares/auth")


const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req,res)=>{
  console.log("request sent");
  
  const user = req.user;
  res.send(user.firstName + " sent you request.");
});

module.exports = requestRouter;