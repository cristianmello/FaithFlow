const Treasury = require("../models/Treasury");
const Member = require("../models/Member");
const Church = require("../models/Church");
const { Op } = require("sequelize");


const getTreasuries = async (req, res) => {

    try {
        const member = req.member;
        const church_code = member.church_code;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const treasuries = await Treasury.findAll();

        res.status(200).json(treasuries);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas de tesoreria.' })
    }

}

const getLastTreasuries = async (req, res) => {
    try {
        const member = req.member;
        const church_code = member.church_code;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' });
        }

        const typeTreasuries = await TypeTreasury.findAll();
        const lastTreasuries = [];

        for (let typeTreasury of typeTreasuries) {
            const lastTreasury = await Treasury.findOne({
                where: {
                    TypeTreasury_code: typeTreasury.code
                },
                order: [['activity_date', 'DESC']],
            });
            lastTreasuries.push(lastTreasury);
        }

        res.status(200).json(lastTreasuries);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas de tesoreria.' });
    }
}

const getTreasury = async (req, res) => {

    const treasury_code = req.params.treasury_code;

    Treasury.findByPk(treasury_code).then(treasury => {
        if (treasury) {
            res.status(200).json(treasury);
        } else {
            res.status(404).json({ message: 'Actividad de tesorería no encontrada' });
        }
    }).catch(error => {
        res.status(500).json({ message: error.message });
    });
}

const getTreasuriesbetweenDate = async (req, res) => {

    const { startDate, finishDate } = req.query;

    // Validar fechas
    const startDateObj = new Date(startDate);
    const finishDateObj = new Date(finishDate);

    if (isNaN(startDateObj.getTime()) || isNaN(finishDateObj.getTime()) || startDateObj > finishDateObj) {
        return res.status(400).json({ message: 'Fechas inválidas' });
    }

    try {

        const member = req.member;
        const church_code = member.church_code;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }


        // Buscar las tareas de tesorería de la iglesia entre las fechas especificadas
        const treasuries = await Treasury.findAll({
            where: {
                activity_date: {
                    [Op.between]: [startDate, finishDate],
                },
                member_code: {
                    [Op.eq]: member.member_code
                }
            },
        });

        // Obtener los miembros que tienen esas tareas de tesorería
        const members = await Member.findAll({
            attributes: ['member_code', 'member_name', 'member_lastname'],
            include: [{
                model: Treasury,
                as: 'treasury',
                where: {
                    activity_code: {
                        [Op.in]: treasuries.map(treasury => treasury.activity_code),
                    },
                },
            }],
        });
        res.json(members)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las tareas de tesoreria' });
    }
}

const postTreasury = async (req, res) => {
    try {
        if (!req.body.activity_value || !req.body.activity_description || !req.body.activity_date || !req.body.TypeTreasury_code) {
            res.status(400).json({ message: 'Falta uno o más campos requeridos en el cuerpo de la solicitud' });
            return;
        }

        const treasury = await Treasury.create({
            activity_value: req.body.activity_value,
            activity_description: req.body.activity_description,
            activity_date: req.body.activity_date,
            TypeTreasury_code: req.body.TypeTreasury_code
        });

        res.status(201).json(treasury);

    } catch (error) {
        // Agregar más detalles sobre el error en la respuesta
        console.error(error);
        res.status(500).json({ message: 'Error al publicar la actividad de tesoreria', error: error.message });
    }
}
const updateTreasury = async (req, res) => {

    try {
        const { activity_value, activity_description, activity_date, TypeTreasury_code } = req.body;

        const treasury_code = req.params.activity_code;
        const treasury = await Treasury.findByPk(treasury_code);

        if (!treasury) {
            return res.status(404).json({ message: 'La tarea de tesoreria no existe' });
        }

        treasury.activity_value = activity_value;
        treasury.activity_description = activity_description;
        treasury.activity_date = activity_date;
        treasury.TypeTreasury_code = TypeTreasury_code;

        await treasury.save();

        return res.status(200).json(treasury);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error' });
    }

};


const deleteTreasury = async (req, res) => {
    try {
        const treasury_code = req.params.activity_code;

        const treasury = await Treasury.findByPk(treasury_code);
        if (!treasury) {
            return res.status(404).json({ message: 'Tarea de tesoreria no encontrado' });
        }

        await treasury.destroy();
        return res.json({ message: 'Tarea de tesoreria eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la tarea de tesoreria' });
    }
};

module.exports = {
    getTreasuries,
    getLastTreasuries,
    getTreasuriesbetweenDate,
    getTreasury,
    postTreasury,
    updateTreasury,
    deleteTreasury,
}