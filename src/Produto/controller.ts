

// src/controllers/ProdutoController.ts

import { Response } from 'express';
import { AuthRequest } from '../middlewares/JWT/typeJWT'; // Sua interface de requisição autenticada
import produtoService from './service'; // Importando a instância do serviço
import { produtoCreateBody, updateProdutoBody } from './utils/reqValidate'; // Bodys Zod para validação
import { handleError } from '../utils/errorClass'; // Seu handler de erro global

// A instância do serviço que o controller usará.


class ProdutoController {
  /**
   * CREATE: Cria um novo produto.
   */
  async create(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;

      // 1. Valida o corpo da requisição com o Body Zod.
      const produtoData = produtoCreateBody.parse(req.body);

      // 2. Chama o serviço com os dados validados.
      const novoProduto = await produtoService.create(usuarioId, produtoData);

      return res.status(201).json(novoProduto);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * READ (All): Lista todos os produtos do usuário logado.
   */
  async getAll(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const produtos = await produtoService.findAll(usuarioId);
      return res.status(200).json(produtos);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * READ (One): Busca um produto específico pelo ID.
   */
  async getById(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const produtoId = parseInt(req.params.id, 10);

      if (isNaN(produtoId)) {
        return res.status(400).json({ error: "ID do produto inválido." });
      }

      const produto = await produtoService.findOne(usuarioId, produtoId);
      return res.status(200).json(produto);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * UPDATE: Atualiza um produto existente.
   */
  async update(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const produtoId = parseInt(req.params.id, 10);

      if (isNaN(produtoId)) {
        return res.status(400).json({ error: "ID do produto inválido." });
      }

      // Valida os campos que estão sendo enviados para atualização.
      const produtoData = updateProdutoBody.parse(req.body);

      if (Object.keys(produtoData).length === 0) {
        return res.status(400).json({ error: "Nenhum dado fornecido para atualização." });
      }

      const produtoAtualizado = await produtoService.update(usuarioId, produtoId, produtoData);
      return res.status(200).json(produtoAtualizado);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * DELETE: Deleta um produto.
   */
  async delete(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const produtoId = parseInt(req.params.id, 10);

      if (isNaN(produtoId)) {
        return res.status(400).json({ error: "ID do produto inválido." });
      }

      await produtoService.delete(usuarioId, produtoId);
      
      // Resposta padrão para delete bem-sucedido (sem conteúdo).
      return res.status(204).send();
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default new ProdutoController();
