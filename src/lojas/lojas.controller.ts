import { Controller, Get, Param, Query } from "@nestjs/common";
import { LojasService } from "./lojas.service";
//import { Store } from "./entities/loja.entity";
import {
  StoreResponse1,
  StoreResponse2,
} from "src/common/dto/store-response.dto";
import { CepValidationPipe } from "../common/pipes/cep-validation.pipe";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Lojas")
@Controller("lojas")
export class LojasController {
  constructor(private readonly lojasService: LojasService) {}

  @Get()
  @ApiOperation({
    summary: "Lista todas as lojas",
    description: "Retorna todas as lojas paginadas.",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limite de lojas retornadas",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Ponto inicial para paginação",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de lojas retornada com sucesso",
    type: StoreResponse1,
  })
  async findAll(
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse1> {
    return this.lojasService.findAll(limit, offset);
  }

  @Get(":id")
  @ApiOperation({
    summary: "Lista loja com o id especificado",
    description: "Retorna loja com id especificado",
  })
  @ApiParam({ name: "id", required: true, description: "ID da loja" })
  @ApiResponse({
    status: 200,
    description: "Loja especificada retornada com sucesso",
    type: StoreResponse1,
  })
  async findOne(@Param("id") id: string): Promise<StoreResponse1> {
    return this.lojasService.findOne(id);
  }

  @Get("por-cep/:cep")
  @ApiOperation({ summary: "Buscar lojas próximas a um CEP" })
  @ApiParam({ name: "cep", required: true, description: "CEP de origem" })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limite de lojas retornadas",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Ponto inicial para paginação",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de lojas próximas ao CEP.",
    type: StoreResponse2,
  })
  async findByCep(
    @Param("cep", CepValidationPipe) cep: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse2> {
    return this.lojasService.findByCep(cep, limit, offset);
  }

  @Get("por-estado/:estado")
  @ApiOperation({
    summary: "Lista loja com no estado especificado",
    description: "Retorna loja com endereço no estado especificado",
  })
  @ApiParam({
    name: "estado",
    required: true,
    description: "Sigla do Estado (Exemplo: SP)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limite de lojas retornadas",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Ponto inicial para paginação",
  })
  @ApiResponse({
    status: 200,
    description: "Lista de lojas no estado.",
    type: StoreResponse1,
  })
  async findByState(
    @Param("estado") estado: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse1> {
    return this.lojasService.findByState(estado, limit, offset);
  }
}
