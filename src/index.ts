import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/UsersRouter';
import authRoutes from './routes/AuthRouter';
import calendarEventRoutes from './routes/CalendarEventRouter';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/calendar-express-backend')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('ERROR: -> Error de conexión con MongoDB', err));

// Middleware para que parse el body de las request a un JSON directamente.
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static('public'));


// Rutas a Controladores
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', calendarEventRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}/`);
});