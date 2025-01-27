require('dotenv').config();
const express=require("express");
const {configureCors}=require('./corsConfig')

const PORT=process.env.PORT || 3000
const app=express();

app.use(express.json());
app.use(configureCors);
app.listen(PORT,()=>{
console.log("server is listing on ",PORT)
})