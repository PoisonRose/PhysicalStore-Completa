import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { FreteService } from "./frete.service";
import { FreteController } from "./frete.controller";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [FreteService],
  controllers: [FreteController],
})
export class FreteModule {}
