import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entities/loja.entity";
import { LojasService } from "./lojas.service";
import { LojasController } from "./lojas.controller";
import { ViaCepService } from "src/via-cep/via-cep.service";
import { MapsService } from "src/maps/maps.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    HttpModule,
    ConfigModule.forRoot(),
  ],
  providers: [LojasService, ViaCepService, MapsService],
  controllers: [LojasController],
})
export class LojasModule implements OnModuleInit {
  constructor(private readonly lojasService: LojasService) {}

  async onModuleInit() {
    await this.lojasService.seedDatabase();
  }
}
