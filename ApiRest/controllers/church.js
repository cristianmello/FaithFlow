const { Op } = require('sequelize');
const Church = require('../models/Church');
const Role = require('../models/Role');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');


//Obtener todas las Iglesias por departamento
const getChurchsForDepartment = async (req, res) => {
    try {
        const church_department_param = req.params.church_department;

        const churches = await Church.findAll({
            where: {
                church_department: {
                    [Op.eq]: church_department_param,
                }
            }
        });

        if (churches.length === 0) { // Check if churches is empty
            return res.status(404).json({ message: 'No existen Iglesias registradas en este departamento.' });
        }

        return res.status(200).json({
            churches,
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las iglesias' });
    }
};



const getChurch = async (req, res) => {
    try {
        const church_code = req.member.church_code;

        const church = await Church.findOne({
            where: {
                church_code: church_code
            }
        });

        if (!church) {
            return res.status(404).json({ message: 'La Iglesia no se encuentra' });
        }

        return res.json(church);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la iglesia' });
    }
};



const churchRegister = async (req, res) => {
    const {
        church_name,
        church_address,
        church_department,
        church_description,
        church_telephone,
        church_income,
        church_totalTreasuries,
        member_name,
        member_lastname,
        member_birth,
        member_mail,
        member_telephone,
        member_password,
    } = req.body;

    let createdChurch;

    try {
        const church = await Church.create({
            church_name: church_name,
            church_department: church_department,
            church_address: church_address,
            church_description: church_description,
            church_telephone: church_telephone,
            church_income: church_income,
            church_totalTreasuries: church_totalTreasuries
        });

        createdChurch = church;

        const hashedPassword = await bcrypt.hash(member_password, 10);

        // Crear la ruta de la nueva imagen para el usuario
        const newImagePath = path.join(__dirname, `../uploads/avatars/default.png`);

        // Copiar la imagen predeterminada a la nueva ruta
        fs.copyFileSync('./helpers/default.png', newImagePath);


        const shepherd = await church.createMember({
            member_name: member_name,
            member_lastname: member_lastname,
            member_birth: member_birth,
            member_mail: member_mail,
            member_telephone: member_telephone,
            member_password: hashedPassword,
            member_image: "default.png"
        });

        // Asignar el atributo church_code del miembro al valor recién creado de church.church_code
        shepherd.church_code = church.church_code;
        await shepherd.save();

        const roleShepherd = await Role.findOne({ where: { role_name: "pastor" } });
        await shepherd.addRole(roleShepherd);

        return res.status(200).send({
            status: "Success",
            message: "Te has registrado correctamente",
            church,
            shepherd
        })
    } catch (error) {
        if (createdChurch) {
            await createdChurch.destroy();
        }

        res.status(500).json({ message: "Error al crear la iglesia", error });
    }
};


const updateChurch = async (req, res) => {

    const churchData = req.body;

    try {
        const church = await Church.findOne({
            where: {
                church_code: req.member.church_code
            }
        });

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada' });
        }

        // Verificar si otra Iglesia tiene el mismo nombre
        const existingChurch = await Church.findOne({
            where: {
                church_name: churchData.church_name,
                church_code: { [Op.ne]: req.member.church_code } // Excluir la propia Iglesia de la búsqueda
            }
        });

        if (existingChurch) {
            return res.status(400).json({ message: 'Ya existe otra Iglesia con el mismo nombre' });
        }

        await Church.update(churchData, {
            where: {
                church_code: req.member.church_code
            }
        });
        const updatedChurch = await Church.findOne({
            where: {
                church_code: req.member.church_code
            }
        });

        res.json(updatedChurch);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar los datos de la iglesia', error });
    }
}

const updateChurchIncome = async (req, res) => {
    const { church_income } = req.body;

    try {
        const church = await Church.findOne({
            where: {
                church_code: req.member.church_code,
            },
        });

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada' });
        }

        church.church_totalTreasuries = church_income;
        church.church_income = church_income;
        await church.save();

        res.json(church);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el ingreso de la iglesia', error });
    }
};

const updateChurchTotalTreasuries = async (req, res) => {
    const { church_totalTreasuries } = req.body;

    try {
        const church = await Church.findOne({
            where: {
                church_code: req.member.church_code,
            },
        });

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada' });
        }

        church.church_totalTreasuries = church_totalTreasuries;
        await church.save();

        res.json(church);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar los valores de las tesorerías', error });
    }
};

// DELETE /api/posts/:church_code
const deleteChurch = async (req, res) => {

    try {
        const church_code = req.params.church_code;

        // Buscar y eliminar la iglesia por su ID
        const church = await Church.findByPk(church_code);
        if (!church_code) {
            return res.status(404).json({ message: 'Iglesia no encontrada' });
        }

        await church.destroy();
        return res.json({ message: 'Iglesia eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la iglesia' });
    }
};


module.exports = {
    getChurchsForDepartment,
    getChurch,
    churchRegister,
    updateChurch,
    updateChurchIncome,
    updateChurchTotalTreasuries,
    deleteChurch
}
