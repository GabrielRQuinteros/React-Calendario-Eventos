import { UserModel } from '../models/User';
import { IUser } from '../models/User';

export class UserService {
  
  // Obtener todos los usuarios (sin contraseña)
  async getAllUsers(): Promise<IUser[]> {
    return await UserModel.find().select('-password');
  }

  // Obtener usuario por ID (sin contraseña)
  async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id).select('-password');
  }

  // Obtener usuario por Email
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({email});
  }

  // Crear usuario (solo admins u otras rutas que no usan auth)
  async createUser(data: { name: string; email: string; password: string }): Promise<IUser> {
    const user = new UserModel(data);
    return await user.save();
  }

  // Actualizar un usuario
  async updateUser(id: string, updates: Partial<Omit<IUser, 'comparePassword' | '_id'>>): Promise<IUser | null> {
    const user = await UserModel.findById(id);
    if (!user) return null;

    // Actualiza solo los campos permitidos
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;
    if (updates.password) user.password = updates.password; // bcrypt se aplica en middleware para encriptar la contraseña si cambió

    await user.save();
    return user.toObject({ versionKey: false });
  }

  // Eliminar un usuario
  async deleteUser(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  }
}

const UserServiceInstance = new UserService();
export default UserServiceInstance;