import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    const loggingSettings: Prisma.LogDefinition[] = [
      { emit: 'stdout', level: 'query' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
      { emit: 'stdout', level: 'error' },
    ];
    // const dbUser = configService.get('DATABASE_USER');
    // const dbPass = configService.get('DATABASE_PASSWORD');
    // const dbHost = configService.get('DATABASE_HOST');
    // const dbPort = configService.get('DATABASE_PORT');
    // const dbName = configService.get('DATABASE_NAME');
    // const dbSchema = configService.get('DATABASE_SCHEMA');
    // const databaseUrl = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${dbSchema}`;
    console.log({
      // dbUser,
      // dbPass,
      // dbHost,
      // dbPort,
      // dbName,
      // dbSchema,
      // databaseUrl,
      databaseUrlInENV: configService.get('DATABASE_URL'),
    });
    super({
      log: loggingSettings,
      errorFormat: 'pretty',
      // datasources: {
      //   db: {
      //     url: databaseUrl,
      //   },
      // },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
