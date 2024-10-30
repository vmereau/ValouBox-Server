import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as fs from 'fs';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  username: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  database: configService.get('POSTGRES_DB'),
  entities: ['**/*.entity{.ts,.js}'],
  migrationsTableName: 'migration',
  migrations: ['**/migrations/*{.ts,.js}'],
  synchronize: false,
  ...(configService.get('POSTGRES_SSL') === 'true'
    ? {
        ssl: {
          ca: fs.readFileSync(__dirname + '/../../../POSTGRES_SSL_CA'),
          cert: fs.readFileSync(__dirname + '/../../../POSTGRES_SSL_CERT'),
          key: fs.readFileSync(__dirname + '/../../../POSTGRES_SSL_KEY'),
          rejectUnauthorized: false,
        },
      }
    : {}),
});
