import express from 'express';
import CalendarEventControllerInstance from '../controllers/CalendarEventCotroller';
import { calendarEventValidations, validateCalendarEventUpdate as calendarEventUpdateValidations, calendarEventIdValidation } from '../validations/CalendarEventsValidations';
import { validateRequestFormat } from '../middlewares/validateFields';
import { privateRoute } from './helpers/SecurityRoutes';

const router = express.Router();

// Middleware global: protege todas las rutas
router.use(privateRoute);

router.get('/', CalendarEventControllerInstance.getAll);
router.get('/:id', calendarEventIdValidation, validateRequestFormat, CalendarEventControllerInstance.getById);
router.post('/', calendarEventValidations, validateRequestFormat, CalendarEventControllerInstance.create);
router.put('/:id', calendarEventUpdateValidations, validateRequestFormat, CalendarEventControllerInstance.update);
router.delete('/:id', calendarEventIdValidation, validateRequestFormat, CalendarEventControllerInstance.delete);

export default router;