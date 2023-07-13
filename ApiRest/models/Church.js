const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');

const Church = sequelize.define('Church', {
    church_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    church_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "El nombre de la iglesia ya está en uso"
        },
        validate: {
            notNull: {
                msg: "El campo no debe ser nulo"
            },
            len: {
                args: [1, 100],
                msg: "El nombre de la iglesia debe tener entre 1 y 100 caracteres"
            }
        }
    },
    church_department: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    church_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    church_description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    church_telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isNumeric: {
                msg: "El teléfono de la iglesia debe ser numérico"
            }
        }
    },
    church_income: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                min: 0,
                msg: "El ingreso de la iglesia debe ser un número mayor o igual a cero"
            }
        }
    },
    church_totalTreasuries: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: {
                min: 0,
                msg: "El saldo de la Iglesia no puede ser menor a 0"
            }
        }
    },
}, {
    timestamps: false,
});

module.exports = Church;