import express from 'express';
import UserControllerInstance from '../controllers/UserController';
import { validateRequestFormat } from '../middlewares/validateFields';
import { userIdValidation } from '../validations/UserValidations';

const router = express.Router();

router.get('/', UserControllerInstance.getAll);
router.get('/:id', userIdValidation, validateRequestFormat, UserControllerInstance.getById);

export default router;