import { Request, Response } from 'express';
import { CalendarEventService } from '../services/CalendarEventService';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '../responses/helpers/SendDefaultResponse';

const calendarEventService = new CalendarEventService();

export class CalendarEventController {
  getAll = async (_req: Request, res: Response) => {
    try {
      const events = await calendarEventService.getAll();
      sendResponse(res, {
        success: true,
        message: 'Eventos obtenidos correctamente',
        data: events,
        statusCode: StatusCodes.OK
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al obtener eventos',
        error: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const event = await calendarEventService.getById(req.params.id);
      if (!event) {
        sendResponse(res, {
          success: false,
          message: 'Evento no encontrado',
          statusCode: StatusCodes.NOT_FOUND
        });
        return;
      }
      sendResponse(res, {
        success: true,
        message: 'Evento obtenido correctamente',
        data: event,
        statusCode: StatusCodes.OK
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al obtener evento',
        error: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const event = await calendarEventService.create(req.body);
      sendResponse(res, {
        success: true,
        message: 'Evento creado correctamente',
        data: event,
        statusCode: StatusCodes.CREATED
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al crear evento',
        error: error.message,
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const event = await calendarEventService.update(req.params.id, req.body);
      if (!event) {
        sendResponse(res, {
          success: false,
          message: 'Evento no encontrado',
          statusCode: StatusCodes.NOT_FOUND
        });
        return;
      }
      sendResponse(res, {
        success: true,
        message: 'Evento actualizado correctamente',
        data: event,
        statusCode: StatusCodes.OK
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al actualizar evento',
        error: error.message,
        statusCode: StatusCodes.BAD_REQUEST
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deleted = await calendarEventService.delete(req.params.id);
      if (!deleted) {
        sendResponse(res, {
          success: false,
          message: 'Evento no encontrado',
          statusCode: StatusCodes.NOT_FOUND
        });
        return;
      }
      sendResponse(res, {
        success: true,
        message: 'Evento eliminado correctamente',
        statusCode: StatusCodes.NO_CONTENT
      });
    } catch (error: any) {
      sendResponse(res, {
        success: false,
        message: 'Error al eliminar evento',
        error: error.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      });
    }
  };
}

const CalendarEventControllerInstance = new CalendarEventController();
export default CalendarEventControllerInstance;