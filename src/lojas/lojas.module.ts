import { Module, OnModuleInit } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entities/loja.entity";
import { LojasService } from "./lojas.service";
import { LojasController } from "./lojas.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [LojasService],
  controllers: [LojasController],
})
export class LojasModule implements OnModuleInit {
  constructor(private readonly lojasService: LojasService) {}

  async onModuleInit() {
    await this.lojasService.seedDatabase();
  }
}
