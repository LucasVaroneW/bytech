const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    database: '',
    username: 'root',
    password: '',
    host: '127.0.0.1',
    dialect: 'mysql',
});

async function createDatabase() {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS bytech;`);
        console.log('Database "bytech" created or already exists.');

        sequelize.config.database = 'bytech';
        await sequelize.sync();

        console.log('Models synchronized with the database.');
    } catch (error) {
        console.error('Error creating the database or synchronizing models:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

module.exports = { createDatabase };
