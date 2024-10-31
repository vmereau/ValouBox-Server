
## ValouBox Server

[Nest](https://github.com/nestjs/nest) based back-end for the ValouBox real time chat web application.
I did this side project mainly to discover how NestJs websockets works.

Features:
 - PostgreSQL database with TypeORM and migrations
 - transaction interceptor to have 1 database transaction per endpoint call

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Shortcuts

Generate a migration file based on entity differences:
```bash
$ npm run typeorm:generate-migration ./src/database/migrations/{migrationName}
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
