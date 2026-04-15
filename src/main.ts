import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3001', 'http://192.168.0.77:3000'], // El puerto donde corre tu Angular
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permitir envío de cookies si lo necesitas
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
