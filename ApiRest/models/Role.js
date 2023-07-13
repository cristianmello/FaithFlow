const { DataTypes, Model } = require("sequelize");
const sequelize = require('../database/connection');


const Role = sequelize.define('Role', {
    role_code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isAlpha: {
                args: true,
                msg: "El campo solo puede contener letras"
            },
            len: {
                args: [3, 255],
                msg: "El campo tiene que tener entre 3 y 255 caracteres"
            }
        }
    },
    role_description: {
        type: DataTypes.STRING,
    }

}, {
    timestamps: false,
});

module.exports = Role;
