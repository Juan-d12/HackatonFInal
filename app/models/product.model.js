const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./index.js');

const productModel = sequelize.define("Product",
    {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        price:{
            type:DataTypes.FLOAT,
            allowNull: false,
        },
        category:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        timestamps:true,
    },
    {
        tableName: 'Products',
    },
);

module.exports = productModel;