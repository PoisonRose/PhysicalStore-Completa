import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/loja.entity";
import { initialStores } from "./lojas.seed";
import { ViaCepService } from "../via-cep/via-cep.service";
import { MapsService } from "../maps/maps.service";
import { FreteService } from "../frete/frete.service";
import {
  LojaFreteResponse,
  PDVResponse,
  StoreResponse1,
  StoreResponse2,
} from "src/common/dto/store-response.dto";
import { FreteOptionResponse } from "src/frete/interfaces/melhor-envio-response.interface";

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
      await this.lojasRepository.clear();
      await this.lojasRepository.save(initialStores);
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

    const storesWithDistance = (
      await Promise.all(
        storesArray.map(async (store) => {
          const distance = await this.mapsService.calculateDistance(
            { lat: userLocation.latitude, lng: userLocation.longitude },
            { lat: store.latitude, lng: store.longitude },
          );

          if (store.type === "PDV") {
            return {
              name: store.storeName,
              city: store.city,
              postalCode: store.postalCode,
              type: "PDV" as const,
              distance: distance.distanceText,
              latitude: store.latitude,
              longitude: store.longitude,
              value: [
                {
                  prazo: `${store.shippingTimeInDays + 1} dias úteis`,
                  price: "R$ 15,00",
                  description: "Motoboy",
                },
              ],
            };
          } else {
            const freteOptions = await this.freteService
              .calcularFrete({
                fromPostalCode: store.postalCode.replace("-", ""),
                toPostalCode: cep,
                height: 4,
                width: 12,
                length: 17,
                weight: 0.3,
              })
              .catch(() => []);

            if (freteOptions.length === 0) return null;

            return {
              name: store.storeName,
              city: store.city,
              postalCode: store.postalCode,
              type: "LOJA" as const,
              distance: distance.distanceText,
              latitude: store.latitude,
              longitude: store.longitude,
              value: freteOptions.map((frete: FreteOptionResponse) => ({
                prazo: frete.prazo,
                price: frete.price,
                description: frete.description,
                codProdutoAgencia: frete.description.includes("SEDEX")
                  ? "04014"
                  : "04510",
              })),
            };
          }
        }),
      )
    ).filter((store) => store !== null) as (PDVResponse | LojaFreteResponse)[];

    const pdvStores = storesWithDistance.filter(
      (store): store is PDVResponse => {
        if (store.type !== "PDV") return false;
        const distanceValue = parseFloat(
          store.distance.replace(" km", "").replace(",", ""),
        );
        return distanceValue <= 50;
      },
    );

    if (pdvStores.length === 0) {
      const lojasComFrete = storesWithDistance.filter(
        (store): store is LojaFreteResponse => store.type === "LOJA",
      );
      return {
        stores: lojasComFrete.slice(offset, offset + limit),
        pins: lojasComFrete.map((loja) => ({
          position: {
            lat: Number(loja.latitude),
            lng: Number(loja.longitude),
          },
          title: loja.name,
        })),
        limit,
        offset,
        total: lojasComFrete.length,
      };
    }

    return {
      stores: pdvStores.slice(offset, offset + limit),
      pins: storesWithDistance.map((store) => ({
        position: {
          lat: Number(store.latitude),
          lng: Number(store.longitude),
        },
        title: store.name,
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
