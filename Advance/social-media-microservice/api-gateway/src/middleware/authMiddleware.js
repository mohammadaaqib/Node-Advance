const logger=require("../utils/logger");

const jwt=require('jsonwebtoken');


const validateUser=(req,res,next)=>{
logger.info( req.headers["authorization"].split(" ")[1])
    const token = req.headers["authorization"].split(" ")[1];
    if(!token){
        logger.warn("Authorization fail");
        res.status(429).json({
            success:false,
            message:"Authorization fail"
        })
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err){
            logger.warn("Authorization fail from JWT",err);
            res.status(429).json({
                success:false,
                message:"Authorization fail"
            })
        }

        req.user=user;
    })
    next();
}

module.exports={validateUser}