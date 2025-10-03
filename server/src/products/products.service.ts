import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@micro-lib/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly db: PrismaService) {}

  async findAll(page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    // type-safe declaration
    const where: Prisma.ProductWhereInput = { deleted: false };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const [items, total] = await this.db.$transaction([
      this.db.product.findMany({ where, skip, take: limit }),
      this.db.product.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit },
    };
  }

  async findOne(id: number) {
    const product = await this.db.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.db.product.create({ data: dto });
  }

  async update(id: number, dto: UpdateProductDto) {
    return this.db.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException(`Product ${id} not found`);
      }

      // optional: validate stock change
      if (dto.inventory !== undefined && dto.inventory < 0) {
        throw new BadRequestException('Inventory cannot be negative');
      }

      return tx.product.update({
        where: { id },
        data: dto,
      });
    });
  }

  async remove(id: number) {
    const product = await this.db.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);

    await this.db.product.update({
      where: { id },
      data: { deleted: true },
    });

    return { message: `Product ${id} has been soft-deleted.` };
  }
}
