const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Path apne folder ke hisab se dekh lena

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50] 
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            len: [0, 400]
        }
    },
    role: {
        type: DataTypes.ENUM('normal_user', 'store_owner', 'admin'),
        defaultValue: 'normal_user'
    }
});

module.exports = User;