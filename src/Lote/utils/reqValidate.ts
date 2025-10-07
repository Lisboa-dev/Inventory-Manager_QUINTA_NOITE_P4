// src/schemas/lote.schemas.ts

/// src/schemas/lote.schemas.ts

import { z } from 'zod';

// Esquema Zod que valida e corresponde ao seu LoteCreateDTO, usando error maps.
export const loteCreateBody= z.object({
  
  // --- Campo 'codigo' ---
  codigo: z.string({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.input === undefined) return "O código do lote é obrigatório.";
        return "O código do lote deve ser um texto.";
      }
      return { message: issue.message || "Erro no código do lote." };
    }
  }).min(1, { message: "O código do lote não pode estar em branco." }),

  // --- Campo 'quantidade' ---
  quantidade: z.coerce.number({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.input === undefined) return "A quantidade é obrigatória.";
        if (issue.input === null) return "A quantidade não pode ser nula.";
        return "A quantidade deve ser um número válido.";
      }
      return { message: issue.message || "Erro na quantidade." };
    }
  })
  .int({ message: "A quantidade deve ser um número inteiro." })
  .min(0, { message: "A quantidade não pode ser negativa." }),

  // --- Campo 'dataValidade' ---
  dataValidade: z.coerce.date({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.input === undefined) return "A data de validade é obrigatória.";
        if (issue.input === null) return "A data de validade não pode ser nula.";
        return "O formato da data de validade é inválido.";
      }
      return { message: issue.message || "Erro na data de validade." };
    }
  }),


    genreId: z.number({
    error: (issue) => {
      // Verifica se o erro é de tipo inválido
      if (issue.code === "invalid_type") {
        // Se o campo não foi fornecido
        if (issue.input === undefined) {
          return "O ID do setor (gênero) é obrigatório.";
        }
        // Se o campo foi fornecido como nulo
        if (issue.input === null) {
          return "O ID do setor (gênero) não pode ser nulo.";
        }
        // Se o campo foi fornecido, mas com o tipo errado (ex: "texto")
        return "O ID do setor (gênero) deve ser um número.";
      }
      // Fallback para outros erros (como .int() ou .positive())
      return { message: issue.message || "Erro no ID do setor." };
    }
  })
  .int({ message: "O ID do setor deve ser um número inteiro." })
  .positive({ message: "O ID do setor deve ser um número positivo." }),
});

// (Opcional, mas recomendado) Inferir o tipo a partir do esquema Zod.
export type LoteCreateInput = z.infer<typeof loteCreateBody>;
