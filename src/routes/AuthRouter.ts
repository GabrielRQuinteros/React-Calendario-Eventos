import express from 'express';
import AuthControllerInstance from '../controllers/AuthController';
import { loginValidations, registerValidations } from '../validations/AuthValidations';
import { validateRequestFormat } from '../middlewares/validateFields';

const router = express.Router();

router.post('/register', registerValidations, validateRequestFormat, AuthControllerInstance.register);
router.post('/login', loginValidations, validateRequestFormat, AuthControllerInstance.login);
router.post('/refresh-token', AuthControllerInstance.refreshToken);

export default router;