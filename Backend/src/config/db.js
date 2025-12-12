const mongoose = require("mongoose");

async function connectDB(url) {
  try {
    await mongoose.connect(url);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
