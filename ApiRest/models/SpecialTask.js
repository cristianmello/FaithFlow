const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const SpecialTask = sequelize.define('SpecialTask', {
    specialtask_code: {
        primaryKey:true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    specialtask_description: {
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
    specialtask_startdate: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: {
                args: true,
                msg: "El campo debe que ser una fecha valida"
            }
        }
    },
    specialtask_finishdate: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: {
                args: true,
                msg: "El campo debe que ser una fecha valida"
            }
        }
    },
    specialtask_starttime: {
        type: DataTypes.TIME,
    },
    specialtask_finishtime: {
        type: DataTypes.TIME,
    }

}, {
    timestamps:false,
});

module.exports = SpecialTask;