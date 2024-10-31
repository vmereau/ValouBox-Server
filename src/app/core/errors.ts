import { HttpException, HttpStatus } from '@nestjs/common';

export class FrontError extends HttpException {
  constructor(reason: string, field = '', fieldError = '') {
    super(
      {
        content: { reason, field, fieldError },
        statusCode: HttpStatus.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
