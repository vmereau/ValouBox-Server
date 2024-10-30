import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        if (configService.get('MODE') === 'TEST') {
          return {};
        }

        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: ['dist/**/*.entity.js'],
          synchronize: false,
          migrationsTransactionMode: 'each', // Create one separate transaction per migration file
          migrationsTableName: 'migration',
          migrationsRun: true,
          migrations: ['dist/database/migrations/*{.ts,.js}'],
          cli: {
            migrationsDir: './migration',
          },
          autoLoadEntities: true,
        };
      },
      // Get the result of useFactory()
      dataSourceFactory: async (options) => {
        /*if (!options.type) {
          console.log('Working with pg-mem InMemoryDB');

          return (await setupDB()).dataSource;
        }*/

        return new DataSource(options);
      },
    }),
  ],
})
export class DatabaseModule {}
