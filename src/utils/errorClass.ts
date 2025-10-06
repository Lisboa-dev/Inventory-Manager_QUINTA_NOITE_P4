
import { Response } from 'express';

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
    throw new Error('Function not implemented.');
}
