
export type ProdutoCreateDTO = {
  nome: string;
  descricao?: string;
  preco: number;
  barCode: string;
  loteId: number;
};

// src/schemas/produto.schemas.ts
export type CreateProdutoInput = ProdutoCreateDTO;
export type UpdateProdutoInput = Partial<ProdutoCreateDTO>;