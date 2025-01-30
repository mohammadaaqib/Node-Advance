const mongoose=require('mongoose');


const refreshTokenSchema=new mongoose.Schema({
    token:{
        type:String,
        require:true,
        unique:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    expireAt:{
        type:Date,
        require:true
    }
},{timestamps:true});

refreshTokenSchema.index({expireAt:1},{expireAfterSecond:0})

module.exports=mongoose.model('RefreshToken',refreshTokenSchema)