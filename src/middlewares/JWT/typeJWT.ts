import { Request } from 'express';

export interface UserPayload {
  uuid: string;
  email: string;
  nome: string;
}

export interface ResolvedUser extends UserPayload {
  id: number; // O ID sequencial do banco de dados
}
export interface PartialAuthRequest extends Request {
  user?: UserPayload; 
}

export interface AuthRequest extends Request {
  user?: ResolvedUser;
}



