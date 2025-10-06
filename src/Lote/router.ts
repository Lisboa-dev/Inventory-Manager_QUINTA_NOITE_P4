import { Router } from 'express';
import loteController from "./controller";
import {authenticateToken} from '../middlewares/JWT/authMiddleware.js';
import {userResolverMiddleware} from '../middlewares/userResolverMiddleware.js';

const loteRouter = Router();

loteRouter.use(authenticateToken, userResolverMiddleware);

loteRouter.get("/", loteController.getAll);
loteRouter.get("/:id", loteController.getById);
loteRouter.post("/", loteController.create);
loteRouter.put("/:id", loteController.update);
loteRouter.delete("/:id", loteController.delete);

export default loteRouter;
