const Church = require("../models/Church");
const TypeTreasury = require("../models/TypeTreasury");


const createTypeTreasury = async (req, res) => {
    try {
        const member = req.member;
        const { church_code } = member;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const typeTreasury = await TypeTreasury.create({
            ...req.body,
            church_code,
        });

        res.status(201).json(typeTreasury);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el tipo de actividad de tesorería.' })
    }
}

const getTypeTreasury = async (req, res) => {
    try {
        const member = req.member;
        const { church_code } = member;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const { TypeTreasury_code } = req.params;
        const typeTreasury = await TypeTreasury.findByPk(TypeTreasury_code);

        if (!typeTreasury) {
            return res.status(404).json({ message: 'Tipo de actividad de tesorería no encontrada.' })
        }

        res.status(200).json(typeTreasury);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el tipo de actividad de tesorería.' })
    }
}

const getTypeTreasuries = async (req, res) => {

    try {
        const member = req.member;
        const church_code = member.church_code;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const typeTreasuries = await TypeTreasury.findAll({
            where: { church_code }
        });

        res.status(200).json(typeTreasuries);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los tipos de actividades de tesoreria.' })
    }

}

const updateTypeTreasury = async (req, res) => {
    try {
        const member = req.member;
        const { church_code } = member;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const { TypeTreasury_code } = req.params;
        const typeTreasury = await TypeTreasury.findByPk(TypeTreasury_code);

        if (!typeTreasury) {
            return res.status(404).json({ message: 'Tipo de actividad de tesorería no encontrada.' })
        }

        await typeTreasury.update(req.body);

        res.status(200).json(typeTreasury);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el tipo de actividad de tesorería.' })
    }
}

const deleteTypeTreasury = async (req, res) => {
    try {
        const member = req.member;
        const { church_code } = member;
        const church = await Church.findByPk(church_code);

        if (!church) {
            return res.status(404).json({ message: 'Iglesia no encontrada.' })
        }

        const { TypeTreasury_code } = req.params;
        const typeTreasury = await TypeTreasury.findByPk(TypeTreasury_code);

        if (!typeTreasury) {
            return res.status(404).json({ message: 'Tipo de actividad de tesorería no encontrada.' })
        }

        await typeTreasury.destroy();

        res.status(204).json();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el tipo de actividad de tesorería.' })
    }
}


module.exports = {
    createTypeTreasury,
    updateTypeTreasury,
    deleteTypeTreasury,
    getTypeTreasury,
    getTypeTreasuries,
};