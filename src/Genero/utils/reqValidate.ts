// src/schemas/genero.schemas.ts
import { z } from 'zod';
import { _undefined } from 'zod/v4/core';

export const createGeneroBody = z.object({
  nome: z.string({ error: (issue)=>issue.code === undefined? "O nome é obrigatório.":"O nome é invalído" }).min(1, { message: "O nome não pode estar em branco." }),
  // O campo 'pai' é um número inteiro positivo e é OPCIONAL.
  pai: z.number().int().positive().optional(),
});
