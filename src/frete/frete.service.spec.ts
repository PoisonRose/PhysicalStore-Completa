import { Test, TestingModule } from "@nestjs/testing";
import { FreteService } from "./frete.service";
import { HttpService } from "@nestjs/axios";
import { AxiosRequestHeaders, AxiosResponse } from "axios";
import { ConfigService } from "@nestjs/config";
import { of, throwError } from "rxjs";
import { InternalServerErrorException } from "@nestjs/common";

describe("FreteService", () => {
  let service: FreteService;
  let httpService: HttpService;

  const createAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
      headers: undefined as unknown as AxiosRequestHeaders,
      url: "",
      method: "POST",
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreteService,
        { provide: HttpService, useValue: { post: jest.fn() } },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue("dummy_token") },
        },
      ],
    }).compile();

    service = module.get<FreteService>(FreteService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("calcularFrete", () => {
    it("deve retornar as opções de frete formatadas quando a resposta é bem sucedida", async () => {
      const fakeResponseData = [
        {
          company: { name: "Correios" },
          name: "SEDEX",
          delivery_time: 2,
          packages: [{ price: "15,00" }],
        },
        {
          company: { name: "Correios" },
          name: "PAC",
          delivery_time: 6,
          packages: [{ price: "12,50" }],
        },
        {
          company: { name: "Outra" },
          name: "Express",
          delivery_time: 3,
          packages: [{ price: "20,00" }],
        },
      ];
      const fakeResponse = createAxiosResponse(fakeResponseData);

      jest
        .spyOn(httpService, "post")
        .mockImplementationOnce(() => of(fakeResponse));

      const dto = {
        fromPostalCode: "12345678",
        toPostalCode: "87654321",
        height: 10,
        width: 20,
        length: 30,
        weight: 5,
      };

      const result = await service.calcularFrete(dto);

      expect(result).toEqual([
        {
          prazo: "2 dias úteis",
          price: "R$ 15,00",
          description: "SEDEX",
        },
        {
          prazo: "6 dias úteis",
          price: "R$ 12,50",
          description: "PAC",
        },
      ]);
    });

    it("deve lançar InternalServerErrorException com mensagem do Melhor Envio se error.response.data.errors existir", async () => {
      const errorObject = {
        response: {
          data: {
            errors: ["Token inválido"],
          },
        },
      };

      jest
        .spyOn(httpService, "post")
        .mockImplementationOnce(() => throwError(errorObject));

      const dto = {
        fromPostalCode: "12345678",
        toPostalCode: "87654321",
        height: 10,
        width: 20,
        length: 30,
        weight: 5,
      };

      await expect(service.calcularFrete(dto)).rejects.toThrow(
        new InternalServerErrorException(
          `Erro no Melhor Envio: ${JSON.stringify(errorObject.response.data.errors)}`,
        ),
      );
    });

    it("deve lançar InternalServerErrorException com mensagem padrão se não houver error.response.data.errors", async () => {
      const errorObject = new Error("Erro genérico");

      jest
        .spyOn(httpService, "post")
        .mockImplementationOnce(() => throwError(errorObject));

      const dto = {
        fromPostalCode: "12345678",
        toPostalCode: "87654321",
        height: 10,
        width: 20,
        length: 30,
        weight: 5,
      };

      await expect(service.calcularFrete(dto)).rejects.toThrow(
        new InternalServerErrorException("Falha ao calcular fretes"),
      );
    });
  });
});
