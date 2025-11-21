import { NestFactory } from '@nestjs/core';
import { CapTestAppModule } from './cap-test-app.module';

async function bootstrap() {
  const app = await NestFactory.create(CapTestAppModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
