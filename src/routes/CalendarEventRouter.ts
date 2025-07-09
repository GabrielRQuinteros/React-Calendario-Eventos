import express from 'express';
import CalendarEventControllerInstance from '../controllers/CalendarEventCotroller';
import { calendarEventValidations, validateCalendarEventUpdate as calendarEventUpdateValidations, calendarEventIdValidation } from '../validations/CalendarEventsValidations';
import { validateRequestFormat } from '../middlewares/validateFields';

const router = express.Router();

router.get('/', CalendarEventControllerInstance.getAll);
router.get('/:id', calendarEventIdValidation, validateRequestFormat, CalendarEventControllerInstance.getById);
router.post('/', calendarEventValidations, validateRequestFormat, CalendarEventControllerInstance.create);
router.put('/:id', calendarEventUpdateValidations, validateRequestFormat, CalendarEventControllerInstance.update);
router.delete('/:id', calendarEventIdValidation, validateRequestFormat, CalendarEventControllerInstance.delete);

export default router;