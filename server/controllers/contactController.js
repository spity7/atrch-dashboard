const Contact = require("../models/contactModel");
const { uploadImage, deleteImage } = require("../utils/gcs");

exports.createContact = async (req, res) => {
  try {
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!thumbnailFile) {
      return res.status(400).json({ message: "Thumbnail image is required." });
    }

    // Upload thumbnail
    const thumbnailFileName = `contacts/thumbnails/${Date.now()}_${
      thumbnailFile.originalname
    }`;
    const thumbnailUrl = await uploadImage(
      thumbnailFile.buffer,
      thumbnailFileName,
      thumbnailFile.mimetype
    );

    // Save contact to DB
    const newContact = await Contact.create({
      thumbnailUrl,
    });

    res.status(201).json({
      message: "Contact created successfully",
      contact: newContact,
    });
  } catch (error) {
    console.error("Contact creation error:", error);
    res.status(500).json({
      message: "Server error creating contact",
      error: error.message,
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Server error fetching contacts" });
  }
};

exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.status(200).json({ contact });
  } catch (error) {
    console.error("Error fetching contact:", error);
    res.status(500).json({ message: "Server error fetching contact" });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const thumbnailFile = req.files?.thumbnail?.[0];

    // ✅ Find existing contact first
    const existingContact = await Contact.findById(req.params.id);
    if (!existingContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const updateData = {};

    // ✅ Handle new thumbnail upload
    if (thumbnailFile) {
      // Delete old thumbnail if exists
      if (existingContact.thumbnailUrl) {
        try {
          await deleteImage(existingContact.thumbnailUrl);
        } catch (err) {
          console.warn("⚠️ Failed to delete old thumbnail:", err.message);
        }
      }

      // Upload new one
      const newThumbnailName = `contacts/thumbnails/${Date.now()}_${
        thumbnailFile.originalname
      }`;
      const newThumbnailUrl = await uploadImage(
        thumbnailFile.buffer,
        newThumbnailName,
        thumbnailFile.mimetype
      );
      updateData.thumbnailUrl = newThumbnailUrl;
    }

    // ✅ Update contact
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({
      message: "Server error updating contact",
      error: error.message,
    });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });

    // Delete thumbnail from GCS
    if (contact.thumbnailUrl) {
      await deleteImage(contact.thumbnailUrl);
    }

    // Delete contact from MongoDB
    await contact.deleteOne();

    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ message: "Server error deleting contact" });
  }
};
