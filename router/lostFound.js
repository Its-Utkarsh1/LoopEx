const express = require("express");
const router = express.Router();
const { handleGetAllItems, handleLostItem, handleDeleteItem } = require("../controller/lostFound");
const { checkForAuthentication } = require("../middlewares/auth");

// --- Routes ---
router.get("/getItem", handleGetAllItems);
router.post("/report", handleLostItem);
router.delete("/:id", checkForAuthentication,  handleDeleteItem);

module.exports = router;
