import { Request, Router, Response } from 'express';
import 'express-async-errors';
import UserController from '../controllers/UserController';
import UserService from '../services/UserService';
import UserModel from '../database/models/UserModel';
import AuthJWTService from '../services/AuthJWTService';
import EncrypterBcryptService from '../services/AuthBCryptService';
import Validations from '../middlewares/Validations';

const userModel = UserModel;
const encrypter = new EncrypterBcryptService();
const tokenGenerator = new AuthJWTService();

const userService = new UserService(userModel, encrypter, tokenGenerator);
const userController = new UserController(userService);

const router = Router();

router.post(
  '/',
  Validations.validateLogin,
  (req: Request, res: Response) => userController.login(req, res),
);

router.get(
  '/role',
  Validations.validateToken,
  (req: Request, res: Response) => userController.getRole(req, res),
);

export default router;
