import cron from 'node-cron';
import { RefreshTokenModel } from '../models/RefreshToken';


/** Función que inicia el Cron-Job que Elimina de la BD los RefreshTokens que se vencieron hace mas de 1 hora
 */
export const initRefreshTokenCleanUp = (): void => {
    // Ejecutar cada 30 minutos la limpieza de los RefreshTokens Expirados
    cron.schedule('*/30 * * * *', async () => {
      const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
      try {
          await RefreshTokenModel.deleteMany({
          expiresAt: { $lt: oneHourAgo }
        });
        console.log(`Eliminamos los Refresh tokens expirados hace mas de 1 hora.`);
      } catch (err) {
        console.error('Error eliminando refresh tokens expirados:', err);
      }
    });
}