const mongoose =require('mongoose');

const ProdcutSchema =  new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
   
    category:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    inStock:{
        type:Boolean,
        required:true
    },


})

module.exports = new mongoose.model('Product',ProdcutSchema)