import { DynamicModule, Global, Provider } from '@nestjs/common';

@Global()
export class AdaptersModule {
  static register(providers: Provider[]): DynamicModule {
    return {
      module: AdaptersModule,
      providers,
      exports: providers, // <-- make them visible to any importer
    };
  }
}
