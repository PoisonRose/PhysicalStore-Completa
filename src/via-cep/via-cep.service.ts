import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosError, AxiosResponse } from "axios";
import { ViaCepResponse } from "./interfaces/via-cep-response.interface";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GoogleGeocodeResponse } from "./interfaces/google-geocode-response.interface";

@Injectable()
export class ViaCepService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getAddressByCep(cep: string): Promise<{
    city: string;
    state: string;
    latitude: string;
    longitude: string;
  }> {
    try {
      const viaCepResponse: AxiosResponse<ViaCepResponse> =
        await firstValueFrom(
          this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`),
        );

      if (viaCepResponse.data.erro) {
        throw new BadRequestException("CEP inválido");
      }

      const googleMapsKey = this.configService.get<string>(
        "GOOGLE_MAPS_API_KEY",
      );
      const geoCodeResponse: AxiosResponse<GoogleGeocodeResponse> =
        await firstValueFrom(
          this.httpService.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${viaCepResponse.data.localidade},${viaCepResponse.data.uf},Brasil&key=${googleMapsKey}`,
          ),
        );

      if (!geoCodeResponse.data.results[0]?.geometry?.location) {
        throw new Error("Falha ao obter coordenadas");
      }

      return {
        city: viaCepResponse.data.localidade,
        state: viaCepResponse.data.uf,
        latitude:
          geoCodeResponse.data.results[0].geometry.location.lat.toString(),
        longitude:
          geoCodeResponse.data.results[0].geometry.location.lng.toString(),
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 400) {
        console.log(error);
        throw new BadRequestException("CEP inválido");
      }

      throw new InternalServerErrorException("Erro ao processar CEP");
    }
  }
}
