import { ApiProperty } from "@nestjs/swagger";
import { Store } from "../../lojas/entities/loja.entity";

export class StoreResponse1 {
  @ApiProperty({ description: "Lista de lojas", type: [Store] })
  stores: Store[];

  @ApiProperty({ description: "Número máximo de registros retornados" })
  limit: number;

  @ApiProperty({ description: "Número de registros ignorados (offset)" })
  offset: number;

  @ApiProperty({ description: "Número total de registros" })
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
  @ApiProperty({ description: "Lista de lojas retornada" })
  stores: (PDVResponse | LojaFreteResponse)[];

  @ApiProperty({ description: "Localização(latitude e longitude) no mapa" })
  pins: any[];

  @ApiProperty({ description: "Número máximo de registros retornados" })
  limit: number;

  @ApiProperty({ description: "Número de registros ignorados (offset)" })
  offset: number;

  @ApiProperty({ description: "Número total de registros" })
  total: number;
}
