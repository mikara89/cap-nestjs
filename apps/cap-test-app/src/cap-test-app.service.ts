import { Injectable } from '@nestjs/common';

@Injectable()
export class CapTestAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
