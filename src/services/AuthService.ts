import jwt from 'jsonwebtoken';
import { IUser, UserModel } from '../models/User';
import { RefreshTokenModel } from '../models/RefreshToken';
import UserServiceInstance from './UserService';


export class AuthService {
  static ACCESS_TOKEN_DURATION: jwt.SignOptions['expiresIn'] = '2m';
  static REFRESH_TOKEN_DURATION: jwt.SignOptions['expiresIn'] = '7d';
  static REFRESH_TOKEN_DURATION_DAYS = 7;

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

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + AuthService.REFRESH_TOKEN_DURATION_DAYS);

    await RefreshTokenModel.create({
      userId: user._id,
      token: refreshToken,
      expiresAt
    });

    return { user, accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ user: any; accessToken: string; refreshToken: string } | null> {
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret') as any;

      const tokenInDB = await RefreshTokenModel.findOne({ token: refreshToken });
      if (!tokenInDB) return null;

      const user = await UserServiceInstance.getUserById(payload.uid);
      if (!user) return null;

      await RefreshTokenModel.deleteOne({ token: refreshToken });

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

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + AuthService.REFRESH_TOKEN_DURATION_DAYS);

      await RefreshTokenModel.create({
        userId: user._id,
        token: newRefreshToken,
        expiresAt
      });

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

  async logout(refreshToken: string): Promise<boolean> {
    const result = await RefreshTokenModel.findOneAndDelete({ token: refreshToken });
    return !!result;
  }
}

const AuthServiceInstance = new AuthService();
export default AuthServiceInstance;