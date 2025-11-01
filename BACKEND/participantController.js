const Participant = require('../models/Participant');
const Event = require('../models/Event');
const { sendConfirmationEmail } = require('../utils/emailService');

// Registrar participante en un evento
exports.registerParticipant = async (req, res) => {
  try {
    const { name, email, phone, eventId } = req.body;

    // Verificar que el evento existe
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    // Contar participantes actuales
    const currentParticipants = await Participant.countDocuments({ event: eventId });
    
    if (currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'El evento ha alcanzado el máximo de participantes' });
    }

    // Verificar si el email ya está registrado en este evento
    const existingParticipant = await Participant.findOne({ email, event: eventId });
    if (existingParticipant) {
      return res.status(400).json({ message: 'Este email ya está registrado en el evento' });
    }

    // Crear participante
    const participant = new Participant({
      name,
      email,
      phone,
      event: eventId
    });

    await participant.save();

    // 📧 Enviar email de confirmación (asíncrono, no bloqueante)
    sendConfirmationEmail(email, name, {
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location
    }).catch(error => {
      console.error('⚠️ Error al enviar email (no crítico):', error.message);
    });

    res.status(201).json({
      message: 'Registro exitoso. Se ha enviado un email de confirmación.',
      participant
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar participante', error: error.message });
  }
};

// Obtener participantes de un evento
exports.getParticipantsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const participants = await Participant.find({ event: eventId })
      .populate('event', 'title date')
      .sort({ registeredAt: -1 });

    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener participantes', error: error.message });
  }
};

// Eliminar participante
exports.deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findByIdAndDelete(req.params.id);
    
    if (!participant) {
      return res.status(404).json({ message: 'Participante no encontrado' });
    }

    res.json({ message: 'Participante eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar participante', error: error.message });
  }
};

// Obtener todos los participantes (opcional - para admin)
exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate('event', 'title date location')
      .sort({ registeredAt: -1 });

    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener participantes', error: error.message });
  }
};