const { uploadImage, deleteImage } = require("../helpers/cloudinaryHelper");
const Image = require("../models/Image");
const fs = require("fs");

const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        message: "file is required",
      });
    }
    const { url, publicId } = await uploadImage(req.file.path);
    const newImage = Image({
      url,
      publicId,
      uploadedBy: req.user.userId,
    });
    const image = await newImage.save();
    fs.unlinkSync(req.file.path); // remove images from directory
    res.status(200).json({
      message: "Image uploaded successfully",
      image,
    });
  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const images = await Image.find({});
    if (images) {
      res.status(200).json({
        sucsess: true,
        images,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Some thing went wrong",
      error: error.message,
    });
  }
};

const deleteImagesController = async (req, res) => {
  try {
    const getImagetobeDeleted = req.params.id;
    const userId = req.user.userId;

    const images = await Image.findById(getImagetobeDeleted);
    if (!images) {
      res.status(404).json({
        message: "Image is not found",
      });
    }
    if (images.uploadedBy.toString() !== userId) {
      res.status(403).json({
        message: "You are not Authorize to delete this image",
      });
    }

    const result = await deleteImage(images.publicId);
    console.log(result);
    const deletedImg = await Image.findByIdAndDelete(getImagetobeDeleted )

    res.status(200).json({
      sucsess: true,
      deletedImg,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some thing went wrong",
      error: error.message,
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImagesController,
};
