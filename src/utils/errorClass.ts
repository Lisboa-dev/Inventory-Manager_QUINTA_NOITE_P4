
import { Response } from 'express';
import { ZodError } from 'zod';

export class ServiceError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string) {
    super(message, 404);
  }
}

export function handleError(res: Response<any, Record<string, any>>, error: unknown) {
   // **PASSO ESSENCIAL DE DEBUG:** Logue o erro REAL no console.
  console.error("--- ERRO CAPTURADO ---");
  console.error(error);
  console.error("----------------------");

  // Trata erros de validação do Zod
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Erro de validação nos dados enviados.",
      errors: error.flatten().fieldErrors,
    });
  }

  // Trata o erro "Não Encontrado"
  if (error instanceof NotFoundError) {
    return res.status(404).json({ message: error.message });
  }

  // Trata outros erros de serviço conhecidos
  if (error instanceof ServiceError) {
    return res.status(400).json({ message: error.message });
  }

  // **A CORREÇÃO DEFINITIVA ESTÁ AQUI**
  // Para qualquer outro erro que não conhecemos, enviamos uma resposta 500
  // e impedimos que o servidor trave.
  return res.status(500).json({
    message: "Ocorreu um erro interno inesperado no servidor.",
  });
};

