import db from '../db/index.mjs';
import { randomUUID } from 'crypto';

export const addBook = async (req, res, next) => {
    const { title, authorId, category } = req.body
    try {
        await db.read()
        const author = db.data.authors.find(a => a.id === authorId)

        if (!author) {
            return res.status(401).json({ message: 'There is no such author' })
        }

        const categoris = ['badiy', 'biznes', 'ilm-fan', 'siyosat', 'boshqa']
        const existingCategory = categoris.find(c => c === category)

        if (!existingCategory) {
            return res.status(401).json({ message: 'There is no such category' })
        }

        db.data.books.push({
            id: randomUUID(),
            title,
            authorId,
            category
        })

        res.status(200).json({ message: 'book added' })

        await db.write()
    } catch (error) {
        next(error)
    }
}

export const getBooks = async (req, res, next) => {
    const { category, authorId } = req.query
    try {
        await db.read()

        const books = db.data.books.filter(book => book.category === category || book.authorId === authorId)

        res.status(200).json({ books })
        await db.write()
    } catch (error) {
        next(error)
    }
}
export const getBook = async (req, res, next) => {
    const id = req.params.id
    try {
        await db.read()
        const book = db.data.books.find(book => book.id === id)
        if (!book) {
            return res.status(401).json({ message: 'There is no such book' })
        }
        const author = db.data.authors.find(author => author.id === book.authorId)

        res.status(200).json({
            book,
            author
        })
        await db.write()
    } catch (error) {
        next(error)
    }
}
export const updateBook = async (req, res, next) => {
    const id = req.params.id
    const { title, authorId, category } = req.body
    try {
        await db.read()
        const book = db.data.books.find(b => b.id === id)

        if (!book) {
            return res.status(401).json({ message: 'There is no such book' })
        }
        const author = db.data.authors.find(a => a.id === authorId)

        if (!author) {
            return res.status(401).json({ message: 'There is no such author' })
        }

        const categoris = ['badiy', 'biznes', 'ilm-fan', 'siyosat', 'boshqa']
        const existingCategory = categoris.find(c => c === category)

        if (!existingCategory) {
            return res.status(401).json({ message: 'There is no such category' })
        }

        const bookIndex = db.data.books.indexOf(book)
        db.data.books.splice(bookIndex, 1, {
            id,
            title,
            authorId,
            category
        })

        res.status(200).json({
            message: 'Book updated'
        })
        await db.write()
    } catch (error) {
        next(error)
    }
}
export const deleteBook = async (req, res, next) => {
    const id = req.params.id
    try {
        await db.read()
        const book = db.data.books.find(b => b.id === id)
        if (!book) {
            return res.status(401).json({ message: 'There is no such book' })
        }

        const bookIndex = db.data.books.indexOf(book)

        db.data.books.splice(bookIndex, 1)
        res.status(200).json({ message: 'Book deleted' })
        await db.write()
    } catch (error) {
        next(error)
    }
}