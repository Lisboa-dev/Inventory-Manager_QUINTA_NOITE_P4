import { Router } from 'express';
import ProdutoController from "./controller";
import {authenticateToken} from '../middlewares/JWT/authMiddleware.js';



const produtoRouter = Router();

produtoRouter.use(authenticateToken);   

produtoRouter.get("/", ProdutoController.getAll);
produtoRouter.get("/:id", ProdutoController.getById);
produtoRouter.post("/", ProdutoController.create);
produtoRouter.put("/:id", ProdutoController.update);
produtoRouter.delete("/:id", ProdutoController.delete);

export default produtoRouter;
