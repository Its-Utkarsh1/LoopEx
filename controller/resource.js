const Resource = require("../models/Resource");

// ✅ Upload files (store buffer in MongoDB)
const handleUploadResource = async (req, res) => {
  try {
    const { title, subject, category, description } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Store file buffers directly in DB
    const files = req.files.map(file => ({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      data: file.buffer,
    }));

    const resource = new Resource({
      title,
      subject,
      category,
      description,
      files,
    });

    await resource.save();

    res.status(201).json({ message: "Files uploaded to memory & saved in DB", resource });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const viewFile = async (req, res) => {
  try {
    const { id, fileIndex } = req.params;
    const resource = await Resource.findById(id);
    if (!resource) return res.status(404).send("Resource not found");

    const file = resource.files[fileIndex];
    if (!file) return res.status(404).send("File not found");

    res.set("Content-Type", file.mimetype);
    res.send(file.data);
  } catch (error) {
    console.error("Error viewing file:", error);
    res.status(500).send("Error while viewing file");
  }
};


// ✅ Get all resources
const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().select("-files.buffer"); // exclude large buffers
    res.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).send("Error fetching resources");
  }
};

module.exports = { handleUploadResource, viewFile, getAllResources };
