const Media =require('../models/Media');
const logger= require('../utils/logger');
const {deleteMediaFromCloudinary} =require('../utils/cloudinary');

const handlePostDeleted =async (event)=>{
    console.log(event,"event for del post");
    const {postId,mediaIds}=event
    try {
      const mediaToDelete =await Media.find({_id:{$in:mediaIds}}) ;
      
      for(const media of mediaToDelete){
        await deleteMediaFromCloudinary(media.publicId);
        await Media.findByIdAndDelete(media._id);
        logger.info("Delete media from cloudinary and db")
      }
      
      
    } catch (error) {
       logger.error("Error while delteing post ")
    }
}

module.exports={handlePostDeleted}