const fs = require('fs');
const path = require('path');
const Book = require('./models/Book');

async function importData() {
  try {
    const existingBooks = await Book.findAll();

    if (existingBooks.length === 0) {
      const filePath = path.join(__dirname, 'db', 'books.json');
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      const initialBooks = JSON.parse(jsonData);

      await Book.sync();
      await Book.bulkCreate(initialBooks, { ignoreDuplicates: true });
      console.log('Initial data loaded successfully.');
    } else {
      console.log('The database already contains books. Initial data not loaded.');
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
}

module.exports = importData;
