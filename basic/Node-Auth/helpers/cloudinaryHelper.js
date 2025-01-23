const cloudinary = require('../config/cloudinary');


// Upload image to Cloudinary
const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        //console.log(result)
        return {url:result.secure_url,
            publicId:result. public_id
        };
    } catch (error) {
        throw new Error('Image upload failed');
    }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error('Image deletion failed');
    }
};

module.exports = {
    uploadImage,
    deleteImage
};