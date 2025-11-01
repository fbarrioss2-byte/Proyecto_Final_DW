import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Eventos
export const getEvents = () => axios.get(`${API_URL}/events`);
export const getEventById = (id) => axios.get(`${API_URL}/events/${id}`);
export const createEvent = (data) => axios.post(`${API_URL}/events`, data);
export const updateEvent = (id, data) => axios.put(`${API_URL}/events/${id}`, data);
export const deleteEvent = (id) => axios.delete(`${API_URL}/events/${id}`);

// Participantes
export const registerParticipant = (data) => axios.post(`${API_URL}/participants`, data);
export const getParticipantsByEvent = (eventId) => axios.get(`${API_URL}/participants/event/${eventId}`);
export const deleteParticipant = (id) => axios.delete(`${API_URL}/participants/${id}`);