import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Store {
  @PrimaryGeneratedColumn("uuid")
  storeID: string;

  @Column()
  storeName: string;

  @Column({ default: true })
  takeOutInStore: boolean;

  @Column()
  shippingTimeInDays: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  addresss3: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  state: string;

  @Column({
    type: "varchar",
    length: 10,
    default: "LOJA",
    comment: "Tipo da loja: PDV ou LOJA",
    transformer: {
      to: (value: "PDV" | "LOJA") => value,
      from: (value: string) => value,
    },
  })
  type: "PDV" | "LOJA";

  @Column()
  country: string;

  @Column()
  postalCode: string;

  @Column()
  telephoneNumber: string;

  @Column()
  emailAddress: string;
}
