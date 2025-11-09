const mongoose = require("mongoose");

async function connectToDB(MONGO_URL) {
  try {
    await mongoose.connect(MONGO-URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

module.exports = connectToDB;
