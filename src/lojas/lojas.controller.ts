import { Controller, Get, Param, Query } from "@nestjs/common";
import { LojasService } from "./lojas.service";
import {
  StoreResponse1,
  StoreResponse2,
} from "../common/dto/store-response.dto";
import { CepValidationPipe } from "../common/pipes/cep-validation.pipe";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { StateValidationPipe } from "../common/pipes/state-validation.pipe";

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
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Ponto inicial para paginação",
    example: 0,
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
  @ApiOkResponse({
    description: "Loja especificada retornada com sucesso",
    type: StoreResponse1,
  })
  @ApiNotFoundResponse({ description: "Nenhuma loja encontrada com o id {id}" })
  async findOne(@Param("id") id: string): Promise<StoreResponse1> {
    return this.lojasService.findOne(id);
  }

  @Get("por-cep/:cep")
  @ApiOperation({ summary: "Buscar lojas próximas a um CEP" })
  @ApiParam({
    name: "cep",
    required: true,
    description: "CEP de origem",
    example: "01310-100",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limite de lojas retornadas",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Ponto inicial para paginação",
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description:
      "Lista de lojas próximas ao CEP OU Opção de Frete caso não haja PDVs próximos",
    type: StoreResponse2,
  })
  @ApiBadRequestResponse({
    description: "CEP inválido. Formato esperado: 00000000 ou 00000-000",
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
    example: "SP",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Limite de lojas retornadas",
    example: 10,
  })
  @ApiQuery({
    name: "offset",
    required: false,
    description: "Ponto inicial para paginação",
    example: 0,
  })
  @ApiOkResponse({
    type: StoreResponse1,
    description: "Lista de lojas no estado.",
  })
  @ApiBadRequestResponse({
    description:
      "Formato inválido de sigla: deve ter 2 letras (ex: PE). OU Estado inválido: A sigla deve corresponder a um estado brasileiro válido.",
  })
  @ApiNotFoundResponse({
    description: "Lojas no Estado {estado} não encontradas",
  })
  async findByState(
    @Param("estado", StateValidationPipe) estado: string,
    @Query("limit") limit: number = 10,
    @Query("offset") offset: number = 0,
  ): Promise<StoreResponse1> {
    return this.lojasService.findByState(estado, limit, offset);
  }
}
