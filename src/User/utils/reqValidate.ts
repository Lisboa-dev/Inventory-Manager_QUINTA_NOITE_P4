
// src/schemas/auth.schemas.ts

import { z } from 'zod';

// Esquema para o corpo da requisição de CRIAÇÃO de usuário
// Representa diretamente a estrutura de req.body
export const createUserBody = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.email({ message: "Formato de e-mail inválido." }),
  senha: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres." }),
});

// Esquema para o corpo da requisição de LOGIN
export const loginBody = z.object({
  email: z.email({ message: "Formato de e-mail inválido." }),
  senha: z.string().min(1, { message: "A senha é obrigatória." }),
});

// Inferimos os tipos para uso nos serviços
export type CreateUserInput = z.infer<typeof createUserBody>;
export type LoginInput = z.infer<typeof loginBody>;
