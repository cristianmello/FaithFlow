const { Op } = require('sequelize');
const Meeting = require('../models/Meeting');
const Member = require('../models/Member');



const getAllMeetings = async (req, res) => {

    const church_code = req.member.church_code;

    try {
        const meetings = await Meeting.findAll({
            where: {
                church_code: church_code
            }
        })

        if (!meetings) {
            return res.status(404).json({ message: 'No existen reuniones registradas' });
        }
        res.json(meetings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Hubo un error al obtener las reuniones' });
    }
}


//Obtener todos los miembros que fueron a una reunion
const getMeetingMembers = async (req, res) => {
    const meeting_code = req.params.meeting_code;

    try {
        // Búsqueda directa de la reunión con sus miembros
        const meeting = await Meeting.findOne({
            where: { meeting_code: meeting_code },
            include: {
                model: Member,
                attributes: ['member_code', 'member_name', 'member_lastname',
                    'member_birth', 'member_telephone', 'member_mail', 'member_password', 'member_image', 'church_code'],
                through: { attributes: [] }, // excluye la tabla intermedia de la respuesta
            },
        });

        if (!meeting) {
            return res.status(404).json({ message: 'La reunion no existe' });
        }

        if (!meeting.Members || meeting.Members.length === 0) {
            return res.status(404).json({ message: 'No hay miembros para esta reunión' });
        }

        res.status(200).json(meeting.Members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la reunion' });
    }
}


//Obtener los miembros que participaron en las reuniones entre dos fechas.
const getDateMeetingMembers = async (req, res) => {
    const { startDate, finishDate } = req.query;

    try {
        const members = await Member.findAll({
            include: [{
                model: Meeting,
                where: {
                    meeting_data: {
                        [Op.between]: [startDate, finishDate],
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


const createMeeting = async (req, res) => {
    const { meeting_description, meeting_data, meeting_starttime, meeting_finishtime } = req.body;
    const church_code = req.member.church_code;

    try {
        const meetingCreated = await Meeting.create({
            meeting_description,
            meeting_data,
            meeting_starttime,
            meeting_finishtime,
            church_code
        });

        res.status(201).json({ message: 'Reunión creada correctamente', meeting: meetingCreated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reunión' });
    }
}


const associateMeetingMembers = async (req, res) => {

    try {

        const meeting = await Meeting.findByPk(req.params.meeting_code);
        const member = await Member.findByPk(req.params.member_code);

        if (!meeting || !member) {
            return res.status(404).send('Reunión o miembro no encontrados');
        }

        await meeting.addMember(member);

        res.send('Miembro añadido a la reunion exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al asociar el miembro con la reunion');
    }

}

const disassociateMeetingMembers = async (req, res) => {
    try {
      const meeting = await Meeting.findByPk(req.params.meeting_code);
      const member = await Member.findByPk(req.params.member_code);
  
      if (!meeting || !member) {
        return res.status(404).send('Reunión o miembro no encontrados');
      }
  
      await meeting.removeMember(member);
  
      res.send('Miembro eliminado de la reunion exitosamente');
    } catch (error) {
      console.log(error);
      res.status(500).send('Error al desasociar el miembro de la reunion');
    }
  };
  

const updateMeeting = async (req, res) => {

    try {
        const { meeting_description, meeting_data, meeting_starttime, meeting_finishtime } = req.body;

        const meeting_code = req.params.meeting_code;
        const meeting = await Meeting.findByPk(meeting_code);

        if (!meeting) {
            return res.status(404).json({ message: 'La reunion no existe' });
        }

        meeting.meeting_description = meeting_description;
        meeting.meeting_data = meeting_data;
        meeting.meeting_starttime = meeting_starttime;
        meeting.meeting_finishtime = meeting_finishtime;

        await meeting.save();

        return res.status(200).json(meeting);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Hubo un error al actualizzar la reunión' });
    }

};


const deleteMeeting = async (req, res) => {
    try {
        const meeting_code = req.params.meeting_code;

        const meeting = await Meeting.findByPk(meeting_code);
        if (!meeting) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }

        await meeting.destroy();
        return res.json({ message: 'Reunion eliminada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Hubo un error al eliminar la reunión' });
    }
};

module.exports = {
    getAllMeetings,
    getMeetingMembers,
    getDateMeetingMembers,
    createMeeting,
    associateMeetingMembers,
    disassociateMeetingMembers,
    updateMeeting,
    deleteMeeting,
}
