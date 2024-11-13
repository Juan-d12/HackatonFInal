const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./index.js');
const roleModel = require('./role.model.js');

const userModel = sequelize.define("User",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type:DataTypes.STRING,
            unique:true,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps:true,
    },
    {
        tableName: 'Users',
    },
);

roleModel.hasMany(userModel);

module.exports = userModel;