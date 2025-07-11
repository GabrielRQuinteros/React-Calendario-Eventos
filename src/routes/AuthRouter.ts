import express from 'express';
import AuthControllerInstance from '../controllers/AuthController';
import { loginValidations, registerValidations } from '../validations/AuthValidations';
import { validateRequestFormat } from '../middlewares/validateFields';
import { privateRoute, publicRoute } from './helpers/SecurityRoutes';

const router = express.Router();

/// Agrego si son rutas publicas o privadas por endpoint
router.post('/register', publicRoute,  registerValidations, validateRequestFormat, AuthControllerInstance.register);
router.post('/login', publicRoute, loginValidations, validateRequestFormat, AuthControllerInstance.login);
router.post('/refresh-token', AuthControllerInstance.refreshToken);
router.post('/logout', privateRoute, AuthControllerInstance.logout);

export default router;