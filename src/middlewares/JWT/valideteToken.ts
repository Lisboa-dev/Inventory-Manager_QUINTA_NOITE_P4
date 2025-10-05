import jwt from 'jsonwebtoken';
import { UserPayload } from './typeJWT';

/**
 * Verifica e decodifica um token JWT.
 * @param token O token JWT a ser verificado.
 * @returns O payload do usuário se o token for válido, ou null se for inválido/expirado.
 * 
 */

const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_jwt_key_dev';

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return null;
  }
}