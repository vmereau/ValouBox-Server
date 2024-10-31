import { FrontError } from "../core/errors";

export class UserCreationError extends FrontError {
  constructor() {
    super('Vous devez renseigner le mot de passe et le username.');
  }
}
