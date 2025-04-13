import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { CalcularFreteDto } from "./dto/calcular-frete-dto";
import {
  MelhorEnvioResponse,
  MelhorEnvioFrete,
} from "./interfaces/melhor-envio-response.interface";
import { AxiosResponse } from "axios";

@Injectable()
export class FreteService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async calcularFrete(dto: CalcularFreteDto) {
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
  }

  private formatResponse(data: MelhorEnvioFrete[]) {
    return data
      .filter(
        (item) =>
          item.company.name === "Correios" &&
          ["SEDEX", "PAC"].includes(item.name),
      )
      .map((item) => ({
        prazo: `${item.delivery_time} dias úteis`,
        price: `R$ ${parseFloat(item.packages[0]?.price || "0")
          .toFixed(2)
          .replace(".", ",")}`,
        description: item.name,
      }));
  }
}
