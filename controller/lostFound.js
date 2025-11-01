const LostFound = require("../models/LostFound");

// GET all lost/found items
const handleGetAllItems = async (req, res) => {
  try {
    const items = await LostFound.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Cannot fetch items" });
  }
};

// POST a new lost/found item
const handleLostItem = async (req, res) => {
  try {
    const { type, category, title, description, location, date, contact } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new LostFound({
      type,
      category,
      title,
      description,
      location,
      date,
      contact,
      imageUrl,
      reportedBy: req.user ? req.user._id : null, // optional if using authentication
    });

    await newItem.save();
    res.status(200).json({ message: "Item reported successfully" });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Failed to report item" });
  }
};

module.exports = {
  handleGetAllItems,
  handleLostItem,
};
