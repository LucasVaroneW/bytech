// sequelize-init.js
const sequelize = require('./sequelize-config');

async function init(){
    try{
        await sequelize.authenticate();
        console.log('Successful connection with the database');

        await sequelize.sync({alter: true});
        console.log('synchronized models');
    } catch(error){
        console.error('Error connecting and synchronizing database: ', error);
    }
}

module.exports=  { init };