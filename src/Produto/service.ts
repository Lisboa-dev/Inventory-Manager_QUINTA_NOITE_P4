

// src/services/ProdutoService.ts

import { Prisma, PrismaClient } from '@prisma/client';
import { CreateProdutoInput, UpdateProdutoInput } from './utils/produtoDTOs';
import { ServiceError, NotFoundError } from '../utils/errorClass';

const prisma = new PrismaClient();
class ProdutoService {
  /**
   * Cria um novo produto, garantindo que o lote associado pertence ao usuário.
   */
  async create(usuarioId: number, data: CreateProdutoInput) {
    // 1. VERIFICAÇÃO DE PERMISSÃO: Garante que o lote pertence ao usuário.
    // Isso impede que um usuário crie um produto em um lote de outro usuário.
    const loteExists = await prisma.lote.findFirst({
      where: {
        id: data.loteId,
        usuarioId: usuarioId,
      },
    });

    if (!loteExists) {
      throw new NotFoundError("Lote não encontrado ou não pertence a este usuário.");
    }

    // 2. CRIAÇÃO DO PRODUTO
    try {
      const novoProduto = await prisma.produto.create({
        data: {
          ...data,
          usuarioId, // Associa o produto diretamente ao usuário logado.
        },
      });
      return novoProduto;
    } catch (error) {
      // Trata erros de chave estrangeira, caso o lote seja deletado entre a verificação e a criação.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new NotFoundError("O lote especificado não existe mais.");
      }
      throw new ServiceError("Não foi possível criar o produto.");
    }
  }

  /**
   * Lista todos os produtos pertencentes a um usuário.
   */
  async findAll(usuarioId: number) {
    return prisma.produto.findMany({
      where: { usuarioId },
      include: {
        lote: { select: { id: true, codigo: true } }, // Inclui informações úteis do lote.
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Encontra um produto específico pelo seu ID, garantindo que ele pertence ao usuário.
   */
  async findOne(usuarioId: number, produtoId: number) {
    const produto = await prisma.produto.findFirst({
      where: {
        id: produtoId,
        usuarioId: usuarioId,
      },
      include: {
        lote: true, // Inclui o objeto completo do lote.
      },
    });

    if (!produto) {
      throw new NotFoundError("Produto não encontrado ou não pertence a este usuário.");
    }
    return produto;
  }

  /**
   * Atualiza um produto existente.
   */
  async update(usuarioId: number, produtoId: number, data: UpdateProdutoInput) {
    // 1. VERIFICAÇÃO DE PERMISSÃO: Garante que o produto a ser atualizado pertence ao usuário.
    // Usamos 'count' para ser mais leve que buscar o objeto inteiro.
    const produtoCount = await prisma.produto.count({
      where: { id: produtoId, usuarioId },
    });

    if (produtoCount === 0) {
      throw new NotFoundError("Produto não encontrado ou não pertence a este usuário.");
    }

    // 2. (Opcional) Se o lote está sendo alterado, verifica se o novo lote também pertence ao usuário.
    if (data.loteId) {
      const loteCount = await prisma.lote.count({
        where: { id: data.loteId, usuarioId },
      });
      if (loteCount === 0) {
        throw new NotFoundError("Novo lote não encontrado ou não pertence a este usuário.");
      }
    }

    // 3. ATUALIZAÇÃO DO PRODUTO
    try {
      const produtoAtualizado = await prisma.produto.update({
        where: { id: produtoId },
        data,
      });
      return produtoAtualizado;
    } catch (error) {
      // O erro P2025 do Prisma já é tratado pela nossa verificação inicial, mas é bom mantê-lo por segurança.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundError("Produto não encontrado.");
      }
      throw new ServiceError("Não foi possível atualizar o produto.");
    }
  }

  /**
   * Deleta um produto.
   */
  async delete(usuarioId: number, produtoId: number): Promise<void> {
    // Usamos deleteMany com uma cláusula 'where' composta para garantir que o usuário
    // só possa deletar um produto que lhe pertence.
    const result = await prisma.produto.deleteMany({
      where: {
        id: produtoId,
        usuarioId: usuarioId,
      },
    });

    // Se nenhum registro foi deletado, significa que o produto não foi encontrado ou não pertencia ao usuário.
    if (result.count === 0) {
      throw new NotFoundError("Produto não encontrado ou não pertence a este usuário.");
    }
  }
}

export default new ProdutoService();
