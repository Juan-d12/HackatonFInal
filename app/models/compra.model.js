const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('./index.js');
const userModel = require('./user.model.js');
const productModel = require('./product.model.js');

const compraModel = sequelize.define("Compra",
    {
        quantity:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            defaultValue: 'Pendiente de envio',
            allowNull: false,
        },
    },
    {
        timestamps:true,
    },
    {
        tableName: 'Compras',
    },
);

userModel.hasMany(compraModel);
productModel.hasMany(compraModel);

module.exports = compraModel;