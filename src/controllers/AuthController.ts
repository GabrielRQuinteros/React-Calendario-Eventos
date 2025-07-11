import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';
import UserServiceInstance from '../services/UserService';
import AuthServiceInstance from '../services/AuthService';

export class AuthController {
  register: RequestHandler = async (req, res) => {
    const { name, email, password } = req.body;
    try {

      const userWithEmailInBD = await UserServiceInstance.getUserByEmail(email);
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
    const result = await AuthServiceInstance.login(email, password);

    if (!result) {
      sendResponse(res, {
        success: false,
        message: 'Credenciales inválidas',
        statusCode: StatusCodes.UNAUTHORIZED
      });
      return;
    }

    const { user, accessToken, refreshToken } = result;

    sendResponse(res, {
      success: true,
      message: 'Login exitoso',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        accessToken,
        refreshToken
      },
      statusCode: StatusCodes.OK
    });
  };

  refreshToken: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendResponse(res, {
        success: false,
        message: 'No se envió el refresh token',
        statusCode: StatusCodes.UNAUTHORIZED
      });
      return;
    }

    const result = await AuthServiceInstance.refreshToken(refreshToken);

    if (!result) {
      sendResponse(res, {
        success: false,
        message: 'Refresh token inválido o expirado',
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


  logout: RequestHandler = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendResponse(res, {
        success: false,
        message: 'No se envió el refresh token',
        statusCode: StatusCodes.BAD_REQUEST
      });
      return;
    }

    const authHeader = req.header('Authorization');
    const accessToken = authHeader!.replace('Bearer ', '').trim();

    const success = await AuthServiceInstance.logout(accessToken, refreshToken);

    sendResponse(res, {
      success,
      message: success ? 'Logout exitoso' : 'Token no encontrado',
      statusCode: StatusCodes.OK
    });
  };


}

const AuthControllerInstance = new AuthController();
export default AuthControllerInstance;