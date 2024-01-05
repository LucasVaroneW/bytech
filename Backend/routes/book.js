const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET ALL BOOKS
router.get('/getBook', async(req,res) =>{
    try{
        const books = await Book.findAll();
        res.json(books);
    } catch(error){
        console.error('Error getting books: ', error);
        res.status(500).json({ error: 'Internal error server'});
    }
});

//GET ONE BOOK
router.get('/getBook/:id', async(req, res) => {
    const { id } = req.params;
    try{
        const book = await Book.findByPk(id)
        if(!book){
            return res.status(404).json({error: 'Book not found'})
        };
        res.json(book);
    } catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error getting book' }); 
    }
})

// CREATE NEW BOOK
router.post('/newBook', async(req, res) =>{
    const {title, author, genre} = req.body;

    try{
        const newBook = new Book.create({ title, author, genre});
        res.json(newBook);
    } catch(error){
        console.error('Error when creating a new book: ', error);
        res.status(500).json({error: 'Internal error server'})
    }
});

// UPDATE A BOOK
router.put('/updateBook/:id', async(req, res) => {
    const { id } = req.params;
    const { title, author, genre } = req.body;

    try {
        const updatedBook = await Book.update({ title, author, genre }, { where: { id } });
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book: ', error);
        res.status(500).json({ error: 'Internal error server' });
    }
});

// DELETE A BOOK
router.delete('deleteBook/:id', async(req, res) => {
    const { id } = req.body;

    try{
        await Book.destroy({ where: { id } });
        res.json({ message: 'Book deleted correctly' });
    } catch(error) {
        console.error('Error deleting book: ', error);
        res.status(500).json({ error: 'Internal error server' });
    }
});

module.exports = router;