const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const Task = sequelize.define('Task', {
    task_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    task_title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            len: {
                args: [1, 100],
                msg: "El titulo de la tarea debe tener entre 1 y 100 caracteres"
            }
        }
    },
    task_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [1, 700],
                msg: "El contenido de la tarea de tener maximo 700 caracteres"
            }
        }
    }
}, {
    timestamps: false,
});

module.exports = Task;
