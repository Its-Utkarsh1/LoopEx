const mongoose = require("mongoose");

async function connectToDB(url) {
  return mongoose.connect(url, {
    serverSelectionTimeoutMS: 10000,
    // useNewUrlParser / useUnifiedTopology not needed on Mongoose 6+
  });
}

module.exports = connectToDB;
