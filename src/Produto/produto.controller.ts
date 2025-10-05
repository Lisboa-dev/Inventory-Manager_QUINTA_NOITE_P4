import { Request, Response } from "express";
import ProdutoService from "../Produto/produto.service";

class ProdutoController {
  async listar(req: Request, res: Response) {
    try {
      const produtos = await ProdutoService.listarTodos();
      res.json(produtos);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async buscar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const produto = await ProdutoService.buscarPorId(id);
      if (!produto) return res.status(404).json({ error: "Não encontrado" });
      res.json(produto);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }

  async criar(req: Request, res: Response) {
    try {
      const novo = await ProdutoService.criar(req.body);
      res.status(201).json(novo);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async atualizar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const atualizado = await ProdutoService.atualizar(id, req.body);
      res.json(atualizado);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  async deletar(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await ProdutoService.deletar(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}

export default new ProdutoController();
