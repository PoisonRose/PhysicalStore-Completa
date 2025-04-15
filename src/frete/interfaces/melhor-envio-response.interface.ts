export interface DeliveryRange {
  min: number;
  max: number;
}

export interface Package {
  price: string;
  discount: string;
  format: string;
  weight: string;
  dimensions: {
    height: number;
    width: number;
    length: number;
  };
}

export interface Company {
  id: number;
  name: string;
  picture: string;
}

export interface MelhorEnvioFrete {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  delivery_range: DeliveryRange;
  packages: Package[];
  company: Company;
}

export interface FreteOptionResponse {
  prazo: string;
  price: string;
  description: string;
  codProdutoAgencia: string;
}

export type MelhorEnvioResponse = MelhorEnvioFrete[];
