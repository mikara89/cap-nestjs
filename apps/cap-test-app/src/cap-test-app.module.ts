import { Module } from '@nestjs/common';
// path utilities are no longer required here; CapDashboardModule will resolve defaults
import { MikroOrmModule } from '@mikro-orm/nestjs';
import type { Options as MikroOptions } from '@mikro-orm/core';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';
import { CapTestAppController } from './cap-test-app.controller';
import { CapTestAppService } from './cap-test-app.service';
import { CapModule, CapAdapterModule } from '@cap/cap-nest';
import { CapExampleHandler } from './cap-example.handler';
import {
  MikroStorageModule,
  CapPublishEntity,
  CapReceivedEntity,
} from '../../../libs/storage-mikro-orm/src';
// Note: schema creation is handled via CapModule init options.
import { ServiceBusTransportModule } from '@cap/azure-servicebus-transport';
import { CapDashboardModule } from '@cap/cap-dashboard';

// create the dynamic transport module instance so we can pass its
// provider array to the CapModule helper. Avoid accessing the class
// property `ServiceBusTransportModule.providers` which doesn't exist.
const serviceBusTransport = ServiceBusTransportModule.forRoot({
  connectionString:
    'Endpoint=sb://db-nh-t-ns.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=a9SHmHaijRL5AOhKwqRUB6GuGXY+paCaM+ASbPMihg0=',
  maxConcurrentCalls: 10,
  subscriptionPrefix: 'sub-',
  mode: 'queue',
  queuePrefix: 'cap-',
});

// In-memory transport for local development (no external dependencies)

// const InMemPublisher = { provide: PUBLISHER, useClass: LocalBus };

// const InMemSubscriber = { provide: SUBSCRIBER, useExisting: PUBLISHER };

@Module({
  imports: [
    // MikroORM configured to use an in-memory SQLite database for tests
    MikroOrmModule.forRootAsync({
      useFactory: (): MikroOptions =>
        ({
          driver: BetterSqliteDriver,
          dbName: ':memory:',
          entities: [CapPublishEntity, CapReceivedEntity],
          allowGlobalContext: true,
        }) as unknown as MikroOptions,
    }),
    // ensure the storage module registers the entities with MikroORM
    MikroStorageModule,
    // register CAP using the Mikro storage adapter and in-memory transport

    serviceBusTransport,
    CapModule.forAdapters(
      MikroStorageModule,
      serviceBusTransport as unknown as CapAdapterModule,
      {
        autoInit: false,
        createQueues: false,
        createSchema: true,
      },
    ),
    CapDashboardModule.forRoot({
      guard: {
        provide: 'CAP_DASHBOARD_DEMO_GUARD',
        useValue: { canActivate: () => true },
      },
      routePrefix: '/api/cap', // default
      uiRoute: '/cap-dashboard', // default
      serveStatic: true, // default true
    }),
  ],
  controllers: [CapTestAppController],
  providers: [CapTestAppService, CapExampleHandler],
})
export class CapTestAppModule {}
