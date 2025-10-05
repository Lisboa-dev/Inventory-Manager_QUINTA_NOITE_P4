import jwt from 'jsonwebtoken';
import { UserPayload } from '../../../middlewares/JWT/typeJWT';

// Carrega a chave secreta do ambiente. Use uma chave forte e segura em produção.
// Para desenvolvimento, um valor padrão é fornecido, mas NUNCA use em produção.
const SECRET_KEY = process.env.JWT_SECRET || 'super_secret_jwt_key_dev';

/**
 * Gera um token JWT para um dado payload de usuário.
 * @param user O payload do usuário a ser incluído no token.
 * @returns O token JWT assinado.
 */
export function generateToken(user: UserPayload): string {
  // O token expira em 1 hora. Ajuste conforme a necessidade da sua aplicação.
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  return token;
}

