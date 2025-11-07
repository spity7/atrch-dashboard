const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createHandiz,
  getAllHandiz,
  getHandizById,
  updateHandiz,
  deleteHandiz,
} = require("../controllers/handizController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 30, // allow up to 30 files total
  },
});

router.post(
  "/handiz",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 1 },
  ]),
  createHandiz
);
router.get("/handiz", getAllHandiz);
router.get("/handiz/:id", getHandizById);
router.put(
  "/handiz/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 1 },
  ]),
  updateHandiz
);
router.delete("/handiz/:id", deleteHandiz);

module.exports = router;
