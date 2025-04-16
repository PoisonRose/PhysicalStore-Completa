import { Test, TestingModule } from "@nestjs/testing";
import { FreteController } from "./frete.controller";
import { FreteService } from "./frete.service";

describe("FreteController", () => {
  let controller: FreteController;
  const mockFreteService = { calcularFrete: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreteController],
      providers: [{ provide: FreteService, useValue: mockFreteService }],
    }).compile();

    controller = module.get<FreteController>(FreteController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
