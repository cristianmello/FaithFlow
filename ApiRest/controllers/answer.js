const Answer = require("../models/Answer");
const Question = require("../models/Question");

const getAnswers = async (req, res) => {
    const { question_code } = req.params;

    try {
        const answers = await Question.findAll({
            attributes: ['question_code', 'question_description'],
            where: {
                question_code: question_code
            },
            include: {
                model: Answer,
                as: 'answer',
                attributes: ['answer_code', 'answer_description', 'answer_correct']
            }
        });

        /*
        const answers = await Answer.findAll({
            where: {
                question_code: question_code
            },
            include: {
                model: Question,
                as: 'question',
                attributes: ['question_description']
            }
        });
        */

        if (!answers) {
            return res.status(404).send('No hay respuestas publicadas');
        }

        res.json(answers)

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las respuestas');
    }

}


const createAnswer = async (req, res) => {
    try {
        const answer = await Answer.create(req.body);

        res.status(201).json({ message: 'Respuesta creada exitosamente', answer });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la respuesta', error: error.message });
    }
}


const updateAnswer = async (req, res) => {

    try {

        const answer_code = req.params.answer_code;

        let answerToUpdate = await Answer.findOne({
            where: {
                answer_code: answer_code,
            },
        });

        if (!answerToUpdate) {
            return res.status(404).json({ message: 'La respuesta no existe' });
        }



        answerToUpdate.answer_description = req.body.answer_description || answerToUpdate.answer_description;
        answerToUpdate.answer_correct = req.body.answer_correct || answerToUpdate.answer_correct;
        answerToUpdate.question_code = answerToUpdate.question_code;

        await answerToUpdate.save();

        return res.status(200).json(answerToUpdate);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizar la respuesta' });
    }

};


const deleteAnswer = async (req, res) => {

    try {
        const answer_code = req.params.answer_code;

        const answer = await Answer.findByPk(answer_code);

        if (!answer) {
            return res.status(404).json({ message: 'Respuesta no encontrada' });
        }

        await answer.destroy();
        return res.json({ message: 'Respuesta eliminada exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la respuesta' });
    }

}

module.exports = {
    getAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer
}