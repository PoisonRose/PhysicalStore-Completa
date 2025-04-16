// via-cep.service.spec.ts
import { Test, TestingModule } from "@nestjs/testing";
import { ViaCepService } from "./via-cep.service";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { of, throwError } from "rxjs";
import {
  BadRequestException,
  InternalServerErrorException,
} from "@nestjs/common";
import { AxiosRequestHeaders, AxiosResponse } from "axios";

describe("ViaCepService", () => {
  let service: ViaCepService;
  let httpService: HttpService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let configService: ConfigService;

  // Função helper para criar responses do Axios
  const createAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
      headers: undefined as unknown as AxiosRequestHeaders,
      url: "",
      method: "GET",
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ViaCepService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockImplementation(() => of({} as AxiosResponse)),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => "fake-google-key"),
          },
        },
      ],
    }).compile();

    service = module.get<ViaCepService>(ViaCepService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("deve retornar dados do CEP com coordenadas", async () => {
    // Mock ViaCEP
    const viaCepResponse = createAxiosResponse({
      localidade: "São Paulo",
      uf: "SP",
      erro: false,
    });

    // Mock Google Geocode
    const geoCodeResponse = createAxiosResponse({
      results: [
        {
          geometry: {
            location: { lat: -23.5505, lng: -46.6333 },
          },
        },
      ],
    });

    jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => of(viaCepResponse))
      .mockImplementationOnce(() => of(geoCodeResponse));

    const result = await service.getAddressByCep("01001000");

    expect(result).toEqual({
      city: "São Paulo",
      state: "SP",
      latitude: "-23.5505",
      longitude: "-46.6333",
    });
  });

  it("deve lançar BadRequestException para CEP inválido", async () => {
    jest
      .spyOn(httpService, "get")
      .mockImplementation(() => throwError({ response: { status: 400 } }));

    await expect(service.getAddressByCep("00000000")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("deve lançar erro se Google não retornar coordenadas", async () => {
    const viaCepResponse = createAxiosResponse({
      localidade: "São Paulo",
      uf: "SP",
      erro: false,
    });

    const geoCodeResponse = createAxiosResponse({ results: [] });

    jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => of(viaCepResponse))
      .mockImplementationOnce(() => of(geoCodeResponse));

    await expect(service.getAddressByCep("01001000")).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it("deve lançar InternalServerError para falhas genéricas", async () => {
    jest
      .spyOn(httpService, "get")
      .mockImplementation(() => throwError(() => new Error("Erro genérico")));

    await expect(service.getAddressByCep("01001000")).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
