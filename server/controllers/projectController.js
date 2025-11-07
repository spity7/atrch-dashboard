const Project = require("../models/projectModel");
const { uploadImage, deleteImage } = require("../utils/gcs");

exports.createProject = async (req, res) => {
  try {
    const imageFiles = req.files;

    if (!imageFiles || imageFiles.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    let createdProjects = [];

    for (const imageFile of imageFiles) {
      const imageFileName = `projects/images/${Date.now()}_${
        imageFile.originalname
      }`;

      const imageUrl = await uploadImage(
        imageFile.buffer,
        imageFileName,
        imageFile.mimetype
      );

      const project = await Project.create({
        imageUrl,
      });

      createdProjects.push(project);
    }

    res.status(201).json({
      message: "Projects created successfully",
      projects: createdProjects,
    });
  } catch (error) {
    console.error("Project creation error:", error);
    res.status(500).json({
      message: "Server error creating project",
      error: error.message,
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error fetching projects" });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error fetching project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { order } = req.body;
    const imageFile = req.files?.image?.[0];

    // ✅ Find existing project first
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updateData = { order };

    // ✅ Handle new image upload
    if (imageFile) {
      // Delete old image if exists
      if (existingProject.imageUrl) {
        try {
          await deleteImage(existingProject.imageUrl);
        } catch (err) {
          console.warn("⚠️ Failed to delete old image:", err.message);
        }
      }

      // Upload new one
      const newImageName = `projects/images/${Date.now()}_${
        imageFile.originalname
      }`;
      const newImageUrl = await uploadImage(
        imageFile.buffer,
        newImageName,
        imageFile.mimetype
      );
      updateData.imageUrl = newImageUrl;
    }

    // ✅ Update project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      message: "Server error updating project",
      error: error.message,
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Delete image from GCS
    if (project.imageUrl) {
      await deleteImage(project.imageUrl);
    }

    // Delete project from MongoDB
    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Server error deleting project" });
  }
};
