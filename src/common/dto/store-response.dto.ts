import { Store } from "src/lojas/entities/loja.entity";

export class StoreResponse1 {
  stores: Store[];
  limit: number;
  offset: number;
  total: number;
}

export class StoreResponse2 {
  stores: Store[];
  pins: any[];
  freightOptions: any[];
  limit: number;
  offset: number;
  total: number;
}
