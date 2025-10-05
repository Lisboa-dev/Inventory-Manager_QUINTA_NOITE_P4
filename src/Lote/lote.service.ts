import prisma from "../utils/prisma";

type LoteCreateDTO = {
  codigo: string;
  quantidade: number;
  dataValidade: string | Date;
  produtoId: number;
};

class LoteService {
  async listarTodos() {
    return prisma.lote.findMany({
      include: { produto: true },
    });
  }

  async buscarPorId(id: number) {
    return prisma.lote.findUnique({
      where: { id },
      include: { produto: true },
    });
  }

  async criar(data: LoteCreateDTO) {
    const parsedDate = new Date(data.dataValidade);
    if (isNaN(parsedDate.getTime())) throw new Error("Data inválida");

    return prisma.$transaction(async (tx) => {
      const produto = await tx.produto.findUnique({
        where: { id: data.produtoId },
      });
      if (!produto) throw new Error("Produto não encontrado");

      const lote = await tx.lote.create({
        data: {
          codigo: data.codigo,
          quantidade: data.quantidade,
          dataValidade: parsedDate,
          produtoId: data.produtoId,
        },
      });

      await tx.produto.update({
        where: { id: data.produtoId },
        data: { quantidadeEstoque: produto.quantidadeEstoque + data.quantidade },
      });

      return lote;
    });
  }

  async atualizar(id: number, dados: Partial<LoteCreateDTO>) {
    const lote = await prisma.lote.findUnique({ where: { id } });
    if (!lote) throw new Error("Lote não encontrado");

    return prisma.$transaction(async (tx) => {
      if (dados.quantidade !== undefined) {
        const diff = dados.quantidade - lote.quantidade;
        await tx.produto.update({
          where: { id: lote.produtoId },
          data: {
            quantidadeEstoque: {
              increment: diff,
            },
          },
        });
      }

      return tx.lote.update({
        where: { id },
        data: {
          codigo: dados.codigo,
          quantidade: dados.quantidade,
          dataValidade: dados.dataValidade
            ? new Date(dados.dataValidade)
            : undefined,
        },
      });
    });
  }

  async deletar(id: number) {
    const lote = await prisma.lote.findUnique({ where: { id } });
    if (!lote) throw new Error("Lote não encontrado");

    return prisma.$transaction(async (tx) => {
      await tx.produto.update({
        where: { id: lote.produtoId },
        data: {
          quantidadeEstoque: {
            decrement: lote.quantidade,
          },
        },
      });
      await tx.lote.delete({ where: { id } });
    });
  }
}

export default new LoteService();
