// userBook.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize-config');

const UserBook = sequelize.define('UserBook', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = UserBook;
