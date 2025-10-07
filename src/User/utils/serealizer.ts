import { User } from '@prisma/client'; // Importe o tipo 'User' gerado pelo Prisma

/**
 * Remove campos sensíveis (como 'senha') de um objeto de usuário.
 * @param user O objeto de usuário completo, vindo do Prisma.
 * @returns Um novo objeto de usuário sem os campos sensíveis.
 */
export const toClearUser = (user: User) => {
  // Usa a desestruturação para separar a 'senha' e coletar o resto (`...`)
 
  const { senha, uuid, createdAt,  ...clearUser } = user;
 
  return clearUser;}

export const toSafeUser = (user: User) => {
  // Usa a desestruturação para separar a 'senha' e coletar o resto (`...`)
 
  const { senha, id, ...safeUser } = user;
 
  return safeUser;}