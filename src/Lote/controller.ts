/*import { Request, Response } from "express";
import LoteService from "./service";
import { AuthRequest } from "../middlewares/JWT/typeJWT.js";

class loteController {


  async listar(req: AuthRequest, res: Response) {
    try {
      const lotes = await LoteService.listarTodos();
      res.json(lotes);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }



  async buscar(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const lote = await LoteService.buscarPorId(id);
      if (!lote) return res.status(404).json({ error: "Não encontrado" });
      res.json(lote);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  }



  async criar(req: AuthRequest, res: Response) {
    try {
      const novo = await LoteService.criar(req.body);
      res.status(201).json(novo);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }



  async atualizar(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      const atualizado = await LoteService.atualizar(id, req.body);
      res.json(atualizado);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }



  async deletar(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      await LoteService.deletar(id);
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}

export default new loteController();
*/

// src/controllers/LoteController.ts

import { Response } from 'express';
import { AuthRequest } from '../middlewares/JWT/typeJWT'; // Sua interface de requisição autenticada
import LoteService from './service'; // Importando a instância da classe
import { createLoteBody, updateLoteBody } from './utils/reqValidate'; // Bodys Zod para validação
import { handleError } from '../utils/errorClass'; // Seu handler de erro global

// Instanciamos o serviço para usar em nosso controller.
const loteService = new LoteService();

class LoteController {
  /**
   * CREATE: Cria um novo lote.
   */
  async create(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id; // ID do usuário vem do token JWT.

      // 1. Valida e converte o corpo da requisição usando o Body Zod.
      const loteData = createLoteBody.parse(req.body);

      // 2. Chama o serviço com os dados já validados e tipados.
      const novoLote = await loteService.create(usuarioId, loteData);

      return res.status(201).json(novoLote);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * READ (All): Lista todos os lotes do usuário logado.
   */
  async getAll(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const lotes = await loteService.findAll(usuarioId);
      return res.status(200).json(lotes);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * READ (One): Busca um lote específico pelo ID.
   */
  async getById(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const loteId = parseInt(req.params.id, 10);

      if (isNaN(loteId)) {
        return res.status(400).json({ error: "ID do lote inválido." });
      }

      const lote = await loteService.findOne(usuarioId, loteId);
      return res.status(200).json(lote);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * UPDATE: Atualiza um lote existente.
   */
  async update(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const loteId = parseInt(req.params.id, 10);

      if (isNaN(loteId)) {
        return res.status(400).json({ error: "ID do lote inválido." });
      }

      // Valida os campos que estão sendo enviados para atualização.
      const loteData = updateLoteBody.parse(req.body);

      if (Object.keys(loteData).length === 0) {
        return res.status(400).json({ error: "Nenhum dado fornecido para atualização." });
      }

      const loteAtualizado = await loteService.update(usuarioId, loteId, loteData);
      return res.status(200).json(loteAtualizado);
    } catch (error) {
      return handleError(res, error);
    }
  }

  /**
   * DELETE: Deleta um lote.
   */
  async delete(req: AuthRequest, res: Response) {
    try {
      const usuarioId = req.user!.id;
      const loteId = parseInt(req.params.id, 10);

      if (isNaN(loteId)) {
        return res.status(400).json({ error: "ID do lote inválido." });
      }

      await loteService.delete(usuarioId, loteId);
      
      // Resposta padrão para delete bem-sucedido.
      return res.status(204).send();
    } catch (error) {
      return handleError(res, error);
    }
  }
}

export default new LoteController();
