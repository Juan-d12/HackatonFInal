const { Sequelize } = require("sequelize");

// Passing parameters separately
const sequelize = new Sequelize(  
  process.env.DB_DB, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect:'postgres',
  dialectOptions: {
    ssl: process.env.DB_SSL == "true"
  }
});

module.exports = sequelize;