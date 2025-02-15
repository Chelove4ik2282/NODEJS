const express = require('express');
const Book = require('../models/Book');
const Author = require('../models/author');
const router = express.Router();

/**
 * @swagger
 * /api/authors:
 *   post:
 *     summary: Create a new author
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Author created
 *       400:
 *         description: Bad request
 */
router.post('/authors', async (req, res) => {
  const { name, bio } = req.body;
  try {
    const author = new Author({ name, bio });
    await author.save();
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: number
 *               authorId:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Bad request
 *       404:
 *         description: Author not found
 */
router.post('/books', async (req, res) => {
  const { title, year, authorId } = req.body;
  try {
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    const book = new Book({ title, year, author: authorId });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: A list of books
 *       400:
 *         description: Bad request
 */
router.get('/books', async (req, res) => {
  try {
    const books = await Book.find().populate('author');
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "cannot find" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: number
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Bad request
 */
router.post("/", async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               year:
 *                 type: number
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated book
 *       404:
 *         description: Book not found
 *       400:
 *         description: Bad request
 */
router.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBook) return res.status(404).json({ message: "cannot find" });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "cannot find" });
    res.json({ message: "was deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
