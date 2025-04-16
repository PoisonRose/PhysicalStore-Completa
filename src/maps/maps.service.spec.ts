import { Test, TestingModule } from "@nestjs/testing";
import { MapsService } from "./maps.service";
import { HttpService } from "@nestjs/axios";
import { of, throwError } from "rxjs";
import { AxiosRequestHeaders, AxiosResponse } from "axios";
import { ConfigService } from "@nestjs/config";
import { InternalServerErrorException } from "@nestjs/common";

describe("MapsService", () => {
  let service: MapsService;
  let httpService: HttpService;

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
        MapsService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue("dummy-key") },
        },
      ],
    }).compile();

    service = module.get<MapsService>(MapsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("deve retornar a distância corretamente", async () => {
    const fakeGoogleResponse = createAxiosResponse({
      rows: [
        {
          elements: [
            {
              status: "OK",
              distance: { text: "2,661.3 km", value: 2661.3 },
            },
          ],
        },
      ],
      status: "OK",
    });

    jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => of(fakeGoogleResponse));

    const origin = { lat: "OriginExemplo", lng: "OriginExemplo" };
    const destination = { lat: "DestExemplo", lng: "DestExemplo" };

    const result = await service.calculateDistance(origin, destination);

    expect(result).toEqual({
      distanceText: "2,661.3 km",
      distanceValue: 2.6613,
    });
  });

  it("Deve lançar InternalServerError e mensagem se error.response?.data?.error_message existe.", async () => {
    const errorObject = {
      response: {
        data: {
          error_message: "Token inválido",
        },
      },
    };

    jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => throwError(errorObject));

    const origin = { lat: "OriginExemplo", lng: "OriginExemplo" };
    const destination = { lat: "DestExemplo", lng: "DestExemplo" };

    await expect(
      service.calculateDistance(origin, destination),
    ).rejects.toThrow(
      new InternalServerErrorException("Erro no Google Maps: Token inválido"),
    );
  });

  it("Deve lançar InternalServerErrorException com mensagem padrão se error.response?.data?.error_message não existir", async () => {
    const errorObject = new Error("Erro genérico");

    jest
      .spyOn(httpService, "get")
      .mockImplementationOnce(() => throwError(errorObject));

    const origin = { lat: "OriginExemplo", lng: "OriginExemplo" };
    const destination = { lat: "DestExemplo", lng: "DestExemplo" };

    await expect(
      service.calculateDistance(origin, destination),
    ).rejects.toThrow(
      new InternalServerErrorException("Falha ao calcular distância"),
    );
  });
});
