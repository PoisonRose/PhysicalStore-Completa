import {
  LojaFreteResponse,
  PDVResponse,
} from "src/common/dto/store-response.dto";
import { Store } from "../entities/loja.entity";
import { StoreWithDistance } from "../lojas-locator.service";

export interface StoreResponseBuilder {
  supports(store: Store): boolean;
  build(
    StoreWithDistance: StoreWithDistance,
    cep: string,
  ): Promise<PDVResponse | LojaFreteResponse | null>;
}
