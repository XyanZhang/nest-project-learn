import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule, 
    new FastifyAdapter() // 使用fastify代替默认的express，以提高应用的http响应速度。
  );

  // 允许跨域
  app.enableCors();
  
  await app.listen(4321);
}
bootstrap();
