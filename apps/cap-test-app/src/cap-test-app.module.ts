import { Module } from '@nestjs/common';
import { CapTestAppController } from './cap-test-app.controller';
import { CapTestAppService } from './cap-test-app.service';

@Module({
  imports: [],
  controllers: [CapTestAppController],
  providers: [CapTestAppService],
})
export class CapTestAppModule {}
