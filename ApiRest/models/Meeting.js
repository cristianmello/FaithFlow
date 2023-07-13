const { DataTypes, Model } = require("sequelize");
const sequelize = require('../database/connection');


const Meeting = sequelize.define('Meeting', {
    meeting_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    meeting_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            len: {
                args: [1, 100],
                msg: "Elcampo debe tener entre 1 y 100 caracteres"
            }
        }
    },
    meeting_data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isDate: {
                args: true,
                msg: "El campo debe que ser una fecha valida"
            }
        }
    },
    meeting_starttime: {
        type: DataTypes.TIME,
    },
    meeting_finishtime: {
        type: DataTypes.TIME,
    }

}, {
    timestamps: false,
});

module.exports = Meeting;
