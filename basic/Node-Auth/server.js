const express =require  ("express");
require('dotenv').config();


const connectToDB=require("./database/db")


const app=express();
const PORT= process.env.PORT|| 3000;

connectToDB();


app.use(express.json());


app.listen(PORT,()=>{
 console.log('server is now running on port ',PORT)   
})




