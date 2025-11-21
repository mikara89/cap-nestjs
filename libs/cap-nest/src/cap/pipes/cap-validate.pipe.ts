// src/cap/pipes/cap-validate.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

@Injectable()
export class CapValidatePipe implements PipeTransform {
  constructor(private readonly dto: new () => unknown) {}

  transform(value: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const obj = plainToInstance(this.dto, value, {
      enableImplicitConversion: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const errors = validateSync(obj as object, { whitelist: true });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (errors.length) {
      throw new BadRequestException(errors);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return obj;
  }
}
