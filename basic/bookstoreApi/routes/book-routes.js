const express = require('express');
const { getAllBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/book-controller');

const router = express.Router();

// Controller functions (you need to implement these)

// Routes
router.get('/', getAllBooks).get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;