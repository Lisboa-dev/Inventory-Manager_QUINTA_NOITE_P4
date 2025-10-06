
type ProdutoCreateDTO = {
  nome: string;
  descricao?: string;
  preco: number;
  quantidadeEstoque?: number;
};

export default ProdutoCreateDTO;