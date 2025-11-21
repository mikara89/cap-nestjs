import { Controller, Get } from '@nestjs/common';
import { CapTestAppService } from './cap-test-app.service';

@Controller()
export class CapTestAppController {
  constructor(private readonly capTestAppService: CapTestAppService) {}

  @Get()
  getHello(): string {
    return this.capTestAppService.getHello();
  }
}
