const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB per file
    files: 30, // allow up to 30 files total
  },
});

router.post(
  "/contacts",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  createContact
);
router.get("/contacts", getAllContacts);
router.get("/contacts/:id", getContactById);
router.put(
  "/contacts/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateContact
);
router.delete("/contacts/:id", deleteContact);

module.exports = router;
