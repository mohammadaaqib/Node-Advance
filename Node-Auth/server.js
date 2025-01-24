const express =require  ("express");
require('dotenv').config();
const authRoutes=require("./routes/auth-routes");
const homeRoutes=require("./routes/home-routes");
const adminRoutes=require("./routes/admin-routes");
const uplaodImagesRoutes=require("./routes/imges-routes");


const connectToDB=require("./database/db")


const app=express();
const PORT= process.env.PORT || 3000;

connectToDB();


app.use(express.json());

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/home',homeRoutes);
app.use('/api/v1/admin',adminRoutes)

app.use('/api/v1/image',uplaodImagesRoutes)


app.listen(PORT,()=>{
 console.log('server is now running on port ',PORT)   
})




