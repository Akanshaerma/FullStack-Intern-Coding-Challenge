const { DataTypes } = require('sequelize');
const sequelize  = require('../config/db');

const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING(400), allowNull: false },
});

module.exports = Store;