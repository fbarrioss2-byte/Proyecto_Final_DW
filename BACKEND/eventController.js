const Event = require('../models/Event');
const Participant = require('../models/Participant');
const { notifyAdminNewEvent } = require('../utils/emailService');

// Obtener todos los eventos
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener eventos', error: error.message });
  }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    const participantCount = await Participant.countDocuments({ eventId: event._id });
    res.json({ ...event.toObject(), participantCount });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener evento', error: error.message });
  }
};

// ✅ CREAR EVENTO CON NOTIFICACIÓN POR EMAIL
const createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    
    console.log('✅ Evento guardado en BD:', savedEvent.title);
    
    // 📧 Enviar notificación al administrador
    notifyAdminNewEvent({
      title: savedEvent.title,
      description: savedEvent.description,
      date: savedEvent.date,
      time: savedEvent.time,
      location: savedEvent.location,
      maxParticipants: savedEvent.maxParticipants
    }).catch(error => {
      console.error('⚠️ Error al enviar email al admin:', error.message);
    });
    
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear evento', error: error.message });
  }
};

// Actualizar evento
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar evento', error: error.message });
  }
};

// Eliminar evento
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }
    
    await Participant.deleteMany({ eventId: req.params.id });
    res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};