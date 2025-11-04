const express = require("express");
const router = express.Router();
const multer = require("multer");
const { handleUploadResource, getAllResources, viewFile } = require("../controller/resource");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB PDF limit
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only PDF or image files allowed"));
  }
});

router.post("/upload", upload.array("files", 5), handleUploadResource);
router.get("/all", getAllResources);
router.get("/view/:id/:fileIndex", viewFile);

module.exports = router;
