import { Response, NextFunction } from 'express';
import { verifyToken } from './valideteToken';
import { PartialAuthRequest} from './typeJWT';

/**
 * Middleware para autenticar requisições usando JWT.
 * Verifica se um token JWT válido está presente no cabeçalho 'Authorization'.
 * Se for válido, anexa o payload do usuário à requisição (req.user).
 * @param req Objeto de requisição Express estendido com UserPayload opcional.
 * @param res Objeto de resposta Express.
 * @param next Função para passar o controle para o próximo middleware.
 */
export const authenticateToken = (req: PartialAuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera o formato 'Bearer TOKEN'

  if (token == null) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' }); // Não autorizado
  }

  const user = verifyToken(token);

  if (user == null) {
    return res.status(403).json({ message: 'Token inválido ou expirado.' }); // Token inválido ou expirado
  }

  req.user = user; // Anexa o payload do usuário à requisição
  next(); // Continua para a próxima função de middleware/rota
};