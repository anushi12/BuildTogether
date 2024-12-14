const express = require("express")
const { connectDB } =require("./config/database")
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user")
const historyRouter = require("./routes/history");
const suggestionRouter = require("./routes/suggestion");
const moodRouter = require("./routes/mood");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", historyRouter);
app.use("/", suggestionRouter);
app.use("/", moodRouter);

// console.log(process.env.PORT); 
// console.log(process.env.DATABASE_CONNECTION);

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
