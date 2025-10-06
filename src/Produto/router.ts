import { Router } from 'express';
import ProdutoController from "./controller";
import {authenticateToken} from '../middlewares/JWT/authMiddleware.js';
import {userResolverMiddleware} from '../middlewares/userResolverMiddleware.js';


const produtoRouter = Router();

produtoRouter.use(authenticateToken, userResolverMiddleware);   

produtoRouter.get("/", ProdutoController.getAll);
produtoRouter.get("/:id", ProdutoController.getById);
produtoRouter.post("/", ProdutoController.create);
produtoRouter.put("/:id", ProdutoController.update);
produtoRouter.delete("/:id", ProdutoController.delete);

export default produtoRouter;
