const mongoose =require("mongoose");
require('dotenv').config();


const connecttoDB= async()=>{
   
     try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Mongo DB is connected successfully")
        } catch (error) {
            console.error("Mongodb connection faild",error);
            process.exit(1)
        }

}

module.exports=connecttoDB;
