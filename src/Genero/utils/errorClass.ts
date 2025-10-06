
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