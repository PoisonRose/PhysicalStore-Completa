import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LojasService } from "./lojas.service";
import { Store } from "./entities/loja.entity";
import { StoreLocatorService } from "./lojas-locator.service";
import { PdvResponseBuilderService } from "./builders/pdv-response.builder";
import { LojaFreteResponseBuilderService } from "./builders/loja-frete-response.builder";
import { NotFoundException } from "@nestjs/common";

describe("LojasService", () => {
  let service: LojasService;
  let repository: any;
  let storeLocatorService: any;
  let pdvBuilder: any;
  let lojaFreteBuilder: any;

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
        { provide: StoreLocatorService, useValue: { locateByCep: jest.fn() } },
        {
          provide: PdvResponseBuilderService,
          useValue: { supports: jest.fn(), build: jest.fn() },
        },
        {
          provide: LojaFreteResponseBuilderService,
          useValue: { supports: jest.fn(), build: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<LojasService>(LojasService);
    repository = module.get(getRepositoryToken(Store));
    storeLocatorService = module.get(StoreLocatorService);
    pdvBuilder = module.get(PdvResponseBuilderService);
    lojaFreteBuilder = module.get(LojaFreteResponseBuilderService);
  });

  it("deve estar definido", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("deve retornar lojas com limit e offset", async () => {
      const fakeStores = [{ storeID: "1" }, { storeID: "2" }];
      repository.findAndCount.mockResolvedValue([
        fakeStores,
        fakeStores.length,
      ]);

      const result = await service.findAll(10, 0);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        stores: fakeStores,
        limit: 10,
        offset: 0,
        total: 2,
      });
    });
  });

  describe("findOne", () => {
    it("deve retornar uma loja existente", async () => {
      const fakeStore = { storeID: "1" };
      repository.findOneBy.mockResolvedValue(fakeStore);

      const result = await service.findOne("1");

      expect(repository.findOneBy).toHaveBeenCalledWith({ storeID: "1" });
      expect(result).toEqual({
        stores: [fakeStore],
        limit: 1,
        offset: 0,
        total: 1,
      });
    });

    it("deve lançar NotFoundException se loja não existir", async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findByCep", () => {
    it("deve retornar lojas montadas pelos builders", async () => {
      const store = {
        storeID: "1",
        type: "PDV",
        latitude: "0",
        longitude: "0",
        storeName: "Loja 1",
      };
      const storesWithDistance = [
        { store, distanceText: "5 km", distanceValue: 5 },
      ];

      storeLocatorService.locateByCep.mockResolvedValue(storesWithDistance);

      pdvBuilder.supports.mockReturnValue(true);
      pdvBuilder.build.mockResolvedValue({
        name: "Loja 1",
        city: "City",
        postalCode: "12345-678",
        type: "PDV",
        distance: "5 km",
        latitude: "0",
        longitude: "0",
        value: [
          { prazo: "2 dias úteis", price: "R$ 10,00", description: "Motoboy" },
        ],
      });

      const result = await service.findByCep("12345-678", 10, 0);

      expect(storeLocatorService.locateByCep).toHaveBeenCalledWith("12345-678");
      expect(pdvBuilder.supports).toHaveBeenCalledWith(store);
      expect(pdvBuilder.build).toHaveBeenCalledWith(
        storesWithDistance[0],
        "12345-678",
      );

      expect(result).toHaveProperty("stores");
      expect(result).toHaveProperty("pins");
      expect(result.total).toBe(1);
    });
  });
});
