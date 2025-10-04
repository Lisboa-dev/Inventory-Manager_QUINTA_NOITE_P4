
import { z } from 'zod';

// Esquema para validar o corpo da requisição de criação de usuário
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres.").nonempty("O nome é obrigatório."),
    email: z.string().email("Formato de e-mail inválido.").nonempty("O e-mail é obrigatório."),
  }),
});

// Inferimos o tipo do corpo da requisição a partir do esquema
export type CreateUserBody = z.infer<typeof createUserSchema>['body'];