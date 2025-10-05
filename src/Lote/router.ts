import { Router } from 'express';
import loteController from "./controller";

const loteRouter = Router();

loteRouter.get("/", loteController.listar);
loteRouter.get("/:id", loteController.buscar);
loteRouter.post("/", loteController.criar);
loteRouter.put("/:id", loteController.atualizar);
loteRouter.delete("/:id", loteController.deletar);

export default loteRouter;
