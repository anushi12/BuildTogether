const mongoose = require("mongoose")

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anushikhadas260:7HCZgBO2rzFhDVgv@cluster0.zzmq1.mongodb.net/codehike"
  );
};

module.exports = {
  connectDB,
}

