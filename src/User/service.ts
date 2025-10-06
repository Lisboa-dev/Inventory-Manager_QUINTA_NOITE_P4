
import { PrismaClient } from '@prisma/client';
import { CreateUserBody } from './utils/createUserDTO'; // Importamos o tipo
import bcrypt from 'bcrypt';
import {generateToken} from './utils/JWT/generateJWT';



const prisma = new PrismaClient();

class userService {
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
      data: {
        name: user.name,
        email: user.email,
        senha: user.senha, // Certifique-se de que 'senha' está presente em CreateUserBody
      },
    });

    return newUser;
  }

  async findById(id: number) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

 async delete(id: number) {
    await prisma.user.delete({ where: { id } });
    return { message: 'Usuário deletado com sucesso.' };
  }

  async login(email: string, senha: string) {
    try{
      const user = await prisma.user.findUnique({ where: { email } });
      const senhaValida = user && await bcrypt.compare(senha, user.senha);
      if (user && senhaValida) {
        const token = generateToken({ id: user.id.toString(), email: user.email });
        const { senha, ...userWithoutSenha } = user;
        return userWithoutSenha;
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
