import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { MapsService } from "./maps.service";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [MapsService],
  exports: [MapsService],
})
export class MapsModule {}
