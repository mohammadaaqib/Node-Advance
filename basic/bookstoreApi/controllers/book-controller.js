const book = require("../models/books");

// Get all books
const getAllBooks = async (req, res) => {

   
    try {
        const allBooks = await book.find();
        if(allBooks){
            res.status(200).json({
                success:true,
                count:allBooks.length,
                data:allBooks
            })
        }
       
    } catch (error) {
        console.log(error)
    }
   
};

// Get a single book by ID
const getBookById = async (req, res) => {
    try {
        const bookOne = await book.findOne({_id:req.params.id});
        if(bookOne){
            res.status(200).json({
                success:true,
                data:bookOne
            })
        }
        else{
            res.status(404).json({
                success:false,
                message:"book is not found"
            })  
        }
       
    } catch (error) {
        console.log(error)
    }
};

// Create a new book
const createBook = async (req, res) => {
    try {
        const createBookObj=req.body;
        const newBook= await book.create(createBookObj);
        if(newBook){
            res.status(200).json({
                success:true,
                message:"Book added successfully",
                data:newBook
            })
        }
       
    } catch (error) {
        console.log(error)
    }
   
};

// Update a book by ID
const updateBook = async (req, res) => {
   
    try {
        const bookOne = await book.findOneAndUpdate({_id:req.params.id},req.body,{new: true});
        if(bookOne){
            res.status(200).json({
                success:true,
                data:bookOne
            })
        }
        else{
            res.status(404).json({
                success:false,
                message:"book is not found"
            })  
        }
       
    } catch (error) {
        console.log(error)
    }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
    try {
        const bookOne = await book.findOneAndDelete({_id:req.params.id});
        if(bookOne){
            res.status(200).json({
                success:true,
                data:bookOne
            })
        }
        else{
            res.status(404).json({
                success:false,
                message:"book is not found"
            })  
        }
       
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};