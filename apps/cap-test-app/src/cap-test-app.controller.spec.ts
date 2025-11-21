import { Test, TestingModule } from '@nestjs/testing';
import { CapTestAppController } from './cap-test-app.controller';
import { CapTestAppService } from './cap-test-app.service';

describe('CapTestAppController', () => {
  let capTestAppController: CapTestAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CapTestAppController],
      providers: [CapTestAppService],
    }).compile();

    capTestAppController = app.get<CapTestAppController>(CapTestAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(capTestAppController.getHello()).toBe('Hello World!');
    });
  });
});
