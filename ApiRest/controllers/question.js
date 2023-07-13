const Question = require("../models/Question");
const Task = require("../models/Task");

const getQuestions = async (req, res) => {
    const { task_code } = req.params;

    try {
        const questions = await Task.findAll({
            attributes: ['task_code', 'task_title'],
            where: {
                task_code: task_code
            },
            include: {
                model: Question,
                as: 'question',
                attributes: ['question_code', 'question_description']
            }
        });

        if (!questions) {
            return res.status(404).send('No hay preguntas publicadas');
        }

        res.json(questions)

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las preguntas');
    } 

}


const createQuestion = async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ message: 'Pregunta creada exitosamente', question });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la pregunta', error: error.message });
    }
}


const updateQuestion = async (req, res) => {

    try {

        const question_code = req.params.question_code;
        let questionToUpdate = await Question.findOne({
            where: {
                question_code: question_code,
            },
        });

        if (!questionToUpdate) {
            return res.status(404).json({ message: 'La preguntare no existe' });
        }


        questionToUpdate.question_description = req.body.question_description || questionToUpdate.question_description;
        questionToUpdate.task_code = questionToUpdate.task_code;

        await questionToUpdate.save();

        return res.status(200).json(questionToUpdate);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar la pregunta.' });
    }

};


const deleteQuestion = async (req, res) => {

    try {
        const question_code = req.params.question_code;

        const question = await Question.findByPk(question_code);

        if (!question) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }

        await question.destroy();
        return res.json({ message: 'Pregunta eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la pregunta' });
    }

}

module.exports = {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion
}