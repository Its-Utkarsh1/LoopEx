const express = require("express");
const router = express.Router();
const path = require("path");
const { handleGetAllItems, handleLostItem, handleDeleteItem } = require("../controller/lostFound");
const authMiddleware = require("../middleware/auth");

// --- Routes ---
router.get("/getItem", handleGetAllItems);
router.post("/report", handleLostItem);
router.delete("/:id",authMiddleware,  handleDeleteItem);

module.exports = router;
