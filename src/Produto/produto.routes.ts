import { Router } from 'express';
import ProdutoController from "../Produto/produto.controller";

const router = Router();

router.get("/", ProdutoController.listar);
router.get("/:id", ProdutoController.buscar);
router.post("/", ProdutoController.criar);
router.put("/:id", ProdutoController.atualizar);
router.delete("/:id", ProdutoController.deletar);

export default router;
