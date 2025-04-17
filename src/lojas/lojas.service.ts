import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/loja.entity";
import { StoreLocatorService } from "./lojas-locator.service";
import {
  LojaFreteResponse,
  PDVResponse,
  StoreResponse1,
  StoreResponse2,
} from "src/common/dto/store-response.dto";
import { StoreResponseBuilder } from "./builders/store-response.builder";
import { PdvResponseBuilderService } from "./builders/pdv-response.builder";
import { LojaFreteResponseBuilderService } from "./builders/loja-frete-response.builder";

@Injectable()
export class LojasService {
  constructor(
    @InjectRepository(Store)
    private readonly lojasRepository: Repository<Store>,
    private readonly storeLocatorService: StoreLocatorService,
    private readonly pdvBuilder: PdvResponseBuilderService,
    private readonly lojaFreteBuilder: LojaFreteResponseBuilderService,
  ) {}

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
    const storesWithDistance = await this.storeLocatorService.locateByCep(cep);
    const builders: StoreResponseBuilder[] = [
      this.pdvBuilder,
      this.lojaFreteBuilder,
    ];
    const storesWithResponses = (
      await Promise.all(
        storesWithDistance.map(async (item) => {
          const builder = builders.find((b) => b.supports(item.store));
          if (!builder) return null;
          return builder.build(item, cep);
        }),
      )
    ).filter((store) => store !== null);

    const pdvStores = storesWithResponses.filter(
      (store): store is PDVResponse => {
        if (store.type !== "PDV") return false;
        const distanceValue = parseFloat(
          store.distance.replace(" km", "").replace(",", ""),
        );
        return distanceValue <= 50;
      },
    );

    if (pdvStores.length === 0) {
      const lojasComFrete = storesWithResponses.filter(
        (store): store is LojaFreteResponse => store.type === "LOJA",
      );
      const { stores, pins, total } = this.paginateAndPin(
        lojasComFrete,
        limit,
        offset,
      );
      return {
        stores,
        pins,
        limit,
        offset,
        total,
      };
    }

    const { stores, pins, total } = this.paginateAndPin(
      pdvStores,
      limit,
      offset,
    );

    return {
      stores,
      pins,
      limit,
      offset,
      total,
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

  private paginateAndPin<
    T extends { latitude: string; longitude: string; name: string },
  >(items: T[], limit: number, offset: number) {
    const stores = items.slice(offset, offset + limit);
    const pins = stores.map((item) => ({
      position: { lat: +item.latitude, lng: +item.longitude },
      title: item.name,
    }));
    return { stores, pins, total: items.length };
  }
}
