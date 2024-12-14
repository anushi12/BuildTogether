const mongoose = require("mongoose")
require('dotenv').config();

const connectDB = async () => {
  await mongoose.connect(
    process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    }
  );
};

module.exports = {
  connectDB,
}

