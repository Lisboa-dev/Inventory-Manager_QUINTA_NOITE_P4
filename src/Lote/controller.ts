import { Request, Response } from "express";
import LoteService from "./service";

class LoteController {
  async listar(req: Request, res: Response) {
    try {
      const lotes = await LoteService.listarTodos();
      res.json(lotes);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const lote = await LoteService.buscarPorId(id);
      if (!lote) return res.status(404).json({ error: "Não encontrado" });
      res.json(lote);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const novo = await LoteService.criar(req.body);
      res.status(201).json(novo);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const atualizado = await LoteService.atualizar(id, req.body);
      res.json(atualizado);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await LoteService.deletar(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}

export default new LoteController();
