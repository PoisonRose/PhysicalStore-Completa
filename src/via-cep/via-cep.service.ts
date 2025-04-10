import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { AxiosResponse } from "axios";
import { ViaCepResponse } from "./interfaces/via-cep-response.interface";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class ViaCepService {
  constructor(private readonly httpService: HttpService) {}

  async getAddressByCep(cep: string): Promise<{
    city: string;
    state: string;
    latitude: string;
    longitude: string;
  }> {
    const response: AxiosResponse<ViaCepResponse> = await firstValueFrom(
      this.httpService.get(`https://viacep.com.br/ws/${cep}/json/`),
    );

    if (response.data.erro) {
      throw new BadRequestException("CEP invalido");
    }

    return {
      city: response.data.localidade,
      state: response.data.uf,
      latitude: "-23.550520",
      longitude: "-46.633308",
    };
  }
}
