// src/user/user.controller.ts
import { Request, Response } from 'express';
import userService from './service';
import { createUserBody, loginBody } from './utils/reqValidate'; // Importa o tipo para tipar a requisição
import { AuthRequest } from '../middlewares/JWT/typeJWT.js';
import { handleError } from '../utils/errorClass';

class userController {


  async create(req: Request, res: Response) {
    try {
      // 1. VALIDAÇÃO PRIMEIRO: Consistente com o método create.
      const user  = createUserBody.parse(req.body);

      // 2. CHAMA O SERVIÇO: Passa os dados primitivos validados.
      const result = await userService.create(user);

      return res.status(200).json(result);
    } catch (error) {
      return handleError(res, error);
    }
  }





  async login(req: Request, res: Response) {
    try {
      // 1. Validar o corpo da requisição com Zod
      const { email, senha } = loginBody.parse(req.body);

      // 2. Chamar o serviço de autenticação
      const result = await userService.login(email, senha);

      // 3. Enviar a resposta de sucesso com os dados do usuário e o token
      return res.status(200).json(result);
    } catch (error) {
      // O handleError já sabe como lidar com NotFoundError (retornando 404)
      // e erros Zod (retornando 400).
      return handleError(res, error);
    }
  }
   






  async update(req: AuthRequest, res: Response) { 
     
    try {
    // O usuário só pode atualizar a si mesmo. O ID vem do token, não dos params.
    const userId = req.user!.id;
    
    // Valida os dados que estão sendo enviados para atualização.
    const userData = createUserBody.parse(req.body);

    // Garante que o cliente não enviou um corpo vazio.
    if (Object.keys(userData).length === 0) {
      return res.status(400).json({ error: "Nenhum dado fornecido para atualização." });
    }

    const updatedUser = await userService.update(userId, userData);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return handleError(res, error);
  }

    }




  async delete(req: AuthRequest, res: Response) {
      try {
    // O usuário só pode deletar a si mesmo.
    const userId = req.user!.id;
    
    await userService.delete(userId );
    // Sucesso em um delete resulta em 204 No Content, sem corpo na resposta.
    return res.json({"message":"deleção concluida com sucesso"})
  } catch (error) {
    return handleError(res, error);
  }
  }






  async getById(req: AuthRequest, res: Response) {
     try {
    const userId = req.user?.id;
    if (!userId ) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    // Confia que o serviço vai lançar um erro se o usuário não for encontrado.
    const user = await userService.findById(userId);
    
    return res.status(200).json(user);
  } catch (error) {
    // O handleError captura o NotFoundError do serviço e retorna 404.
    return handleError(res, error);
  }
}
}

export default new userController();

