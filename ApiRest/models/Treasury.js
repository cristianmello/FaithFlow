const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');

const Treasury = sequelize.define('Treasury', {
    activity_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    activity_value: {
        type: DataTypes.DECIMAL,
        validate: {
            isDecimal: {
                args: true,
                msg: "El campo tiene que ser un número"
            }
        }

    },
    activity_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [3, 255],
                msg: "El campo tiene que tener entre 3 y 255 caracteres"
            }
        }
    },
    activity_date: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: {
                args: true,
                msg: "Ingrese una fecha valida"
            }
        }
    },
    TypeTreasury_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = Treasury;
