const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    fileUrls: [{ type: String, required: true }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);
