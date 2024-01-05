// sequelize-config.js
const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    database: 'bytech',
    username: 'root',
    password: '',
    host: '127.0.0.1',
    dialect: 'mysql',
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Successful connection with the database');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = sequelize;
