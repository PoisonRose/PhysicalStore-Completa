import { BadRequestException, PipeTransform } from "@nestjs/common";

export class StateValidationPipe implements PipeTransform {
  transform(state: string) {
    const sigla = /^[A-Za-z]{2}$/;

    const brazilianStates = new Set<string>([
      "AC",
      "AL",
      "AP",
      "AM",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MT",
      "MS",
      "MG",
      "PA",
      "PB",
      "PR",
      "PE",
      "PI",
      "RJ",
      "RN",
      "RS",
      "RO",
      "RR",
      "SC",
      "SP",
      "SE",
      "TO",
    ]);

    const isValidState = brazilianStates.has(state);

    if (!sigla.test(state)) {
      throw new BadRequestException(
        "Formato inválido de sigla: deve ter 2 letras (ex: PE).",
      );
    }
    if (!isValidState) {
      throw new BadRequestException(
        "Estado inválido: A sigla deve corresponder a um estado brasileiro válido.",
      );
    }

    return state;
  }
}
