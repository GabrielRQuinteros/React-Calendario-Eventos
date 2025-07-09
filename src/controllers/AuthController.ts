import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';
import UserServiceInstance from '../services/UserService';
import AuthServiceInstance from '../services/AuthService';

export class AuthController {
  register: RequestHandler = async (req, res) => {
    const { name, email, password } = req.body;
    try {

      const userWithEmailInBD = UserServiceInstance.getUserByEmail(email);
      if( !!userWithEmailInBD ) {
          sendResponse(res, {
                              success: false,
                              message: 'Ya existe un usuario registrado con este email',
                              error: null,
                              statusCode: StatusCodes.BAD_REQUEST
                            });
          return;
      }

      const user = await AuthServiceInstance.register({ name, email, password });
      sendResponse(res, {
        success: true,
        message: 'Usuario registrado correctamente',
        data: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        statusCode: StatusCodes.CREATED
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al registrar usuario',
        error: error.message,
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
  };

  login: RequestHandler = async (req, res) => {
    const { email, password } = req.body;
    const user = await AuthServiceInstance.login(email, password);

    if (!user) {
      sendResponse(res, {
        success: false,
        message: 'Credenciales inválidas',
        statusCode: StatusCodes.UNAUTHORIZED
      });
      return;
    }

    // Generar JWT
    const token = jwt.sign(
      { uid: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '12h' }
    );

    sendResponse(res, {
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      },
      statusCode: StatusCodes.OK
    });
  };

  refreshToken: RequestHandler = async (req, res) => {
    const authHeader = req.header('authorization') || req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendResponse(res, {
        success: false,
        message: 'No se envió el token Bearer',
        statusCode: StatusCodes.UNAUTHORIZED
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const result = await AuthServiceInstance.refreshToken(token);

    if (!result) {
      sendResponse(res, {
        success: false,
        message: 'Token inválido',
        statusCode: StatusCodes.UNAUTHORIZED
      });
      return;
    }

    sendResponse(res, {
      success: true,
      message: 'Token renovado correctamente',
      data: result,
      statusCode: StatusCodes.OK
    });
  };

}

const AuthControllerInstance = new AuthController();
export default AuthControllerInstance;