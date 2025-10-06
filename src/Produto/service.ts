import type ProdutoCreateDTO from './utils/produtoCreateDTO';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


class ProdutoService {
  async listarTodos() {
    return prisma.produto.findMany({
      include: { lotes: true },
    });
  }

  async buscarPorId(id: number) {
    return prisma.produto.findUnique({
      where: { id },
      include: { lotes: true },
    });
  }

  async criar(data: ProdutoCreateDTO) {
    if (!data.nome) throw new Error("Nome é obrigatório");
    if (data.preco == null || data.preco < 0)
      throw new Error("Preço inválido");

    return prisma.produto.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        quantidadeEstoque: data.quantidadeEstoque ?? 0,
      },
    });
  }

  async atualizar(id: number, dados: Partial<ProdutoCreateDTO>) {
    return prisma.produto.update({
      where: { id },
      data: dados,
    });
  }

  async deletar(id: number) {
    await prisma.lote.deleteMany({ where: { produtoId: id } });
    await prisma.produto.delete({ where: { id } });
  }
}

export default new ProdutoService();
