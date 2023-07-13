const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const Member = require('../models/Member');
const jwt = require("../services/jwt");
const nodemailer = require('nodemailer');
const Role = require('../models/Role');



const login = async (req, res) => {
    try {

        const { member_mail, member_password } = req.body;

        // Buscar el miembro en la base de datos
        const member = await Member.scope(null).findOne({
            where: {
                member_mail: member_mail
            }
        });

        // Verificar si el usuario existe
        if (!member) {
            return res.status(401).json({ message: 'No existe ese miembro' });
        }

        // Verificar si la contraseña es correcta
        const passwordMatch = await bcrypt.compare(member_password, member.member_password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Conseguir el token con JWT
        const token = jwt.createToken(member)

        // Devolver los datos del usuario y el token
        return res.status(200).send({
            status: "Success",
            message: "Te has identificado correctamente",
            token,
            member: {
                member_code: member.member_code,
                member_name: member.member_name,
                member_lastname: member.member_lastname,
                member_mail: member.member_mail,
                member_telephone: member.member_telephone,
                member_birth: member.member_birth,
                member_image: member.member_image
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al autenticar al usuario' });
    }
}

const logout = async (req, res) => {
    const member_code = req.member.member_code;

    try {
        const member = await Member.findByPk(member_code);

        if (!member) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        // Eliminar token de autenticación del miembro
        res.clearCookie('token');
        await member.save();

        res.json({ message: 'Sesión cerrada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cerrar sesión', error });
    }
}



//Obtener perfil del miembro
const getProfile = async (req, res) => {
    try {
        const member_code = req.member.member_code;
        const member = await Member.findByPk(member_code);

        const roles = await member.getRoles();

        if (!member) {
            return res.status(404).json({ message: 'El miembro no existe' });
        }

        return res.json({ member, roles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al obtener el miembro' });
    }
}

// Listar todos los miembros de una Iglesia
const members = async (req, res) => {
    try {
        // Obtener el código de la iglesia del miembro logueado
        const churchCode = req.member.church_code;

        // Validar que churchCode sea un número válido
        if (isNaN(churchCode)) {
            return res.status(400).json({ message: 'El código de la iglesia debe ser un número válido' });
        }

        const members = await Member.findAll({
            where: {
                church_code: {
                    [Op.eq]: churchCode,
                },
            },
            include: [
                {
                    model: Role,
                    required: false,
                    through: { attributes: [] }
                }
            ],
            order: [['member_name', 'ASC']],
        });

        return res.status(200).json({
            members: members,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error al obtener la lista de miembros' });
    }
};


// Actualizar miembro 
const updateMember = async (req, res) => {

    try {
        // Obtener el miembro a actualizar
        let memberToUpdate = await Member.findOne({
            where: {
                member_code: req.member.member_code,
            },
        });

        if (!memberToUpdate) {
            return res.status(404).json({ error: 'Miembro no encontrado' });
        }

        // Actualizar los atributos
        // Validar que se proporcione una nueva contraseña solo si se requiere
        memberToUpdate.member_name = req.body.member_name || memberToUpdate.member_name;
        memberToUpdate.member_lastname = req.body.member_lastname || memberToUpdate.member_lastname;
        memberToUpdate.member_birth = req.body.member_birth || memberToUpdate.member_birth;
        memberToUpdate.member_mail = req.body.member_mail || memberToUpdate.member_mail;
        memberToUpdate.member_telephone = req.body.member_telephone || memberToUpdate.member_telephone;

        memberToUpdate.member_image = req.body.member_image || memberToUpdate.member_image;
        memberToUpdate.member_password = req.body.member_password || memberToUpdate.member_password;

        if (req.body.member_password) {
            memberToUpdate.member_password = await bcrypt.hash(req.body.member_password, 10);
        }

        // Excluir el atributo church_code
        memberToUpdate.church_code = memberToUpdate.church_code;

        // Guardar los cambios
        await memberToUpdate.save();

        // Devolver la respuesta
        return res.status(200).send({
            status: "success",
            message: 'Miembro actualizado exitosamente',
            member: memberToUpdate
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}

//Obtener todos los miembros de la Iglesia que posean el nombre ingresado
const listMembersByName = async (req, res) => {

    const { church_code } = req.member;
    const { member_name } = req.query;

    // Validar que el parámetro de entrada sea una cadena de texto
    if (typeof member_name !== 'string') {
        return res.status(400).json({ message: 'El parámetro de búsqueda debe ser una cadena de texto' });
    }

    try {
        const members = await Member.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(sequelize.fn('LOWER', sequelize.col('member_name')), 'LIKE', '%' + member_name.toLowerCase() + '%'),
                    { church_code: church_code }
                ]
            },
            attributes: { exclude: ['member_password'] },
        });
        return res.status(200).json({ members });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al buscar los miembros de la iglesia' });
    }
}


//Añadir un nuevo miembro
const register = async (req, res) => {

    const { member_name, member_lastname, member_password, member_mail, member_telephone,
        member_birth, church_code } = req.body;

    const passwordLengthRegex = /^.{8,16}$/;
    const passwordUppercaseRegex = /^(?=.*[A-Z])/;
    const passwordNumberRegex = /^(?=.*\d)/;

    // Verificar si el correo ya está registrado
    const memberExist = await Member.findOne({ where: { member_mail } });
    if (memberExist) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Verificamos que la contraseña cumpla con los requisitos
    let errors = [];
    if (!passwordLengthRegex.test(member_password)) {
        errors.push('La contraseña debe tener entre 8 y 16 caracteres');
    }
    if (!passwordUppercaseRegex.test(member_password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!passwordNumberRegex.test(member_password)) {
        errors.push('La contraseña debe contener al menos un número');
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: 'La contraseña no cumple con los siguientes requisitos:', errors });
    }

    try {
        //Cifrar la contraseña
        const hashedPassword = await bcrypt.hash(member_password, 10);

        // Crear la ruta de la nueva imagen para el usuario
        const newImagePath = path.join(__dirname, `../uploads/avatars/default.png`);

        // Copiar la imagen predeterminada a la nueva ruta
        fs.copyFileSync('./helpers/default.png', newImagePath);

        await Member.create({
            member_name,
            member_lastname,
            member_password: hashedPassword,
            member_mail,
            member_telephone,
            member_birth,
            member_image: "default.png",
            church_code
        });

        // Devolver el miembro creado en la respuesta
        return res.status(200).send({
            status: "Success",
            message: "Te has registrado correctamente",
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el miembro' });
    }

}

// Eliminar miembro
const deleteMember = async (req, res) => {

    try {
        const { member_code } = req.params;

        // Buscar y eliminar la iglesia por su ID
        const member = await Member.findByPk(member_code);
        if (!member_code) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        await member.destroy();
        return res.json({ message: 'Miembro eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar el miembro' });
    }
};

const upload = async (req, res) => {

    try {

        // Recoger el fichero de imagen y comprobar que existe
        if (!req.file) {
            return res.status(404).send({
                status: "error",
                message: "No se ha subido ninguna imagen"
            });
        }

        // Verificar el tamaño del archivo
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (req.file.size > maxSize) {
            return res.status(400).send({
                status: 'error',
                message: 'La imagen es demasiado grande'
            });
        }

        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];

        // Conseguir la extensión del archivo
        const extension = path.extname(req.file.originalname).toLowerCase().substring(1);

        // Comprobar si la extensión es válida
        if (!allowedExtensions.includes(extension)) {
            // Borrar archivo subido
            fs.unlinkSync(req.file.path);

            // Devolver respuesta negativa
            return res.status(400).json({
                status: "error",
                message: "Extensión de archivo inválida. Las extensiones permitidas son " + allowedExtensions.join(", ")
            });
        }

        const member = await Member.findByPk(req.member.member_code);

        // Verificar si el usuario ya tenía una imagen de perfil anterior
        if (member.member_image) {
            // Eliminar la imagen de perfil anterior
            const imagePath = path.join(__dirname, '../uploads/avatars/', member.member_image);
            fs.unlinkSync(imagePath);
        }

        // Si es correcta, guardar imagen en bbdd
        await Member.update({
            member_image: req.file.filename
        }, {
            where: {
                member_code: member.member_code
            }
        });

        const updatedMember = await Member.findByPk(req.member.member_code);

        if (!updatedMember) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontró el usuario'
            });
        }

        // Devolver respuesta exitosa
        return res.status(200).send({
            status: 'success',
            message: 'Imagen de perfil actualizada correctamente',
            member: updatedMember
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar la imagen de perfil'
        });
    }

}

const avatar = (req, res) => {
    //Sacar el parametro de la url
    const file = req.params.file;

    //Montar el path real de la imagen
    const filePath = "./uploads/avatars/" + file;

    //Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        };

        //Devolver el file
        return res.sendFile(path.resolve(filePath));
    });
}

const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Busca al miembro por su dirección de correo electrónico
        const member = await Member.findOne({ where: { member_mail: email } });

        if (!member) {
            return res.status(404).json({ status: 'Error', message: 'Miembro no encontrado' });
        }

        // Genera y establece una nueva contraseña para el miembro
        const newPassword = generateNewPassword();
        member.member_password = await bcrypt.hash(newPassword, 10);;

        await member.save();

        // Envía la nueva contraseña al miembro por correo electrónico
        await sendPasswordResetEmail(email, newPassword);

        // Devuelve una respuesta exitosa
        res.status(200).json({ status: 'Success', message: 'Contraseña reseteada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Error', message: 'Error al resetear la contraseña' });
    }
}

// Función para generar una nueva contraseña aleatoria
function generateNewPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let newPassword = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        newPassword += characters[randomIndex];
    }
    return newPassword;
}

// Función para enviar el correo electrónico de reseteo de contraseña
async function sendPasswordResetEmail(member_mail, newPassword) {
    try {
        // Configura el transporte de correo electrónico
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'mellocristian44@gmail.com', // Reemplaza con tu dirección de correo electrónico
                pass: 'wnesvpsrrhesvxxp' // Reemplaza con tu contraseña de correo electrónico
            },
            secure: true,
        });

        // Configura el contenido del correo electrónico
        const mailOptions = {
            from: 'mellocristian44@gmail.com', // Reemplaza con tu dirección de correo electrónico
            to: member_mail,
            subject: 'Restablecimiento de contraseña',
            text: `Tu nueva contraseña es: ${newPassword}`
        };

        // Envía el correo electrónico
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
        throw new Error('Error al enviar el correo electrónico');
    }
}


module.exports = {
    login, //Loguearse
    logout, //Cerrar sesion
    getProfile, //Obtener datos del usuario
    members, // Obtener todos los miembros de la Iglesia mapeados
    listMembersByName, //Obtener todos los miembros de la Iglesia que concuerden con el nombre buscado
    register, //Registrar miembro nuevo
    updateMember, //Actualizar miembro nuevo
    deleteMember, //Eliminar miembro nuevo
    upload, //Subir imagen de perfil del mimebor a bbdd
    avatar, //Obtener imagen de perfil del miembro
    resetPassword //Resetar password del miembro 
}