import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LojasService } from "./lojas.service";
import { ViaCepService } from "../via-cep/via-cep.service";
import { MapsService } from "../maps/maps.service";
import { FreteService } from "../frete/frete.service";
import { Store } from "./entities/loja.entity";

describe("LojasService", () => {
  let service: LojasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LojasService,
        {
          provide: getRepositoryToken(Store),
          useValue: {
            findAndCount: jest.fn().mockResolvedValue([[], 0]),
            findOneBy: jest.fn(),
            count: jest.fn(),
            clear: jest.fn(),
            save: jest.fn(),
          },
        },
        { provide: ViaCepService, useValue: {} },
        { provide: MapsService, useValue: {} },
        { provide: FreteService, useValue: {} },
      ],
    }).compile();

    service = module.get<LojasService>(LojasService);
  });

  it("deve estar definido", () => {
    expect(service).toBeDefined();
  });
});
