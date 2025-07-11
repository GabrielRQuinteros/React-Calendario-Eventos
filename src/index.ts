import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/UsersRouter';
import authRoutes from './routes/AuthRouter';
import calendarEventRoutes from './routes/CalendarEventRouter';
import dotenv from 'dotenv';
import { initRefreshAndAccessTokenCleanUp } from './cron-jobs/CleanRefreshTokensFromDB';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const mongoDBUrl: string = process.env.MONGO_URL_CONNECTION!;

// Conexión a MongoDB
mongoose.connect( mongoDBUrl )
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('ERROR: -> Error de conexión con MongoDB', err));

// Inicio el Cron-Job de limpieza de Refresh-Tokens
initRefreshAndAccessTokenCleanUp();

// Middleware para que parse el body de las request a un JSON directamente.
app.use(express.json());

/// NOTA: --> Express no incluye un middleware nativo para procesar multipart/form-data (archivos)
/// Para usarlos necesita una librería externa. Esta es "multer". --> npm install multer

// Servir archivos estáticos del frontend
app.use(express.static('public'));

// Rutas a Controladores
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', calendarEventRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/`);
});