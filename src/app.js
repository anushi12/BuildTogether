const express = require("express")
const { connectDB } =require("./config/database")
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const PORT = process.env.PORT || 8000;

connectDB()
.then(()=>{
  console.log("Database connection is successful..")
  app.listen(PORT, () =>{
    console.log("Server is running at port 8000");
  })
})
.catch((err)=>{
  console.error("database is not connected")
});
