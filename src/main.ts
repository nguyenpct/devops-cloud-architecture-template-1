import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('app');
  const config = new DocumentBuilder()
    .setTitle('Nest prisma')
    .setDescription('The Nest prisma API description')
    .setVersion('1.0')
    .addTag('nest-prisma')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const dbUser = app.get(ConfigService).get('DATABASE_USER');
  const dbPass = app.get(ConfigService).get('DATABASE_PASSWORD');
  const dbHost = app.get(ConfigService).get('DATABASE_HOST');
  const dbPort = app.get(ConfigService).get('DATABASE_PORT');
  const dbName = app.get(ConfigService).get('DATABASE_NAME');
  console.log({
    dbUser,
    dbPass,
    dbHost,
    dbPort,
    dbName,
    databaseUrlInENV: app.get(ConfigService).get('DATABASE_URL'),
  });

  const appPort = app.get(ConfigService).get('PORT');
  await app.listen(appPort);
  console.log(`Application is running on: ${await app.getUrl()}.`);
}
bootstrap();
