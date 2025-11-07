const mongoose = require("mongoose");

const handizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Handiz title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Handiz description is required"],
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

module.exports = mongoose.model("Handiz", handizSchema);
