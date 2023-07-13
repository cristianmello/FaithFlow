const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection');


const Member = sequelize.define('Member', {
    member_code: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
    },
    member_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            is: {
                args: [/^[a-zñáéíóú\s]+$/i],
                msg: "El nombre solo puede contener letras, acentos, la letra 'ñ' y espacios"
            },
            len: {
                args: [3, 255],
                msg: "El nombre tiene que tener entre 3 y 255 caracteres"
            }
        }
    },
    member_lastname: {
        type: DataTypes.STRING,
        validate: {
            is: {
                args: [/^[a-zñáéíóú\s]+$/i],
                msg: "El apellido solo puede contener letras, acentos, la letra 'ñ' y espacios"
            },
            len: {
                args: [3, 255],
                msg: "El apellido tiene que tener entre 3 y 255 caracteres"
            }
        }
    },
    member_birth: {
        type: DataTypes.DATEONLY,
        validate: {
            isDate: {
                args: true,
                msg: "Ingrese una fecha valida"
            }
        }
    },
    member_mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "El campo no puede ser nulo"
            },
            isEmail: {
                args: true,
                msg: "El campo tiene que ser un correo valido"
            }
        }
    },
    member_telephone: {
        type: DataTypes.STRING,
    },
    member_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    member_image: {
        type: DataTypes.STRING,
        defaultValue: "default.png"
    },
    church_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    timestamps: false,
    defaultScope: {
        attributes: { exclude: ['member_password'] }
    }


});

module.exports = Member;