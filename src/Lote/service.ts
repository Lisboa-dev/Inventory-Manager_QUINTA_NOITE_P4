/*import { PrismaClient } from "@prisma/client";
import LoteCreateDTO from "./utils/LoteDTOs";
const prisma = new PrismaClient();



class LoteService {

  async listarTodos(userLogadoId: string) {
    let userId = await prisma.user.findUnique({ where: { uuid: userLogadoId } });
    if (!userId) throw new Error("Usuário não encontrado");

    return prisma.lote.findMany({
      include: { produto: true }, where: { usuarioId: userId.id }
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

*/


// src/services/LoteService.ts

import { Prisma, PrismaClient } from '@prisma/client';
import { ServiceError, NotFoundError } from '../utils/errorClass'; // Reutilizando os erros customizados
const prisma = new PrismaClient();

// Interface para os dados de criação e atualização para garantir a tipagem
interface LoteData {
  codigo: string;
  quantidade: number;
  dataValidade: Date;
  genreId: number;
}

export default class LoteService {
  /**
   * Cria um novo lote para o usuário.
   */
  async create(usuarioId: number, data: LoteData) {
    // Verifica se o gênero (setor) ao qual o lote será associado pertence ao usuário
    const genreExists = await prisma.genero.findFirst({
      where: { id: data.genreId, usuarioId },
    });

    if (!genreExists) {
      throw new NotFoundError("Setor não encontrado ou não pertence a este usuário.");
    }

    try {
      const novoLote = await prisma.lote.create({
        data: {
          ...data,
          usuarioId, // Associa o lote ao usuário logado
        },
      });
      return novoLote;
    } catch (error) {
      // P2003: Foreign key constraint failed (ex: genreId não existe)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundError("O setor (gênero) especificado não existe.");
      }
      throw new ServiceError("Não foi possível criar o lote.");
    }
  }

  /**
   * Lista todos os lotes de um usuário.
    */
  async findAll(usuarioId: number) {
    return prisma.lote.findMany({
      where: { usuarioId },
      include: {
        genre: { select: { id: true, nome: true } }, // Inclui informações do gênero
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Encontra um lote específico pelo seu ID.
    */
  async findOne(usuarioId: number, loteId: number) {
    const lote = await prisma.lote.findFirst({
      where: { id: loteId, usuarioId },
      include: {
        genre: true,
        produtos: true, // Inclui todos os produtos associados
      },
    });

    if (!lote) {
      throw new NotFoundError("Lote não encontrado ou não pertence a este usuário.");
    }
    return lote;
  }

  /**
   * Atualiza um lote existente.
    */
  async update(usuarioId: number, loteId: number, data: Partial<LoteData>) {
    // Primeiro, verifica se o lote que se quer atualizar realmente existe e pertence ao usuário
    const loteExists = await prisma.lote.count({
      where: { id: loteId, usuarioId },
    });

    if (loteExists === 0) {
      throw new NotFoundError("Lote não encontrado ou não pertence a este usuário.");
    }

    // Se o gênero está sendo alterado, verifica se o novo gênero também pertence ao usuário
    if (data.genreId) {
      const genreExists = await prisma.genero.count({
        where: { id: data.genreId, usuarioId },
      });
      if (genreExists === 0) {
        throw new NotFoundError("Novo setor não encontrado ou não pertence a este usuário.");
      }
    }

    try {
      return await prisma.lote.update({
        where: { id: loteId },
        data,
      });
    } catch (error) {
      throw new ServiceError("Não foi possível atualizar o lote.");
    }
  }

  /**
   * Deleta um lote.
    */
  async delete(usuarioId: number, loteId: number): Promise<void> {
    try {
      const result = await prisma.lote.deleteMany({
        where: { id: loteId, usuarioId },
      });

      // deleteMany não lança erro se nada for deletado, então verificamos o 'count'
      if (result.count === 0) {
        throw new NotFoundError("Lote não encontrado ou não pertence a este usuário.");
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ServiceError("Não foi possível deletar o lote.");
    }
  }
};
