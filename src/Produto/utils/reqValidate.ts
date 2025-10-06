
import { z } from 'zod';

export const produtoCreateSchema = z.object({
  // --- Campo 'nome' ---
  nome: z.string({
    required_error: "O nome do produto é obrigatório.",
    invalid_type_error: "O nome do produto deve ser um texto.",
  }).min(3, { message: "O nome do produto deve ter pelo menos 3 caracteres." }),

  // --- Campo 'descricao' (Opcional) ---
  // O .optional() corresponde ao '?' no seu tipo DTO.
  descricao: z.string({
    invalid_type_error: "A descrição deve ser um texto.",
  }).optional(),

  // --- Campo 'preco' ---
  // z.coerce.number é ideal aqui, pois converte uma string (comum em JSON) para número.
  preco: z.coerce.number({
    required_error: "O preço é obrigatório.",
    invalid_type_error: "O preço deve ser um número válido.",
  }).positive({ message: "O preço deve ser um valor positivo." })
    .multipleOf(0.01, { message: "O preço deve ter no máximo duas casas decimais." }), // Validação extra para formato monetário

  // --- Campo 'barCode' ---
  barCode: z.string({
    required_error: "O código de barras é obrigatório.",
    invalid_type_error: "O código de barras deve ser um texto.",
  }).min(1, { message: "O código de barras não pode estar em branco." }),

  // --- Campo 'loteId' ---
  loteId: z.number({
    required_error: "O ID do lote é obrigatório.",
    invalid_type_error: "O ID do lote deve ser um número.",
  }).int({ message: "O ID do lote deve ser um número inteiro." })
    .positive({ message: "O ID do lote deve ser um número positivo." }),
});

export const updateProdutoBody = createProdutoBody.partial();

export type CreateProdutoInput = z.infer<typeof createProdutoBody>;
export type UpdateProdutoInput = z.infer<typeof updateProdutoBody>;

// src/schemas/produto.schemas.ts
/*
import { z } from 'zod';

// Esquema Zod que valida e corresponde ao seu ProdutoCreateDTO
export const produtoCreateSchema = z.object({
  // --- Campo 'nome' ---
  nome: z.string({
    required_error: "O nome do produto é obrigatório.",
    invalid_type_error: "O nome do produto deve ser um texto.",
  }).min(3, { message: "O nome do produto deve ter pelo menos 3 caracteres." }),

  // --- Campo 'descricao' (Opcional) ---
  // O .optional() corresponde ao '?' no seu tipo DTO.
  descricao: z.string({
    invalid_type_error: "A descrição deve ser um texto.",
  }).optional(),

  // --- Campo 'preco' ---
  // z.coerce.number é ideal aqui, pois converte uma string (comum em JSON) para número.
  preco: z.coerce.number({
    required_error: "O preço é obrigatório.",
    invalid_type_error: "O preço deve ser um número válido.",
  }).positive({ message: "O preço deve ser um valor positivo." })
    .multipleOf(0.01, { message: "O preço deve ter no máximo duas casas decimais." }), // Validação extra para formato monetário

  // --- Campo 'barCode' ---
  barCode: z.string({
    required_error: "O código de barras é obrigatório.",
    invalid_type_error: "O código de barras deve ser um texto.",
  }).min(1, { message: "O código de barras não pode estar em branco." }),

  // --- Campo 'loteId' ---
  loteId: z.number({
    required_error: "O ID do lote é obrigatório.",
    invalid_type_error: "O ID do lote deve ser um número.",
  }).int({ message: "O ID do lote deve ser um número inteiro." })
    .positive({ message: "O ID do lote deve ser um número positivo." }),
});

// (Opcional, mas recomendado) Inferir o tipo a partir do esquema Zod.
// Isso garante que sua "fonte da verdade" seja o esquema, não o tipo manual.
export type ProdutoCreateInput = z.infer<typeof produtoCreateSchema>;

