import { Store } from "./entities/loja.entity";

export const initialStores: Partial<Store>[] = [
  {
    storeName: "PDV Central",
    takeOutInStore: true,
    shippingTimeInDays: 1,
    latitude: "-23.550520",
    longitude: "-46.633308",
    address1: "Av. Paulista, 1000",
    city: "São Paulo",
    district: "Bela Vista",
    state: "SP",
    type: "PDV",
    country: "BR",
    postalCode: "01310-100",
    telephoneNumber: "(11) 9999-9999",
    emailAddress: "pdv.central@example.com",
  },
];
