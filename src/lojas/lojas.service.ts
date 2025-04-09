import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/loja.entity";
import { initialStores } from "./lojas.seed";

@Injectable()
export class LojasService {
  constructor(
    @InjectRepository(Store)
    private readonly lojasRepository: Repository<Store>,
  ) {}

  async seedDatabase() {
    const count = await this.lojasRepository.count();
    if (count === 0) {
      await this.lojasRepository.save(initialStores);
      console.log("Dados ficticios inseridos!");
    }
  }

  async findAll(): Promise<Store[]> {
    return this.lojasRepository.find();
  }

  async findOne(id: string): Promise<Store> {
    const loja = await this.lojasRepository.findOneBy({ storeID: id });
    if (!loja) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada`);
    }
    return loja;
  }
}
