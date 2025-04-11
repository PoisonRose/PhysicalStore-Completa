import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LojasModule } from "./lojas/lojas.module";
import { FreteModule } from "./frete/frete.module";
import { MapsModule } from "./maps/maps.module";
import { CorreiosModule } from "./correios/correios.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Store } from "./lojas/entities/loja.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "database.sqlite",
      entities: [Store],
      synchronize: true,
    }),
    LojasModule,
    FreteModule,
    MapsModule,
    CorreiosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
