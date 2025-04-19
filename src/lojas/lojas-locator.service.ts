import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/loja.entity";
import { ViaCepService } from "../via-cep/via-cep.service";
import { MapsService } from "../maps/maps.service";

export interface StoreWithDistance {
  store: Store;
  distanceValue: number;
  distanceText: string;
}

@Injectable()
export class StoreLocatorService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
    private readonly viaCepService: ViaCepService,
    private readonly mapsService: MapsService,
  ) {}

  async locateByCep(cep: string): Promise<StoreWithDistance[]> {
    const { latitude, longitude } =
      await this.viaCepService.getAddressByCep(cep);

    const stores = await this.storeRepo.find();

    const withDistance = await Promise.all(
      stores.map(async (store) => {
        try {
          const result = await this.mapsService.calculateDistance(
            { lat: latitude, lng: longitude },
            { lat: store.latitude, lng: store.longitude },
          );
          return {
            store,
            distanceValue: result.distanceValue,
            distanceText: result.distanceText,
          };
        } catch (error) {
          throw new InternalServerErrorException(
            `Erro ao calcular distância para a loja ${store.storeID}`,
          );
        }
      }),
    );

    return withDistance;
  }
}
