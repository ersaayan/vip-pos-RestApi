import { Injectable } from '@nestjs/common';
import { CreateStockCartDto } from './dto/create-stock-cart.dto';
import { UpdateStockCartDto } from './dto/update-stock-cart.dto';

@Injectable()
export class StockCartsService {
  create(createStockCartDto: CreateStockCartDto) {
    return 'This action adds a new stockCart';
  }

  findAll() {
    return `This action returns all stockCarts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockCart`;
  }

  update(id: number, updateStockCartDto: UpdateStockCartDto) {
    return `This action updates a #${id} stockCart`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockCart`;
  }
}
