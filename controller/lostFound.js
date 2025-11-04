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

    const newItem = new LostFound({
      type,
      category,
      title,
      description,
      location,
      date,
      contact,
      reportedBy: req.user ? req.user._id : null, // optional if using authentication
    });

    await newItem.save();
    res.status(200).json({ message: "Item reported successfully" });
  } catch (err) {
    console.error("Report error:", err);
    res.status(500).json({ error: "Failed to report item" });
  }
};

// ✅ Delete an item (only if user owns it)
const handleDeleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id; // this comes from your auth middleware

    const item = await LostFound.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Only allow the post creator to delete it
    if (item.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await LostFound.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};

module.exports = {
  handleGetAllItems,
  handleLostItem,
  handleDeleteItem,  
};
