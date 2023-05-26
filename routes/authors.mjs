import express from 'express';
import isLoggedin from '../utils/is-loggedin.mjs';
import { genValidator } from '../utils/gen-validator.mjs'
import { authorsCreateSchema } from '../schema/schema.mjs'
import {
    addAuthor,
    deleteAuthor,
    getAuthor,
    getAuthors,
    updateAuthor
} from '../controllers/authors.mjs';
import { isAdmin } from '../utils/isAdmin.mjs';

const authorValid = genValidator(authorsCreateSchema, '/authors ')
const router = express.Router();


router.post('/authors', authorValid, isLoggedin, isAdmin, addAuthor)
router.get('/authors/:id', isLoggedin, getAuthor)
router.get('/authors', isLoggedin, getAuthors)
router.put('/authors/:id', authorValid, isLoggedin, isAdmin, updateAuthor)
router.delete('/authors/:id', isLoggedin, isAdmin, deleteAuthor)


export default router;
