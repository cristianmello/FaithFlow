const Task = require("../models/Task");
const Member = require("../models/Member");
const Question = require("../models/Question");
const { Sequelize } = require("sequelize");


const getTasks = async (req, res) => {


    try {
        const task = await Task.findAll({
            include: {
                attributes:[],
                model: Member,
                as: 'member',
                where: {
                    church_code: req.member.church_code
                }
            } 
        });

        if (!task) {
            return res.status(404).send('No hay tareas publicadas');
        }

        res.json(task)
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las tareas');
    }

}

const createTask = async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ message: 'Tarea creada exitosamente', task });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
}


const updateTask = async (req, res) => {

    try {

        const task_code = req.params.task_code;
        let taskToUpdate = await Task.findOne({
            where: {
                task_code: task_code,
            },
        });

        if (!taskToUpdate) {
            return res.status(404).json({ message: 'La tarea no existe' });
        }



        taskToUpdate.task_title = req.body.task_title || taskToUpdate.task_title;
        taskToUpdate.task_description = req.body.task_description || taskToUpdate.task_description;

        taskToUpdate.member_code = taskToUpdate.member_code;

        await taskToUpdate.save();

        return res.status(200).json(taskToUpdate);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar la tarea' });
    }

};


const deleteTask = async (req, res) => {

    try {
        const task_code = req.params.task_code;

        const task = await Task.findByPk(task_code);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        await task.destroy();
        return res.status(200).json({ message: 'Tarea eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la tarea' });
    }

}



module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
}