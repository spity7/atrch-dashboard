const Story = require("../models/storyModel");
const { uploadImage, deleteImage } = require("../utils/gcs");

exports.createStory = async (req, res) => {
  try {
    const { title, description, pOne, pTwo, pThree, pFour, pFive } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const galleryFile = req.files?.gallery?.[0];

    if (
      !title ||
      !description ||
      !pOne ||
      !pTwo ||
      !pThree ||
      !pFour ||
      !pFive
    ) {
      return res.status(400).json({
        message: " Title, p1, p2, p3, p4, p5, and description are required",
      });
    }

    if (!thumbnailFile) {
      return res.status(400).json({ message: "Thumbnail image is required." });
    }

    if (!galleryFile) {
      return res.status(400).json({ message: "Gallery image is required." });
    }

    // Upload thumbnail
    const thumbnailFileName = `stories/thumbnails/${Date.now()}_${
      thumbnailFile.originalname
    }`;
    const thumbnailUrl = await uploadImage(
      thumbnailFile.buffer,
      thumbnailFileName,
      thumbnailFile.mimetype
    );

    // Upload gallery
    const galleryFileName = `stories/gallery/${Date.now()}_${
      galleryFile.originalname
    }`;
    const galleryUrl = await uploadImage(
      galleryFile.buffer,
      galleryFileName,
      galleryFile.mimetype
    );

    // Save story to DB
    const newStory = await Story.create({
      title,
      pOne,
      pTwo,
      pThree,
      pFour,
      pFive,
      description,
      thumbnailUrl,
      galleryUrl,
    });

    res.status(201).json({
      message: "Story created successfully",
      story: newStory,
    });
  } catch (error) {
    console.error("Story creation error:", error);
    res.status(500).json({
      message: "Server error creating story",
      error: error.message,
    });
  }
};

exports.getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.status(200).json({ stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error fetching stories" });
  }
};

exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.status(200).json({ story });
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ message: "Server error fetching story" });
  }
};

exports.updateStory = async (req, res) => {
  try {
    const { title, pOne, pTwo, pThree, pFour, pFive, description } = req.body;
    const thumbnailFile = req.files?.thumbnail?.[0];
    const galleryFile = req.files?.gallery?.[0];

    // ✅ Find existing story first
    const existingStory = await Story.findById(req.params.id);
    if (!existingStory) {
      return res.status(404).json({ message: "Story not found" });
    }

    const updateData = { title, pOne, pTwo, pThree, pFour, pFive, description };

    // ✅ Handle new thumbnail upload
    if (thumbnailFile) {
      // Delete old thumbnail if exists
      if (existingStory.thumbnailUrl) {
        try {
          await deleteImage(existingStory.thumbnailUrl);
        } catch (err) {
          console.warn("⚠️ Failed to delete old thumbnail:", err.message);
        }
      }

      // Upload new one
      const newThumbnailName = `stories/thumbnails/${Date.now()}_${
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
      if (existingStory.galleryUrl) {
        try {
          await deleteImage(existingStory.galleryUrl);
        } catch (err) {
          console.warn("⚠️ Failed to delete old gallery:", err.message);
        }
      }

      // Upload new one
      const newGalleryName = `stories/gallery/${Date.now()}_${
        galleryFile.originalname
      }`;
      const newGalleryUrl = await uploadImage(
        galleryFile.buffer,
        newGalleryName,
        galleryFile.mimetype
      );
      updateData.galleryUrl = newGalleryUrl;
    }

    // ✅ Update story
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Story updated successfully",
      story: updatedStory,
    });
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({
      message: "Server error updating story",
      error: error.message,
    });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });

    // Delete thumbnail from GCS
    if (story.thumbnailUrl) {
      await deleteImage(story.thumbnailUrl);
    }

    // Delete gallery from GCS
    if (story.galleryUrl) {
      await deleteImage(story.galleryUrl);
    }

    // Delete story from MongoDB
    await story.deleteOne();

    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Server error deleting story" });
  }
};
