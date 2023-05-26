import express from 'express';
import isLoggedin from '../utils/is-loggedin.mjs';
import { genValidator } from '../utils/gen-validator.mjs'
import { bookSchema } from '../schema/schema.mjs'
import {
    addBook,
    getBooks,
    getBook,
    updateBook, deleteBook
} from '../controllers/books.mjs';
import { isAdmin } from '../utils/isAdmin.mjs'

const booksValid = genValidator(bookSchema, '/books ')
const router = express.Router();


router.post('/books', booksValid, isAdmin, isLoggedin, addBook)
router.get('/books', isLoggedin, getBooks)
router.get('/books/:id', isLoggedin, getBook)
router.put('/books/:id', isLoggedin, isAdmin, booksValid, updateBook)
router.delete('/books/:id', isLoggedin, isAdmin, deleteBook)



export default router;
