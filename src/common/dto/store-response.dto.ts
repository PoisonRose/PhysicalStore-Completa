import { Store } from "src/lojas/entities/loja.entity";

export class StoreResponse1 {
  stores: Store[];
  limit: number;
  offset: number;
  total: number;
}

export interface PDVResponse {
  name: string;
  city: string;
  postalCode: string;
  type: "PDV";
  distance: string;
  value: Array<{
    prazo: string;
    price: string;
    description: string;
  }>;
  latitude: string;
  longitude: string;
}

export interface LojaFreteResponse {
  name: string;
  city: string;
  postalCode: string;
  type: "LOJA";
  distance: string;
  value: Array<{
    prazo: string;
    price: string;
    description: string;
    codProdutoAgencia: string;
  }>;
  latitude: string;
  longitude: string;
}

export class StoreResponse2 {
  stores: (PDVResponse | LojaFreteResponse)[];
  pins: any[];
  //freightOptions: any[];
  limit: number;
  offset: number;
  total: number;
}
