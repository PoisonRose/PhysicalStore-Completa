import { Module } from "@nestjs/common";
import { CorreiosService } from "./correios.service";

@Module({
  providers: [CorreiosService],
})
export class CorreiosModule {}
