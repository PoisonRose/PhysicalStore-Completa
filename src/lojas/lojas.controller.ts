import { Controller, Get, Param } from "@nestjs/common";
import { LojasService } from "./lojas.service";
import { Store } from "./entities/loja.entity";

@Controller("lojas")
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @Get()
  async findAll(): Promise<Store[]> {
    return this.lojasService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<Store> {
    return this.lojasService.findOne(id);
  }
}
