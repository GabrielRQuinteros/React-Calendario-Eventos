import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';

const userService = new UserService();

export class UserController {
  getAll = async (_req: Request, res: Response) => {
    try {
      const users = await userService.getAllUsers();
      sendResponse(res, {
        success: true,
        message: 'Usuarios obtenidos correctamente',
        data: users,
        statusCode: StatusCodes.OK
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) {
        sendResponse(res, {
          success: false,
          message: 'Usuario no encontrado',
          statusCode: StatusCodes.NOT_FOUND
        });
        return;
      }
      sendResponse(res, {
        success: true,
        message: 'Usuario obtenido correctamente',
        data: user,
        statusCode: StatusCodes.OK
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al obtener usuario',
        error: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const user = await userService.createUser(req.body);
      sendResponse(res, {
        success: true,
        message: 'Usuario creado correctamente',
        data: user,
        statusCode: StatusCodes.CREATED
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al crear usuario',
        error: error.message,
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      if (!user) {
        sendResponse(res, {
          success: false,
          message: 'Usuario no encontrado',
          statusCode: StatusCodes.NOT_FOUND
        });
        return;
      }
      sendResponse(res, {
        success: true,
        message: 'Usuario actualizado correctamente',
        data: user,
        statusCode: StatusCodes.OK
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al actualizar usuario',
        error: error.message,
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deleted = await userService.deleteUser(req.params.id);
      if (!deleted) {
        sendResponse(res, {
          success: false,
          message: 'Usuario no encontrado',
          statusCode: StatusCodes.NOT_FOUND
        });
        return;
      }
      sendResponse(res, {
        success: true,
        message: 'Usuario eliminado correctamente',
        statusCode: StatusCodes.NO_CONTENT
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al eliminar usuario',
        error: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };

}

const UserControllerInstance = new UserController();
export default UserControllerInstance;