import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./entities/loja.entity";
import { LojasService } from "./lojas.service";
import { LojasController } from "./lojas.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Store])],
  providers: [LojasService],
  controllers: [LojasController],
})
export class LojasModule {}
