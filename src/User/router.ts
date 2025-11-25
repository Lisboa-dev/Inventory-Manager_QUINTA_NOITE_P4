import { Router } from 'express';
import userController from './controller.js';
import { authenticateToken,  } from "../middlewares/JWT/authMiddleware.js";




const userRouter = Router();

userRouter.post('/create', userController.create);
userRouter.post('/', userController.login);
userRouter.get('/', authenticateToken, userController.getById);
userRouter.put('/', authenticateToken, userController.update);
userRouter.delete('/', authenticateToken, userController.delete);


export default userRouter;