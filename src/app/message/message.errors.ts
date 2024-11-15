import { FrontError } from "../core/errors";

export class UknownUserError extends FrontError {
  constructor() {
    super("User ID does not exists");
  }
}

export class UknownChannelError extends FrontError {
  constructor() {
    super("Channel ID does not exists");
  }
}
