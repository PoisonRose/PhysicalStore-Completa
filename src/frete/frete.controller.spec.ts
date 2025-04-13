import { Test, TestingModule } from '@nestjs/testing';
import { FreteController } from './frete.controller';

describe('FreteController', () => {
  let controller: FreteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreteController],
    }).compile();

    controller = module.get<FreteController>(FreteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
