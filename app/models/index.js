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
    ssl: {
      require: true,
      rejectUnauthorized: false   // para que funcione el deploy en render
    }
  }
});

module.exports = sequelize;