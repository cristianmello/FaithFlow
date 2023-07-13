const { DataTypes } = require("sequelize");
const sequelize = require('../database/connection');


const Question = sequelize.define('Question', {
    question_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    question_description: {
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
    }
}, {
    timestamps: false,
});

module.exports = Question;
