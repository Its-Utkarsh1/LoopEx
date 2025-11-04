const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  size: Number,
  data: Buffer, 
});

const resourceSchema = new mongoose.Schema({
  title: String,
  subject: String,
  category: String,
  description: String,
  files: [fileSchema],
});

module.exports = mongoose.model("Resource", resourceSchema);
