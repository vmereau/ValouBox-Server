import { FrontError } from '../core/errors';
import { HttpException, HttpStatus } from "@nestjs/common";

export class IncorrectCredentialsError extends FrontError {
  constructor() {
    super('Identifiants invalides');
  }
}

export class UnauthorizedUserError extends HttpException {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED);
  }
}
