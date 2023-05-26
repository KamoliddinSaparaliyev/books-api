import db from '../db/index.mjs';
import { randomUUID } from 'crypto';

export const addAuthor = async (req, res, next) => {
    const { name } = req.body
    try {
        await db.read()
        const author = db.data.authors.find(a => a.name === name)
        if (author) {
            return res.status(401).json({ message: "Author already exist" })
        }
        db.data.authors.push({
            id: randomUUID(),
            name
        })
        await db.write()

        res.status(200).json({ message: 'Author craeted' })

    } catch (error) {
        next(error)
    }
}
export const getAuthor = async (req, res, next) => {
    const id = req.params.id
    try {
        await db.read()
        const author = db.data.authors.find(a => a.id === id)
        if (!author) {
            return res.send(401).json({ message: "Not have this author" })
        }
        const countBooks = db.data.books.filter(b => b.authorId === id).length + 1
        await db.write()

        res.status(200).json({
            id,
            name: author.name,
            countBooks
        })

    } catch (error) {
        next(error)
    }
}
export const getAuthors = async (req, res, next) => {
    try {
        db.read()
        res.status(200).json({
            authors: db.data.authors
        })
        db.write()
    } catch (error) {
        next(error)
    }
}
export const updateAuthor = async (req, res, next) => {
    const { name } = req.body
    const id = req.params.id
    try {
        await db.read()
        const author = db.data.authors.find(a => a.id === id)

        if (!author) {
            return res.send(401).json({ message: "Not have this author" })
        }
        const authorIndex = db.data.authors.indexOf(author)
        db.data.authors.splice(authorIndex, 1, { id, name })

        res.status(200).json({ message: "Author updated" })
        await db.write()
    } catch (error) {
        next(error)
    }
}
export const deleteAuthor = async (req, res, next) => {
    const id = req.params.id
    try {
        await db.read()
        const author = db.data.authors.find(a => a.id === id)

        if (!author) {
            return res.send(401).json({ message: "Not have this author" })
        }

        const countBooks = db.data.books.filter(b => b.authorId === id)
        if (!countBooks.length) {
            return res.send(401).json({ message: "Have not books" })
        }
        const authorIndex = db.data.authors.indexOf(author)
        db.data.authors.splice(authorIndex, 1)

        res.status(200).json({ message: "Author deleted" })
        db.write()
    } catch (error) {
        next(error)
    }
}