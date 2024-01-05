// associations.js
const User = require('./User');
const Book = require('./Book');
const UserBook = require('./User_Book');

function applyAssociations() {
  User.belongsToMany(Book, {
    through: UserBook,
    foreignKey: 'userId',
  });

  Book.belongsToMany(User, {
    through: UserBook,
    foreignKey: 'bookId',
  });
}

module.exports = { applyAssociations };
