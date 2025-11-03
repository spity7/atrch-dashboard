const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
} = require("../controllers/storyController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 30, // allow up to 30 files total
  },
});

router.post(
  "/stories",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 30 },
  ]),
  createStory
);
router.get("/stories", getAllStories);
router.get("/stories/:id", getStoryById);
router.put(
  "/stories/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 30 },
  ]),
  updateStory
);
router.delete("/stories/:id", deleteStory);

module.exports = router;
