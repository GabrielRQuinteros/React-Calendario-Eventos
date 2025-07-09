import { UserModel } from '../models/User';
import { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import UserServiceInstance from './UserService';

export class AuthService {

  async register(data: { name: string; email: string; password: string }): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  async login(email: string, password: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email });
    if (!user) return null;

    const isMatch = await user.comparePassword(password);
    return isMatch ? user : null;
  }

  async refreshToken(oldToken: string): Promise<{ user: any; token: string } | null> {
    try {
      // Verifica el token (ignorando expiración), caso de rechazar el token lanza una excepcion que es atrapada por el catch
      const payload = jwt.verify(oldToken, process.env.JWT_SECRET || 'default_secret', { ignoreExpiration: true }) as any;

      // Busca el usuario en la BD
      const user = await UserServiceInstance.getUserById(payload.uid);
      if (!user) return null;

      // Genera un nuevo token
      const newToken = jwt.sign(
        { uid: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'default_secret',
        // { expiresIn: '12h' }
        { expiresIn: '1m' }
      );

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token: newToken
      };
    } catch {
      return null;
    }
  }

  
}

const AuthServiceInstance = new AuthService();

export default AuthServiceInstance;