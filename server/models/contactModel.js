const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail image URL is required"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

module.exports = mongoose.model("Contact", contactSchema);
