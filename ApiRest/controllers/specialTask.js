const { Op } = require('sequelize');
const SpecialTask = require('../models/SpecialTask');
const Member = require('../models/Member');



const getAllspecialTasks = async (req, res) => {

    const church_code = req.member.church_code;

    try {
        const specialTask = await SpecialTask.findAll({
            where: {
                church_code: church_code
            }
        })

        if (!specialTask) {
            return res.status(404).json({ message: 'No existen reuniones registradas' });
        }
        res.json(specialTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener las actividades especiales' });
    }
}

const getSpecialTaskMembers = async (req, res) => {

    const specialTask_code = req.params.specialTask_code;

    try {
        const specialTask = await SpecialTask.findByPk(specialTask_code, {
            include: {
                model: Member,
                attributes: ['member_mail', 'member_name', 'member_lastname'],
                through: { attributes: [] }, // excluye la tabla intermedia de la respuesta
            },
        });

        if (!specialTask) {
            return res.status(404).send('La tarea no existe');
        }
        res.json(specialTask)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener la tarea');
    }

}


const getDateSpecialTaskMembers = async (req, res) => {
    const { startdate, finishdate } = req.query;

    try {
        const members = await Member.findAll({
            attributes: ['member_mail', 'member_name', 'member_lastname'],
            include: [{
                model: SpecialTask,
                where: {
                    specialtask_startdate: { [Op.lte]: finishdate },
                    specialTask_finishdate: { [Op.gte]: startdate }
                },
                attributes: ['specialtask_code', 'specialtask_description'],
                through: { attributes: [] },
            }],
        });
        res.json(members)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas' });
    }
}


// Crea una nueva tarea especial
const postSpecialTask = async (req, res) => {
    const { specialtask_description, specialtask_startdate, specialtask_finishdate, specialtask_starttime, specialtask_finishtime } = req.body;
    const church_code = req.member.church_code;

    try {
        const specialTask_created = await SpecialTask.create({
            specialtask_description,
            specialtask_startdate,
            specialtask_finishdate,
            specialtask_starttime,
            specialtask_finishtime,
            church_code
        });

        res.status(201).json({ message: 'Actividad creada correctamente', specialTask: specialTask_created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la actividad especial' });
    }
};

//Añade miembros a una tarea especial
const postSpecialTaskMember = async (req, res) => {

    try {
        const specialTask = await SpecialTask.findByPk(req.params.specialTask_code);
        const member = await Member.findByPk(req.params.member_code);

        if (!specialTask || !member) {
            return res.status(404).send('Tarea o miembro no encontrados');
        }

        await specialTask.addMember(member);

        res.send('Miembro añadido a la tarea');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al asociar el miembro con la tarea');
    }

}

const updateSpecialTask = async (req, res) => {

    try {
        const { specialtask_description, specialtask_startdate,
            specialtask_finishdate, specialtask_starttime, specialtask_finishtime } = req.body;

        const specialTask_code = req.params.specialTask_code;
        const specialTask = await SpecialTask.findByPk(specialTask_code);

        if (!specialTask) {
            return res.status(404).json({ message: 'La tarea no existe' });
        }

        specialTask.specialtask_description = specialtask_description;
        specialTask.specialtask_startdate = specialtask_startdate;
        specialTask.specialtask_finishdate = specialtask_finishdate;
        specialTask.specialtask_starttime = specialtask_starttime;
        specialTask.specialtask_finishtime = specialtask_finishtime;

        await specialTask.save();

        return res.status(200).json(specialTask);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar la actividad' });
    }

};


const deleteSpecialTask = async (req, res) => {
    try {
        const specialTask_code = req.params.specialTask_code;

        const specialTask = await SpecialTask.findByPk(specialTask_code);
        if (!specialTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await specialTask.destroy();
        return res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la tarea' });
    }
};

module.exports = {
    getAllspecialTasks,
    getSpecialTaskMembers,
    getDateSpecialTaskMembers,
    postSpecialTask,
    postSpecialTaskMember,
    updateSpecialTask,
    deleteSpecialTask
}
