// src/middlewares/userResolverMiddleware.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from './JWT/typeJWT';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function userResolverMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // Este middleware deve rodar DEPOIS do middleware de autenticação.
  // Se 'req.user' ou 'req.user.uuid' não existem, algo está errado na ordem dos middlewares.
  if (!req.user || !req.user.uuid) {
    return res.status(401).json({ error: "Não autorizado: Token inválido ou ausente." });
  }

  try {
    const { uuid } = req.user;

    // Busca o usuário no banco de dados usando o UUID para encontrar o ID sequencial.
    const userFromDb = await prisma.user.findUnique({
      where: { uuid },
      select: { id: true }, // Seleciona apenas o campo 'id' para máxima eficiência.
    });

    if (!userFromDb) {
      return res.status(401).json({ error: "Não autorizado: Usuário do token não encontrado no sistema." });
    }

    // Anexa o ID sequencial ao objeto req.user.
    // Agora, req.user contém { uuid, email, id }.
    req.user.id = userFromDb.id;

    // Passa para o próximo middleware ou para o controller.
    next();

  } catch (error) {
    console.error("Erro ao resolver o ID do usuário:", error);
    return res.status(500).json({ error: "Erro interno ao processar a autenticação." });
  }
}
