import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/loja.entity";
import { initialStores } from "./lojas.seed";
import { ViaCepService } from "src/via-cep/via-cep.service";
import { MapsService } from "src/maps/maps.service";
import { FreteService } from "src/frete/frete.service";
import {
  StoreResponse1,
  StoreResponse2,
} from "src/common/dto/store-response.dto";

@Injectable()
export class LojasService {
  constructor(
    @InjectRepository(Store)
    private readonly lojasRepository: Repository<Store>,
    private readonly viaCepService: ViaCepService,
    private readonly mapsService: MapsService,
    private readonly freteService: FreteService,
  ) {}

  async seedDatabase() {
    const count = await this.lojasRepository.count();
    if (count === 0) {
      await this.lojasRepository.save(initialStores);
      console.log("Dados ficticios inseridos!");
    }
  }

  async findAll(
    limit: number = 10,
    offset: number = 0,
  ): Promise<StoreResponse1> {
    const [stores, total] = await this.lojasRepository.findAndCount({
      skip: offset,
      take: limit,
    });

    return {
      stores,
      limit,
      offset,
      total,
    };
  }

  async findOne(id: string): Promise<StoreResponse1> {
    const loja = await this.lojasRepository.findOneBy({ storeID: id });
    if (!loja) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada`);
    }
    return {
      stores: [loja],
      limit: 1,
      offset: 0,
      total: 1,
    };
  }

  async findByCep(
    cep: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<StoreResponse2> {
    const userLocation = await this.viaCepService.getAddressByCep(cep);

    const allStores = await this.findAll();
    const storesArray = allStores.stores;

    const storesWithDistance = await Promise.all(
      storesArray.map(async (store) => {
        const distance = await this.mapsService.calculateDistance(
          { lat: userLocation.latitude, lng: userLocation.longitude },
          { lat: store.latitude, lng: store.longitude },
        );

        return {
          ...store,
          distance: distance.distanceText,
          distanceValue: distance.distanceValue,
        };
      }),
    );

    const pdvStores = storesWithDistance.filter(
      (store) => store.type === "PDV" && store.distanceValue <= 50,
    );

    if (pdvStores.length === 0) {
      const freteOptions = await this.freteService.calcularFrete({
        fromPostalCode: "01310100",
        toPostalCode: cep,
        height: 4,
        width: 12,
        length: 17,
        weight: 0.3,
      });

      return {
        stores: [],
        freightOptions: freteOptions,
        pins: [],
        limit,
        offset,
        total: 0,
      };
    }

    return {
      stores: pdvStores.slice(offset, offset + limit),
      freightOptions: [],
      pins: storesWithDistance.map((store) => ({
        position: { lat: store.latitude, lng: store.longitude },
        title: store.storeName,
      })),
      limit,
      offset,
      total: pdvStores.length,
    };
  }

  async findByState(
    state: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<StoreResponse1> {
    const [stores, total] = await this.lojasRepository.findAndCount({
      where: { state: state.toUpperCase() },
      skip: offset,
      take: limit,
    });

    return {
      stores,
      limit,
      offset,
      total,
    };
  }
}
