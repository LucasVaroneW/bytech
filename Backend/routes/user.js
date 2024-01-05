const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

// GET ALL USERS
router.get('/getUser', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error getting users' });
  }
});

// GET USER FOR ID
router.get('/getUser/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error getting user' });
  }
});

// GET BOOK FOR SPECIFIC USER
router.get('/:userId/allBook', async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findByPk(userId, {
      include: Book,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.Books);
  } catch (error) {
    res.status(500).json({ error: 'Error getting books for user' });
  }
});

// ASIGN A BOOK TO A USER
router.post('/:userId/book/:bookId', async (req, res) => {
  const {userId, bookId} = req.params;
  
  try {
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);
    if (!user || !book) {
      return res.status(404).json({ error: 'User or book not found line 68' });
    }
    if (user.addBook) {
      await user.addBook(book);
      res.json({ message: 'Book assigned to user correctly' });
    } else {
      res.status(500).json({ error: 'addBook function not available on user instance' });
    }
  } catch (error) {
    console.log('el error de consola es: ',error)
    res.status(500).json({ error: 'Error assigning book to user' });
  }
});

// DELETE ASIGN A BOOK TO A USER
router.delete('/delete/:userId/book/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;
  
  try {
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);

    if (!user || !book) {
      return res.status(404).json({ error: 'User or book not found' });
    }
    if (user.removeBook) {
      await user.removeBook(book);
      res.json({ message: 'Book removed from user correctly' });
    } else {
      res.status(500).json({ error: 'removeBook function not available on user instance' });
    }
  } catch (error) {
    console.log('El error de consola es:', error);
    res.status(500).json({ error: 'Error removing book from user' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Passwords do not match' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, secretKey , { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ error: 'Error during login' });
  }
});

router.post('/createUser', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, password: hashedPassword });
    res.json(newUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error creating new user' });
  }
});

module.exports = router;
