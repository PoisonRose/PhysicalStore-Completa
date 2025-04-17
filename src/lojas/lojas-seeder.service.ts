import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/loja.entity";
import { initialStores } from "./lojas.seed";

@Injectable()
export class LojasSeederService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  async seedDatabase(): Promise<void> {
    const count = await this.storeRepo.count();
    if (count > 0) {
      return;
    }
    console.log("criando database...");
    await this.storeRepo.clear();
    await this.storeRepo.save(initialStores);
    console.log("database criada");
  }
}
