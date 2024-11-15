import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { DataSource } from 'typeorm';
import { GqlContextType } from "@nestjs/graphql";

@Injectable()
export class TypeormTransactionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TypeormTransactionInterceptor.name);

  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {

    if(context.getType<GqlContextType>() === "graphql"){
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    req.queryRunner = queryRunner;
    req.em = queryRunner.manager;

    return next.handle().pipe(
      tap(() => {
        queryRunner
          .commitTransaction()
          .catch((e: Error) =>
            this.logger.error(`Could not commit transaction: ${e.toString()}`),
          )
          .finally(() =>
            queryRunner
              .release()
              .catch((e: Error) =>
                this.logger.error(
                  `Could not release connection: ${e.toString()}`,
                ),
              ),
          );
      }),
      catchError((e) => {
        queryRunner
          .rollbackTransaction()
          .catch((rollbackError: Error) =>
            this.logger.error(
              `Could not rollback transaction: ${rollbackError.toString()}`,
            ),
          )
          .finally(() =>
            queryRunner
              .release()
              .catch((e: Error) =>
                this.logger.error(
                  `Could not release connection: ${e.toString()}`,
                ),
              ),
          );

        return throwError(e);
      }),
    );
  }
}
