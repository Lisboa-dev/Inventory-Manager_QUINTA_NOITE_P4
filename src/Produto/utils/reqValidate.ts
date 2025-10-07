// src/schemas/produto.schemas.ts

import { z } from 'zod';

export const produtoCreateBody = z.object({
  // --- Campo 'nome' ---
  nome: z.string({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.input === undefined) return "O nome é obrigatório.";
        return "O nome deve ser um texto.";
      }
      // Retorna a mensagem padrão do Zod para outros erros (como .min())
      return { message: issue.message || "Erro de validação no nome." };
    }
  }).min(3, { message: "O nome do produto deve ter pelo menos 3 caracteres." }),

  // --- Campo 'descricao' (Opcional) ---
  descricao: z.string({
    error: (issue) => {
      // Para campos opcionais, não precisamos verificar 'undefined'.
      // Apenas o tipo, se o campo for fornecido.
      if (issue.code === "invalid_type") {
        return "A descrição deve ser um texto.";
      }
      return { message: issue.message || "Erro na descrição." };
    }
  }).optional(),

  // --- Campo 'preco' ---
  preco: z.coerce.number({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.input === undefined) return "O preço é obrigatório.";
        if (issue.input === null) return "O preço não pode ser nulo.";
        return "O preço deve ser um número válido.";
      }
      return { message: issue.message || "O preço deve ser um número válido." };
    }
  })
  .positive({ message: "O preço deve ser um valor positivo." })
  .multipleOf(0.01, { message: "O preço deve ter no máximo duas casas decimais." }),

  // --- Campo 'barCode' (CORRIGIDO) ---
  barCode: z.string({
    // Substituímos as propriedades antigas por esta função
    error: (issue) => {
      if (issue.code === "invalid_type") {
        // Se o campo não foi fornecido
        if (issue.input === undefined) {
          return "O código de barras é obrigatório.";
        }
        // Se o campo foi fornecido, mas não é uma string (ex: barCode: 123)
        return "O código de barras deve ser um texto.";
      }
      // Para outros erros (como o .min() abaixo), usa a mensagem padrão deles
      return { message: issue.message || "Erro no código de barras." };
    }
  }).min(1, { message: "O código de barras não pode estar em branco." }),

  // --- Campo 'loteId' ---
  loteId: z.number({
    error: (issue) => {
      if (issue.code === "invalid_type") {
        if (issue.input === undefined) return "O ID do lote é obrigatório.";
        if (issue.input === null) return "O ID do lote não pode ser nulo.";
        return "O ID do lote deve ser um número válido.";
      }
      return { message: issue.message || "O ID do lote deve ser um número válido." };
    }
  })
  .int({ message: "O ID do lote deve ser um número inteiro." })
  .positive({ message: "O ID do lote deve ser um número positivo." }),
});

// --- Correção nos nomes para evitar erros de referência ---
// Note que os tipos devem ser inferidos dos Bodys corretos.
export const updateProdutoBody = produtoCreateBody.partial();

export type CreateProdutoInput = z.infer<typeof produtoCreateBody>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoBody>;

