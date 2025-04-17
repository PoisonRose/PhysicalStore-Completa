import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entities/loja.entity";
import { LojasService } from "./lojas.service";
import { LojasController } from "./lojas.controller";
import { ViaCepService } from "src/via-cep/via-cep.service";
import { MapsService } from "src/maps/maps.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { FreteService } from "src/frete/frete.service";
import { LojasSeederService } from "./lojas-seeder.service";
import { StoreLocatorService } from "./lojas-locator.service";
import { PdvResponseBuilderService } from "./builders/pdv-response.builder";
import { LojaFreteResponseBuilderService } from "./builders/loja-frete-response.builder";

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    HttpModule,
    ConfigModule.forRoot(),
  ],
  providers: [
    LojasService,
    ViaCepService,
    MapsService,
    FreteService,
    LojasSeederService,
    StoreLocatorService,
    PdvResponseBuilderService,
    LojaFreteResponseBuilderService,
  ],
  controllers: [LojasController],
})
export class LojasModule implements OnModuleInit {
  constructor(private readonly seeder: LojasSeederService) {}

  async onModuleInit() {
    //await this.lojasService.seedDatabase();
    await this.seeder.seedDatabase();
  }
}
