const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const Answer = sequelize.define('Answer', {
    answer_code: {
        primaryKey:true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    answer_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            len: {
                args: [3, 700],
                msg: "El contenido debe tener maximo 700 caracteres"
            }
        }
    },
    answer_correct: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    timestamps:false,
});

module.exports = Answer;
