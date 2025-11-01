const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploads");
const { handleUploadResource } = require("../controller/resource");
const path = require("path");  
const Resource = require("../models/Resource");


router.post("/upload", upload.array("files", 5), handleUploadResource);

router.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;

  const filePath = path.join(__dirname, "..", "uploads", filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Download error:", err);
      res.status(404).send("File not found");
    }
  });
});

module.exports = router;
