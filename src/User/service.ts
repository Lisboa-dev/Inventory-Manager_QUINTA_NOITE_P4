
import { Prisma, PrismaClient } from '@prisma/client';
import { CreateUserInput } from './utils/reqValidate'; // Importamos o tipo
import bcrypt from 'bcrypt';
import {generateToken} from './utils/JWT/generateJWT';
import { NotFoundError, ServiceError } from '../utils/errorClass';
import { toSafeUser } from './utils/serealizer';



const prisma = new PrismaClient();

class userService {
  // Recebe um objeto 'user' com tipos garantidos pelo Zod
 async create(user: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (existingUser) {
      // Use erros específicos para melhor tratamento no controller
      throw new ServiceError('Este e-mail já está em uso.', 409);
    }

    // 1. Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.senha, saltRounds);

    // 2. Cria o usuário com a senha hasheada
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        senha: hashedPassword, // Salva o hash, não a senha original
      },
    });
        return toSafeUser(newUser);
}


  async findById(id: number) {

    const user = await prisma.user.findUnique({ where: { id } });
    if (user) return toSafeUser(user);
    else {
      throw new NotFoundError("Usuário não encontrado.");
    }
  }



  
    async update(id: number, data: CreateUserInput) { // Use o tipo de update do Zod
        try {
            const updatedUser = await prisma.user.update({
                where: { id },
                data, // Passa os dados validados para atualização
            });
            return toSafeUser(updatedUser); // Retorna o usuário atualizado e seguro
        } catch (error) {
            // Captura o erro do Prisma se o usuário não for encontrado
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError("Usuário não encontrado.");
            }
            // Lança outros erros
            throw new ServiceError("Não foi possível atualizar o usuário.");
        }
    }
  
  



 
    async delete(id: number): Promise<void> { // Um delete bem-sucedido não precisa retornar nada
        try {
            await prisma.user.delete({ where: {  id } });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundError("Usuário não encontrado.");
            }
            throw new ServiceError("Não foi possível deletar o usuário.");
        }
    }

  

  

  async login(email: string, senha: string) {
    try{
      const user = await prisma.user.findUnique({ where: { email } });
      const senhaValida = user && await bcrypt.compare(senha, user.senha);
      if (user && senhaValida) {
        const token = generateToken({ uuid: user.uuid, email: user.email, nome:  user.name });
        const userSafe = toSafeUser(user);
        return{ user: userSafe, token };
      }else{
        return null;
      }
    }
    catch (error) {
      throw new Error('Erro ao buscar usuário.');
    }


  }
};

export default new userService;
