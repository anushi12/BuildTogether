const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status:{
      type: String,
      enum:{
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is a invalid status type`,
      },
    },
  },
{timestamps: true}
);

connectionRequestSchema.pre("save", function(next){
  const connectionRequest = this;

  if(connectionRequest.senderId.equals(connectionRequest.receiverId)){
    throw new Error("Cannot send request to self");
  }
  next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;