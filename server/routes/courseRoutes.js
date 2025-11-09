const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 30, // allow up to 30 files total
  },
});

router.post(
  "/courses",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  createCourse
);
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);
router.put(
  "/courses/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateCourse
);
router.delete("/courses/:id", deleteCourse);

module.exports = router;
