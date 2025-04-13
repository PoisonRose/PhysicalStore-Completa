import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { GoogleDistanceMatrixResponse } from "./interfaces/google-distance-response.interface";

@Injectable()
export class MapsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async calculateDistance(
    origin: { lat: string; lng: string },
    destination: { lat: string; lng: string },
  ): Promise<{ distanceText: string; distanceValue: number }> {
    const googleMapsKey = this.configService.get<string>("GOOGLE_MAPS_API_KEY");

    const response: AxiosResponse<GoogleDistanceMatrixResponse> =
      await firstValueFrom(
        this.httpService.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&key=${googleMapsKey}`,
        ),
      );

    const element = response.data.rows[0]?.elements[0];
    if (!element || element.status === "ZERO_RESULTS") {
      throw new Error("Não foi possível calcular a distância");
    }

    if (!element.distance) {
      throw new Error("Distância não disponível");
    }

    return {
      distanceText: element.distance.text,
      distanceValue: element.distance.value / 1000,
    };
  }
}
