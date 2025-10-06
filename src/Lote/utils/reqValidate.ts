// src/schemas/lote.schemas.ts

// src/schemas/lote.schemas.ts

import { z } from 'zod';

// Esquema para a criação de um lote.
export const createLoteBody = z.object({
  codigo: z.string().min(1, "O código é obrigatório."),
  quantidade: z.number().int().positive("A quantidade deve ser um número inteiro positivo."),
  // z.coerce.date tenta converter uma string (do JSON) para um objeto Date.
   dataValidade: z.preprocess(
    (val) => (typeof val === "string" || val instanceof Date ? new Date(val) : val),
    z.date()
  ).refine(
    (d) => d instanceof Date && !isNaN(d.getTime()),
    { message: "Formato de data de validade inválido." }
  ),

  genreId: z.number().int().positive("O ID do setor (gênero) é obrigatório."),
});

// Esquema para a atualização de um lote (todos os campos são opcionais).
export const updateLoteBody = createLoteBody.partial();

// Inferimos os tipos para uso nos serviços, se necessário.
export type CreateLoteInput = z.infer<typeof createLoteBody>;
export type UpdateLoteInput = z.infer<typeof updateLoteBody>;
