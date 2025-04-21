/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { CalcularFreteDto } from "./dto/calcular-frete-dto";
import {
  MelhorEnvioResponse,
  MelhorEnvioFrete,
} from "./interfaces/melhor-envio-response.interface";
import { AxiosResponse } from "axios";
import { FreteOption } from "./interfaces/frete-option.interface";

@Injectable()
export class FreteService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async calcularFrete(dto: CalcularFreteDto) {
    try {
      const token = this.configService.get<string>("MELHOR_ENVIO_TOKEN");

      const response: AxiosResponse<MelhorEnvioResponse> = await firstValueFrom(
        this.httpService.post(
          "https://www.melhorenvio.com.br/api/v2/me/shipment/calculate",
          {
            from: { postal_code: dto.fromPostalCode },
            to: { postal_code: dto.toPostalCode },
            package: {
              height: dto.height,
              width: dto.width,
              length: dto.length,
              weight: dto.weight,
            },
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "User-Agent": "PhysicalStore lucashenrique4848@gmail.com",
            },
          },
        ),
      );

      return this.formatResponse(response.data);
    } catch (error) {
      if (error.response?.data?.errors) {
        throw new InternalServerErrorException(
          `Erro no Melhor Envio: ${JSON.stringify(error.response.data.errors)}`,
        );
      }
      throw new InternalServerErrorException("Falha ao calcular fretes");
    }
  }

  private formatResponse(data: MelhorEnvioFrete[]): FreteOption[] {
    return data
      .filter(
        (item) =>
          item.company?.name === "Correios" &&
          ["SEDEX", "PAC"].includes(item.name),
      )
      .map((item) => ({
        prazo: `${item.delivery_time} dias úteis`,
        price: `R$ ${item.packages?.[0]?.price || "0,00"}`,
        description: item.name,
      }));
  }
}
