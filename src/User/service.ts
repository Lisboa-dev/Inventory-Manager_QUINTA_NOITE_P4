
// src/user/user.service.ts
import { PrismaClient } from '@prisma/client';
// Adjust the import path as needed; example assumes validate.ts is in src/utils/
import { CreateUserBody } from '/utils/validate'; // Importamos o tipo

const prisma = new PrismaClient();

export const userService = {
  // Recebe um objeto 'user' com tipos garantidos pelo Zod
  async create(user: CreateUserBody) {
    // Verifica se o usuário já existe (exemplo de lógica de negócio)
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new Error('Este e-mail já está em uso.');
    }

    // Cria o usuário no banco de dados
    const newUser = await prisma.user.create({
      data: user,
    });

    return newUser;
  },

  async findById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }
};
