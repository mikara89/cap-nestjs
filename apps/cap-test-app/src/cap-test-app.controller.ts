import { Controller, Get, Query } from '@nestjs/common';
import { CapTestAppService } from './cap-test-app.service';
import { CapService } from '@cap/cap-nest';

@Controller()
export class CapTestAppController {
  constructor(
    private readonly capTestAppService: CapTestAppService,
    private readonly cap: CapService,
  ) {}

  @Get()
  getHello(): string {
    return this.capTestAppService.getHello();
  }

  // Example publish endpoint: /publish?msg=hello
  @Get('publish')
  async publishExample(@Query('msg') msg = 'hello'): Promise<{ ok: boolean }> {
    await this.cap.publish('example.topic', { text: msg });
    return { ok: true };
  }
}
