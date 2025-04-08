import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LojasModule } from './lojas/lojas.module';
import { FreteModule } from './frete/frete.module';
import { MapsModule } from './maps/maps.module';
import { CorreiosModule } from './correios/correios.module';

@Module({
  imports: [LojasModule, FreteModule, MapsModule, CorreiosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
