import { Test, TestingModule } from "@nestjs/testing";
import { LojasController } from "./lojas.controller";
import { LojasService } from "./lojas.service";
import { CepValidationPipe } from "../common/pipes/cep-validation.pipe";

describe("LojasController", () => {
  let controller: LojasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LojasController],
      providers: [
        {
          provide: LojasService,
          useValue: {},
        },
        {
          provide: CepValidationPipe,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<LojasController>(LojasController);
  });

  it("deve estar definido", () => {
    expect(controller).toBeDefined();
  });
});
