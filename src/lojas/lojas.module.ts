import { Module } from '@nestjs/common';
import { LojasService } from './lojas.service';
import { LojasController } from './lojas.controller';

@Module({
  providers: [LojasService],
  controllers: [LojasController]
})
export class LojasModule {}
