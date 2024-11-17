import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:['http://localhost:5173']
  })
  const config = new DocumentBuilder()
    .setTitle('Organizations')
    .setDescription('Organizations API Docs')
    .setVersion('1.0')
    .addTag('organization')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log('Running on port: ', process.env.PORT ?? 3000);
}

bootstrap();
