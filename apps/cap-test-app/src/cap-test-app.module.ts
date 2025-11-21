import { Module } from '@nestjs/common';
import { CapTestAppController } from './cap-test-app.controller';
import { CapTestAppService } from './cap-test-app.service';
import { CapModule } from '@cap/cap-nest';
import { CapExampleHandler } from './cap-example.handler';

@Module({
  imports: [CapModule.forInMemory()],
  controllers: [CapTestAppController],
  providers: [CapTestAppService, CapExampleHandler],
})
export class CapTestAppModule {}
