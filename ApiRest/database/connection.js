const { Sequelize } = require('sequelize');

const database = new Sequelize('iglesia', 'root', 'root12', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = database;