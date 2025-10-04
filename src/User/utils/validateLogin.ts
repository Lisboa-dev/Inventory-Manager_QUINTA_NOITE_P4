import { Request } from 'express';

export interface UserPayload {
  id: string;
  email: string;
  // Adicione outras propriedades do usuário que deseja incluir no token
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}