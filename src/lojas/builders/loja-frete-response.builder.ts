import { Injectable } from "@nestjs/common";
import { StoreResponseBuilder } from "./store-response.builder";
import { StoreWithDistance } from "../lojas-locator.service";
import { LojaFreteResponse } from "src/common/dto/store-response.dto";
import { Store } from "../entities/loja.entity";
import { FreteService } from "src/frete/frete.service";
import { FreteOptionResponse } from "src/frete/interfaces/melhor-envio-response.interface";

@Injectable()
export class LojaFreteResponseBuilderService implements StoreResponseBuilder {
  constructor(private readonly freteService: FreteService) {}

  supports(store: Store): boolean {
    return store.type === "LOJA";
  }

  async build(
    item: StoreWithDistance,
    cep: string,
  ): Promise<LojaFreteResponse | null> {
    const { store, distanceText } = item;

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
      type: "LOJA",
      distance: distanceText,
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
}
