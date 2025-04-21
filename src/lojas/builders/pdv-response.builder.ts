import { Injectable } from "@nestjs/common";
import { StoreResponseBuilder } from "./store-response.builder";
import { StoreWithDistance } from "../lojas-locator.service";
import { PDVResponse } from "src/common/dto/store-response.dto";
import { Store } from "../entities/loja.entity";

@Injectable()
export class PdvResponseBuilderService implements StoreResponseBuilder {
  supports(store: Store): boolean {
    return store.type === "PDV";
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async build(item: StoreWithDistance): Promise<PDVResponse> {
    const { store, distanceText } = item;

    return {
      name: store.storeName,
      city: store.city,
      postalCode: store.postalCode,
      type: "PDV",
      distance: distanceText,
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
  }
}
