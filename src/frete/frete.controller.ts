import { Body, Controller, Post } from "@nestjs/common";
import { FreteService } from "./frete.service";
import { CalcularFreteDto } from "./dto/calcular-frete-dto";

@Controller("frete")
export class FreteController {
  constructor(private readonly freteService: FreteService) {}

  @Post()
  async calculate(@Body() dto: CalcularFreteDto) {
    return this.freteService.calcularFrete(dto);
  }
}
