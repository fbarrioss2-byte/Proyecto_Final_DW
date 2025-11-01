const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');

// Registrar participante en un evento
router.post('/', participantController.registerParticipant);

// Obtener participantes de un evento específico
router.get('/event/:eventId', participantController.getParticipantsByEvent);

// Obtener todos los participantes (opcional)
router.get('/', participantController.getAllParticipants);

// Eliminar participante
router.delete('/:id', participantController.deleteParticipant);

module.exports = router;