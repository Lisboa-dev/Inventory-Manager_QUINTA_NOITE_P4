import {  Response } from 'express';
import { Prisma } from '@prisma/client';
import generoService from './service';
import { AuthRequest } from '../middlewares/JWT/typeJWT';
import { createGeneroBody }  from './utils/reqValidate';
import { isNumberObject } from 'util/types';



class generoController {

   
    async getAll (req: AuthRequest, res: Response){
        const usuarioLogadoId = req.user?.id;
        if (usuarioLogadoId) {
            try {
                // Abordagem 1: Retornar a lista "flat" (plana) e deixar o frontend montar a árvore
                const todosOsGeneros = await generoService.list(usuarioLogadoId);
                res.json(todosOsGeneros);

            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "Não foi possível buscar os setores." });
            }
      }
    };

  
  
  async getById(req: AuthRequest, res: Response){
    const usuarioLogadoId = req.user?.id;
    const id = Number(req.params.id);
    if (!usuarioLogadoId) {
        return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
        const genero = await generoService.getById(usuarioLogadoId, id);

        if (!genero) {
            return res.status(404).json({ error: "Setor não encontrado." });
        }

        res.json(genero);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível buscar o setor." });
    }
  };

  






   async create(req: AuthRequest, res: Response){
       
        const { nome, pai } = createGeneroBody.parse(req.body);
    
        const usuarioLogadoId = req.user?.id;

        if (!usuarioLogadoId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

       try{
        const data = await generoService.create(usuarioLogadoId, nome, pai);
        res.status(201).json(data);

       }catch (error) {
        console.error(error);
        res.status(500).json({ error: "Não foi possível criar o setor." });
       }
   };







   
   // PUT /generos/:id
  async update(req: AuthRequest, res: Response){
        const usuarioLogadoId = req.user?.id;

        const id = Number(req.params.id);
        const { name, pai } = req.body;

        // Prevenção de um nó se tornar seu próprio pai
        if (id === pai) {
            return res.status(400).json({ error: "Um setor não pode ser pai de si mesmo." });
        }
        if (!usuarioLogadoId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        try {
            const atualizado = await generoService.update(usuarioLogadoId, { id, name, pai });
            res.json(atualizado);
        } catch (error) {
            // Erro comum: o registro a ser atualizado não foi encontrado (ou não pertence ao usuário)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: "Setor não encontrado." });
            }
            console.error(error);
            res.status(500).json({ error: "Não foi possível atualizar o setor." });
        }
   };



  
    async delete(req: AuthRequest, res: Response){
        const usuarioLogadoId = req.user?.id;
        const id = parseInt(req.params.id, 10);

        if (isNaN(id)) {
          return res.status(400).json({ message: "O ID fornecido na URL é inválido. Deve ser um número." });
       }



        if (!usuarioLogadoId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

       try {
            await generoService.delete(usuarioLogadoId, id);
            res.status(204).send("genero deletado");
        } catch (error) {  
            // Erro comum: o registro a ser deletado não foi encontrado (ou não pertence ao usuário)
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                return res.status(404).json({ error: "Setor não encontrado." });
            }
        }
    }

}

export default new generoController();