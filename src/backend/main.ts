import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@backend/modules/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: ["http://localhost:3000"],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Backend API ready on http://localhost:${port}/api`);
}

bootstrap();

