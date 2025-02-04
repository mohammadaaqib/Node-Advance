const Media =require('../models/Media');
const logger= require('../utils/logger');;
const {uploadMediaToCloudinary}=require('../utils/cloudinary');

const uploadMedia= async (req,res)=>{
    logger.info("Contrpller upload Media hit");
    try {
        
        if(!req.file){
            logger.warn("File does not exist for upload")
            return req.status(400).json({
                success:false,
                message:"File does not exist for upload"
            })
        }
        
        const {orignalName,mimetype,buffer}=req.file;;
        logger.info("File detail",orignalName,"mimeType",mimetype);
        
        const cloudinaryResponse=await uploadMediaToCloudinary(req.file);
        
        const newfile=new Media({
            orignalName:orignalName,
            mimeType:mimetype,
            publicId:cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
            user:req.userId
        });
        
        await  newfile.save();
        
        res.status(200).json({
            success:true,
            mediaId:newfile._id,
            url:newfile.url,
            message:"Media upload successfully"
        })
        
    } catch (error) {
        logger.error("Error uploading media ", error);
        res.status(500).json({
          success: false,
          message: "Error uploading media ",
        });
    }
    }

    module.exports={uploadMedia}
