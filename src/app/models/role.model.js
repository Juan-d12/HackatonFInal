const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./index.js');

const roleModel = sequelize.define("Role",
    {
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'Roles',
    },
);

module.exports = roleModel;