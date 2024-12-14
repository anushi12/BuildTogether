const express = require("express");
const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

const USER_PUBLIC_DATA = ["firstName", "lastName", "photo", "about","gender", "age"];

requestRouter.post("/request/send/:status/:receiverId", userAuth, async (req,res)=>{
 try {

    const allowedStatus = ["ignored", "interested"];

    const senderId = req.user._id;
    const receiverId = req.params.receiverId;
    const status = req.params.status;

    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Invalid status: " + status
      });
    }

    const receiver = await User.findById(receiverId);
    if(!receiver){
      return res.status(404).json({message: "User not found"});
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        {senderId, receiverId},
        {senderId: receiverId, receiverId: senderId},
      ],
    })
    if(existingConnectionRequest){
      return res.status(400).json({message: "Connection request already exists"});
    }
   
   const connectionRequest = new ConnectionRequest({
    senderId,
    receiverId,
    status
   });

   const data = await connectionRequest.save();

   res.json({
    message: req.user.firstName + " is " + status + " in " + receiver.firstName,
    data,
   });
 } catch (err) {
    res.status(400).send("ERROR: " + err.message);
 }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req,res)=>{
  try {
      const loggedInUser = req.user;

    const {status, requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];

    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "invalid status"});
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id : requestId,
      receiverId : loggedInUser._id,
      status :"interested",
    });
    if(!connectionRequest){
      return res.status(404).json({message: "connection request not found"});
    }

    connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message : "connection requested " + status,
      data,
    })
  } catch (err) {
    res.status(400).send("ERROR: "+ err.message);
  }
})

requestRouter.get("/feed", userAuth, async (req, res)=>{
  try {
    const loggedInUser = req.user;
      
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const skip = (page - 1)*limit;
      
      const connectionRequest = await ConnectionRequest.find({
        $or: [
          {senderId: loggedInUser._id},
          {receiverId: loggedInUser._id}
        ]
      }).select("senderId receiverId");


      const hideUsers = new Set();
      connectionRequest.forEach((req) => {
        hideUsers.add(req.senderId.toString());
        hideUsers.add(req.receiverId.toString());
      });
    // console.log(hideUsers);

    const users = await User.find({
      $and: [
        {_id : {$nin : Array.from(hideUsers)}},
        {_id : {$ne : loggedInUser._id}}
      ]
    }).select(USER_PUBLIC_DATA).skip(skip).limit(limit);
   res.send(users);
  } catch (err) {
    res.status(400).send({message: err.message});
  }
});





module.exports = requestRouter;