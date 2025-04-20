import { ApiProperty } from "@nestjs/swagger";

export class CalcularFreteDto {
  @ApiProperty({ description: "CEP do Remetente" })
  fromPostalCode: string;

  @ApiProperty({ description: "CEP do destinatário" })
  toPostalCode: string;

  @ApiProperty({ description: "Altura do pacote" })
  height: number;

  @ApiProperty({ description: "Largura do produto" })
  width: number;

  @ApiProperty({ description: "Tamanho do produto" })
  length: number;

  @ApiProperty({ description: "Peso do produto" })
  weight: number;
}
