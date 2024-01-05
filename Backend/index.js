const express = require('express');
const app = express();
const { createDatabase } = require('./createDataBase');
const { init: sequelizeInit } = require('./config/sequelize-init');
const { applyAssociations } = require('./models/associations');
const cors = require('cors');
const importData = require('./importData');

createDatabase()
  .then(() => sequelizeInit())
  .then(() => {
    // Apply associations
    applyAssociations();
    console.log('prueba')
    // Initial data
    importData();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rutas
    app.use('/api/book', require('./routes/book'));
    app.use('/api/user', require('./routes/user'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server listening in http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Initialization error:', error);
  });
