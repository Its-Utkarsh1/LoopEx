const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { handleGetAllItems, handleLostItem } = require("../controller/lostFound");

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- Routes ---
router.get("/getItem", handleGetAllItems);
router.post("/report", upload.single("image"), handleLostItem);

module.exports = router;
