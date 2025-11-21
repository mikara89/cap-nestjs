// src/cap/scheduler/schedule.module.ts
import { Module, DynamicModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RetrySchedulerService } from './schedule.service';

/**
 * Pluggable module; used internally by CapModule
 * but exportable so adapter packages can extend/override.
 */
@Module({})
export class CapSchedulerModule {
  static attach(adaptersModule: DynamicModule): DynamicModule {
    return {
      module: CapSchedulerModule,
      imports: [
        ScheduleModule.forRoot(), // cron engine
        adaptersModule, // SAME instance created by CapModule
      ],
      providers: [RetrySchedulerService],
      exports: [RetrySchedulerService],
    };
  }
}
