import { Injectable } from "@nestjs/common";

@Injectable()
export class MapsService {
  async calculateDistance(
    origin: { lat: string; lng: string },
    destination: { lat: string; lng: string },
  ): Promise<{ distanceText: string; distanceValue: number }> {
    return {
      distanceText: "3.1 km",
      distanceValue: 3.1, // vlores de teste
    };
  }
}
