import express from 'express';
import UserControllerInstance from '../controllers/UserController';
import { validateRequestFormat } from '../middlewares/validateFields';
import { createUserValidations, userIdValidation } from '../validations/UserValidations';
import { privateRoute } from './helpers/SecurityRoutes';

const router = express.Router();

// Middleware global: protege todas las rutas
router.use(privateRoute);

router.get('/', UserControllerInstance.getAll);
router.get('/:id', userIdValidation, validateRequestFormat, UserControllerInstance.getById);
router.post('/', createUserValidations, validateRequestFormat, UserControllerInstance.create);
router.put('/:id', userIdValidation, validateRequestFormat, UserControllerInstance.update);
router.delete('/:id', userIdValidation, validateRequestFormat, UserControllerInstance.delete);

export default router;