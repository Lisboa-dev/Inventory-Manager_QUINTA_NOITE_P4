type LoteCreateDTO = {
  codigo: string;
  quantidade: number;
  dataValidade: string | Date;
  produtoId: number;
};

export default LoteCreateDTO;