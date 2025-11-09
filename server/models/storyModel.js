const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Story title is required"],
      trim: true,
    },
    pOne: {
      type: String,
      required: [true, "Paragraph one is required"],
      trim: true,
    },
    pTwo: {
      type: String,
      required: [true, "Paragraph two is required"],
      trim: true,
    },
    pThree: {
      type: String,
      required: [true, "Paragraph three is required"],
      trim: true,
    },
    pFour: {
      type: String,
      required: [true, "Paragraph four is required"],
      trim: true,
    },
    pFive: {
      type: String,
      required: [true, "Paragraph five is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Story description is required"],
    },
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail image URL is required"],
    },
    galleryUrl: {
      type: String,
      required: [true, "Gallery image URL is required"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Story", storySchema);
