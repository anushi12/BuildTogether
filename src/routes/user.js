const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");


const userRouter = express.Router();

const USER_PUBLIC_DATA = ["firstName", "lastName", "photo", "about","gender", "age", "skills"];

userRouter.get("/user/requests/received", userAuth, async (req, res) =>{
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      receiverId : loggedInUser._id,
      status : "interested"
    }).populate("senderId", USER_PUBLIC_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequest,
    });
  } catch (err) {
    res.status(400).send("ERROR: "+ err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req,res)=>{
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {senderId : loggedInUser._id, status: "accepted"},
        {receiverId: loggedInUser._id, status: "accepted"}
      ]
    }).populate("senderId", USER_PUBLIC_DATA).populate("receiverId", USER_PUBLIC_DATA);

    const data = connectionRequest.map((row)=>{
      if(row.senderId._id.toString() === loggedInUser._id.toString( )){
        return row.receiverId;
      }
      return row.senderId;
    });

    res.json({connectionRequest });

  } catch (err) {
    res.status(400).send("Error: "+ err.message);
  }
})

module.exports = userRouter;