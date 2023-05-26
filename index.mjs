import express from 'express'
import 'dotenv/config'
import usersRoute from './routes/users.mjs'
import booksRoute from './routes/books.mjs'
import authorsRoute from './routes/authors.mjs'
const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(usersRoute)
app.use(booksRoute)
app.use(authorsRoute)

app.get('/', (req, res) => {
    res.status(200).send('Home')
});

const PORT = 3005
app.listen(PORT, () => console.log(`http://localhost:${PORT}`))