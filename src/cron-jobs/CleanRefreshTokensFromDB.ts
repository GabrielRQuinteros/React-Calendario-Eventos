import cron from 'node-cron';
import { RefreshTokenModel } from '../models/RefreshToken';
import { AccessTokenModel } from '../models/AccessToken';


/** Función que inicia el Cron-Job que Elimina de la BD los Access y Refresh Tokens que hallan expirado.
 */
export const initRefreshAndAccessTokenCleanUp = (): void => {
  // Ejecutar cada 30 minutos la limpieza
  cron.schedule('*/30 * * * *', async () => {
    const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60); // 1 hora
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días

    try {
      const refreshDeleted = await RefreshTokenModel.deleteMany({
        expiresAt: { $lt: oneHourAgo }
      });
      console.log(`Eliminamos ${refreshDeleted.deletedCount} refresh tokens expirados hace más de 1 hora.`);

      const accessDeleted = await AccessTokenModel.deleteMany({
        expiresAt: { $lt: twoDaysAgo }
      });
      console.log(`Eliminamos ${accessDeleted.deletedCount} access tokens expirados hace más de 2 días.`);

    } catch (err) {
      console.error('Error eliminando tokens expirados:', err);
    }
  });
};