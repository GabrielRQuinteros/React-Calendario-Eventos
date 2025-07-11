import jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import UserServiceInstance from './UserService';
import { AccessTokenModel } from '../models/AccessToken';


export class AuthService {
  static ACCESS_TOKEN_DURATION: jwt.SignOptions['expiresIn'] = '8h';
  static REFRESH_TOKEN_DURATION: jwt.SignOptions['expiresIn'] = '7d';
  static REFRESH_TOKEN_DURATION_DAYS = 7;
  static ACCESS_TOKEN_DURATION_MS = 8 * 60 * 60 * 1000;


  async register(data: { name: string; email: string; password: string }): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  async login(email: string, password: string): Promise<{ user: IUser; accessToken: string; refreshToken: string } | null> {
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return null;

    const accessToken = jwt.sign(
      { uid: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: AuthService.ACCESS_TOKEN_DURATION }
    );

    const refreshToken = jwt.sign(
      { uid: user._id },
      process.env.JWT_REFRESH_SECRET || 'refresh_secret',
      { expiresIn: AuthService.REFRESH_TOKEN_DURATION }
    );

    const refreshTokenExpiresAt = new Date();
    refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + AuthService.REFRESH_TOKEN_DURATION_DAYS);

    const accessTokenExpiresAt = new Date(Date.now() + AuthService.ACCESS_TOKEN_DURATION_MS );
    
    await RefreshTokenModel.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
        revoked: false
      });

    await AccessTokenModel.create({
        userId: user._id,
        token: accessToken,
        expiresAt: accessTokenExpiresAt,
        revoked: false
      });

    return { user, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ user: any; accessToken: string; refreshToken: string } | null> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;

      const refreshTokenInDB = await RefreshTokenModel.findOne({ token: refreshToken });
      if (!refreshTokenInDB || refreshTokenInDB.revoked ) return null;

      const user = await UserServiceInstance.getUserById(payload.uid);
      if (!user) return null;

      // CREAMOS LOS NUEVOS JWT DEL REFRESH TOKEN Y ACCESS TOKEN
      const newAccessToken = jwt.sign(
        { uid: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: AuthService.ACCESS_TOKEN_DURATION }
      );

      const newRefreshToken = jwt.sign(
        { uid: user._id },
        process.env.JWT_REFRESH_SECRET || 'refresh_secret',
        { expiresIn: AuthService.REFRESH_TOKEN_DURATION }
      );

      const refreshTokenExpiresAt = new Date();
      refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + AuthService.REFRESH_TOKEN_DURATION_DAYS);

      const accessTokenExpiresAt = new Date(Date.now() + AuthService.ACCESS_TOKEN_DURATION_MS );

      /// GUARDAMOS EL ACCESS Y REFRESH TOKEN EN BD 
      await AccessTokenModel.create({
        userId: user._id,
        token: newAccessToken,
        expiresAt: refreshTokenExpiresAt,
        revoked: false
      });

      await RefreshTokenModel.create({
        userId: user._id,
        token: newRefreshToken,
        expiresAt: accessTokenExpiresAt,
        revoked: false
      });
      
      /// RETORNAMOS TODA LA DATA DE AUTENTICACIÓN
      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (err) {
      return null;
    }
  }

  async logout( accessToken: string , refreshToken: string): Promise<boolean> {
    const refreshTokenInBD = await RefreshTokenModel.findOne({ token: refreshToken });
    const accessTokenInBD = await AccessTokenModel.findOne( { token: accessToken } );
    if (refreshTokenInBD) {
      refreshTokenInBD.revoked = true;
      await refreshTokenInBD.save();
    }
    if (accessTokenInBD) {
      accessTokenInBD.revoked = true;
      await accessTokenInBD.save();
    }

    return true;
  }

  
}

const AuthServiceInstance = new AuthService();
export default AuthServiceInstance;