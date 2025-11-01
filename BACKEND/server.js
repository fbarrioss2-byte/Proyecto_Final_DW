require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
// Rutas
app.use('/api/events', require('./routes/events'));
app.use('/api/participants', require('./routes/participants'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: '🎉 API de Gestor de Eventos funcionando correctamente' });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});