import { FrontError } from '../core/errors';

export class IncorrectCredentialsError extends FrontError {
  constructor() {
    super('Identifiants invalides');
  }
}
