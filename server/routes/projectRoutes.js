const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 30, // allow up to 30 files total
  },
});

router.post(
  "/projects",
  upload.array("image", 50), // ✅ accept up to 50 images
  createProject
);
router.get("/projects", getAllProjects);
router.get("/projects/:id", getProjectById);
router.put(
  "/projects/:id",
  upload.fields([{ name: "image", maxCount: 1 }]),
  updateProject
);
router.delete("/projects/:id", deleteProject);

module.exports = router;
