const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./index.js');
const userModel = require('./user.model.js');
const productModel = require('./product.model.js');

const cartModel = sequelize.define("Cart",
    {
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps:true,
    },
    {
        tableName: 'Carts',
    },
);

userModel.hasMany(cartModel);
productModel.hasMany(cartModel);

module.exports = cartModel;