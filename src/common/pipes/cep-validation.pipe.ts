import { BadRequestException, PipeTransform } from "@nestjs/common";

export class CepValidationPipe implements PipeTransform {
  transform(value: string) {
    const cep = value.replace(/\D/g, "");

    const validacep = /^[0-9]{8}$/;

    if (!validacep.test(cep)) {
      throw new BadRequestException(
        "CEP inválido. Formato esperado: 00000000 ou 00000-000",
      );
    }

    return cep;
  }
}
