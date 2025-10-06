import { Router } from 'express';
import userController from './controller.js';
import { authenticateToken } from "../middlewares/JWT/authMiddleware.js";
// Import validate and createUserSchema from their respective modules


const userRouter = Router();

userRouter.post('/', userController.create);
userRouter.post('/login', userController.login);
userRouter.get('/:id', authenticateToken, userController.getById);
userRouter.put('/', authenticateToken, userController.update);
userRouter.delete('/', authenticateToken, userController.delete);


export default userRouter;