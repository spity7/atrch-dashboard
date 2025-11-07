const Handiz = require("../models/handizModel");
const { uploadImage, deleteImage } = require("../utils/gcs");

exports.createHandiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const galleryFile = req.files?.gallery?.[0];

    if (!title || !description) {
      return res.status(400).json({
        message: " Title, and description are required",
      });
    }

    if (!thumbnailFile) {
      return res.status(400).json({ message: "Thumbnail image is required." });
    }

    if (!galleryFile) {
      return res.status(400).json({ message: "Gallery image is required." });
    }

    // Upload thumbnail
    const thumbnailFileName = `handiz/thumbnails/${Date.now()}_${
      thumbnailFile.originalname
    }`;
    const thumbnailUrl = await uploadImage(
      thumbnailFile.buffer,
      thumbnailFileName,
      thumbnailFile.mimetype
    );

    // Upload gallery
    const galleryFileName = `handiz/gallery/${Date.now()}_${
      galleryFile.originalname
    }`;
    const galleryUrl = await uploadImage(
      galleryFile.buffer,
      galleryFileName,
      galleryFile.mimetype
    );

    // Save handiz to DB
    const newHandiz = await Handiz.create({
      title,
      description,
      thumbnailUrl,
      galleryUrl,
    });

    res.status(201).json({
      message: "Handiz created successfully",
      handiz: newHandiz,
    });
  } catch (error) {
    console.error("Handiz creation error:", error);
    res.status(500).json({
      message: "Server error creating handiz",
      error: error.message,
    });
  }
};

exports.getAllHandiz = async (req, res) => {
  try {
    const handiz = await Handiz.find().sort({ createdAt: -1 });
    res.status(200).json({ handiz });
  } catch (error) {
    console.error("Error fetching handiz:", error);
    res.status(500).json({ message: "Server error fetching handiz" });
  }
};

exports.getHandizById = async (req, res) => {
  try {
    const handiz = await Handiz.findById(req.params.id);
    if (!handiz) return res.status(404).json({ message: "Handiz not found" });
    res.status(200).json({ handiz });
  } catch (error) {
    console.error("Error fetching handiz:", error);
    res.status(500).json({ message: "Server error fetching handiz" });
  }
};

exports.updateHandiz = async (req, res) => {
  try {
    const { title, description } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const galleryFile = req.files?.gallery?.[0];

    // ✅ Find existing handiz first
    const existingHandiz = await Handiz.findById(req.params.id);
    if (!existingHandiz) {
      return res.status(404).json({ message: "Handiz not found" });
    }

    const updateData = { title, description };

    // ✅ Handle new thumbnail upload
    if (thumbnailFile) {
      // Delete old thumbnail if exists
      if (existingHandiz.thumbnailUrl) {
        try {
          await deleteImage(existingHandiz.thumbnailUrl);
        } catch (err) {
          console.warn("⚠️ Failed to delete old thumbnail:", err.message);
        }
      }

      // Upload new one
      const newThumbnailName = `handiz/thumbnails/${Date.now()}_${
        thumbnailFile.originalname
      }`;
      const newThumbnailUrl = await uploadImage(
        thumbnailFile.buffer,
        newThumbnailName,
        thumbnailFile.mimetype
      );
      updateData.thumbnailUrl = newThumbnailUrl;
    }

    // ✅ Handle new gallery upload
    if (galleryFile) {
      // Delete old gallery if exists
      if (existingHandiz.galleryUrl) {
        try {
          await deleteImage(existingHandiz.galleryUrl);
        } catch (err) {
          console.warn("⚠️ Failed to delete old gallery:", err.message);
        }
      }

      // Upload new one
      const newGalleryName = `handiz/gallery/${Date.now()}_${
        galleryFile.originalname
      }`;
      const newGalleryUrl = await uploadImage(
        galleryFile.buffer,
        newGalleryName,
        galleryFile.mimetype
      );
      updateData.galleryUrl = newGalleryUrl;
    }

    // ✅ Update handiz
    const updatedHandiz = await Handiz.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Handiz updated successfully",
      handiz: updatedHandiz,
    });
  } catch (error) {
    console.error("Error updating handiz:", error);
    res.status(500).json({
      message: "Server error updating handiz",
      error: error.message,
    });
  }
};

exports.deleteHandiz = async (req, res) => {
  try {
    const handiz = await Handiz.findById(req.params.id);
    if (!handiz) return res.status(404).json({ message: "Handiz not found" });

    // Delete thumbnail from GCS
    if (handiz.thumbnailUrl) {
      await deleteImage(handiz.thumbnailUrl);
    }

    // Delete gallery from GCS
    if (handiz.galleryUrl) {
      await deleteImage(handiz.galleryUrl);
    }

    // Delete handiz from MongoDB
    await handiz.deleteOne();

    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting handiz:", error);
    res.status(500).json({ message: "Server error deleting handiz" });
  }
};
