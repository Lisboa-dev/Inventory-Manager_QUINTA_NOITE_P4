type LoteCreateDTO = {
  codigo: string;
  quantidade: number;
  dataValidade: string; 
  generoId?: number; 
};

export default LoteCreateDTO;