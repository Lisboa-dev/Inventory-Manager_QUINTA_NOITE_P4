// src/user/user.controller.ts
import { Request, Response } from 'express';
import userService from './service';
import type { CreateUserBody } from './utils/createUserDTO'; // Importa o tipo para tipar a requisição

class userController {





  async create(req: Request<{}, {}, CreateUserBody>, res: Response) {
    try {
      // O corpo (req.body) já foi validado pelo middleware na rota
      // e agora está totalmente tipado como 'CreateUserBody'
      const newUser = await userService.create(req.body);

      return res.status(201).json(newUser);
    } catch (error: any) {
      // Se o serviço lançar um erro (ex: e-mail duplicado), o controller o captura
      return res.status(400).json({ message: error.message });
    }
  }





  async login(req: Request, res: Response) {
   
  }





  async update(req: Request, res: Response) { 

    }




  async delete(req: Request, res: Response) {
     res.status(501).json({ message: "delete não implementado." });
  }






  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    const user = await userService.findById(id);
    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }
    return res.status(200).json(user);
  }
};

export default new userController();
