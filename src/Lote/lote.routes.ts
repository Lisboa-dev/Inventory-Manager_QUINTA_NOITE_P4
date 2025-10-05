import { Router } from 'express';
import LoteController from "../Lote/lote.controller";

const router = Router();

router.get("/", LoteController.listar);
router.get("/:id", LoteController.buscar);
router.post("/", LoteController.criar);
router.put("/:id", LoteController.atualizar);
router.delete("/:id", LoteController.deletar);

export default router;
