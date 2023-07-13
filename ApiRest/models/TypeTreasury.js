const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const TypeTreasury = sequelize.define('TypeTreasury', {
    TypeTreasury_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    TypeTreasury_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isNumeric: {
                args: true,
                msg: "El campo tiene que ser un número"
            },
            isIn: {
                args: [[1, 2]],
                msg: "El valor debe ser 1 para entrada de dinero o 2 para salida de dinero"

            }
        }
    },
    TypeTreasury_title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 100],
                msg: "El campo tiene que tener entre 3 y 100 caracteres"
            }
        }
    },
    TypeTreasury_description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: {
                args: [3, 250],
                msg: "El campo tiene que tener entre 3 y 250 caracteres"
            }
        }
    },
    church_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = TypeTreasury;
