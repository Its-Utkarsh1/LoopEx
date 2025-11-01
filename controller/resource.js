const Resource = require("../models/Resource");

const handleUploadResource = async (req, res) => {
  try {
    const { title, subject, category, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileUrls = req.files.map(file => `/uploads/${file.filename}`);

    const newResource = new Resource({
      title,
      subject,
      category,
      description,
      fileUrls,
    });

    await newResource.save();
    res.status(200).json({ message: "Resource uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload resource" });
  }
};

module.exports = { handleUploadResource };
