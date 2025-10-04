import { Router } from 'express';
import { userController } from './controller.js';
// Import validate and createUserSchema from their respective modules


const userRouter = Router();

userRouter.post('/', userController.create);

userRouter.get('/:id', userController.getById);


export default userRouter;