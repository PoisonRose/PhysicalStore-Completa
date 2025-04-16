import { Controller, Get, Param, Query } from "@nestjs/common";
import { LojasService } from "./lojas.service";
//import { Store } from "./entities/loja.entity";
import {
  StoreResponse1,
  StoreResponse2,
} from "src/common/dto/store-response.dto";
import { CepValidationPipe } from "../common/pipes/cep-validation.pipe";

@Controller("lojas")
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @Get()
  async findAll(
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse1> {
    return this.lojasService.findAll(limit, offset);
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<StoreResponse1> {
    return this.lojasService.findOne(id);
  }

  @Get("por-cep/:cep")
  async findByCep(
    @Param("cep", CepValidationPipe) cep: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse2> {
    return this.lojasService.findByCep(cep, limit, offset);
  }

  @Get("por-estado/:estado")
  async findByState(
    @Param("estado") estado: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse1> {
    return this.lojasService.findByState(estado, limit, offset);
  }
}
