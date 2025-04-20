import { ApiProperty } from "@nestjs/swagger";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Store {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: "ID da loja" })
  storeID: string;

  @Column()
  @ApiProperty({ description: "Nome da loja" })
  storeName: string;

  @Column({ default: true })
  @ApiProperty({ description: "Se é possível pegar o produto na loja" })
  takeOutInStore: boolean;

  @Column()
  @ApiProperty({ description: "Tempo de entrega em dias" })
  shippingTimeInDays: number;

  @Column()
  @ApiProperty({ description: "Latitude" })
  latitude: string;

  @Column()
  @ApiProperty({ description: "Longitude" })
  longitude: string;

  @Column()
  @ApiProperty({ description: "Endereço da loja" })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  addresss3: string;

  @Column()
  @ApiProperty({ description: "Cidade da loja" })
  city: string;

  @Column()
  district: string;

  @Column()
  @ApiProperty({ description: "Estado da loja" })
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
  @ApiProperty({ description: "Tipo da Loja(PDV ou LOJA)" })
  type: "PDV" | "LOJA";

  @Column()
  country: string;

  @Column()
  @ApiProperty({ description: "CEP da Loja" })
  postalCode: string;

  @Column()
  @ApiProperty({ description: "Número de telefone da loja" })
  telephoneNumber: string;

  @Column()
  @ApiProperty({ description: "Endereço de e-mail da loja" })
  emailAddress: string;
}
