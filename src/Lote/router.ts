import { Router } from 'express';
import loteController from "./controller";
import {authenticateToken} from '../middlewares/JWT/authMiddleware.js';


const loteRouter = Router();

loteRouter.use(authenticateToken);

loteRouter.get("/", loteController.getAll);
loteRouter.get("/:id", loteController.getById);
loteRouter.post("/", loteController.create);
loteRouter.put("/:id", loteController.update);
loteRouter.delete("/:id", loteController.delete);

export default loteRouter;
