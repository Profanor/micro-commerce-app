import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@micro-lib/database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { Multer } from 'multer';
import { parse } from 'csv-parse/sync';

interface CsvProductRow {
  title: string;
  description?: string;
  price: string | number;
  inventory?: string | number;
  stock?: string | number;
  imageUrl: string;
}

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

  async bulkUpload(file: Multer.File) {
    try {
      const records = this.parseCsv(file.buffer);
      if (!records.length)
        throw new BadRequestException('CSV file is empty or invalid');

      const validProducts: CreateProductDto[] = [];
      const failed: { index: number; error: string }[] = [];

      // validate & sanitize input
      records.forEach((row, index) => {
        try {
          const dto: CreateProductDto = {
            title: row.title?.trim(),
            description: row.description?.trim() || '',
            price: Number(row.price),
            inventory: Number(row.inventory ?? row.stock ?? 0),
            image: row.imageUrl?.trim(),
          };

          if (!dto.title || !dto.price || !dto.image) {
            throw new Error('Missing required fields (title, price, imageUrl)');
          }

          if (isNaN(dto.price)) throw new Error('Invalid price format');
          if (isNaN(dto.inventory)) dto.inventory = 0;

          validProducts.push(dto);
        } catch (err) {
          failed.push({ index: index + 1, error: err.message });
        }
      });

      if (!validProducts.length)
        throw new BadRequestException('No valid records found in the CSV');

      // find existing products (by title or image)
      const titles = validProducts
        .map((p) => p.title)
        .filter((t): t is string => typeof t === 'string' && t.length > 0);
      const images = validProducts
        .map((p) => p.image)
        .filter((i): i is string => typeof i === 'string' && i.length > 0);

      const existing = await this.db.product.findMany({
        where: {
          OR: [{ title: { in: titles } }, { image: { in: images } }],
        },
        select: { title: true, image: true },
      });

      const existingTitles = new Set(existing.map((p) => p.title));
      const existingImages = new Set(existing.map((p) => p.image));

      // filter out duplicates
      const uniqueProducts = validProducts.filter(
        (p) =>
          !existingTitles.has(typeof p.title === 'string' ? p.title : '') &&
          !existingImages.has(typeof p.image === 'string' ? p.image : ''),
      );

      // create new products
      const created = await this.db.product.createMany({
        data: uniqueProducts,
        skipDuplicates: true,
      });

      // return summary
      const skippedCount = validProducts.length - uniqueProducts.length;

      return {
        success: true,
        createdCount: created.count,
        skippedCount,
        failedCount: failed.length,
        failed,
        message: `Upload complete: ${created.count} created, ${skippedCount} skipped, ${failed.length} failed.`,
      };
    } catch (error) {
      console.error('Error during CSV upload', error);
      throw new BadRequestException(
        error.message || 'Error processing CSV upload',
      );
    }
  }

  private parseCsv(buffer: Buffer): CsvProductRow[] {
    try {
      return parse(buffer.toString(), {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (err) {
      throw new BadRequestException('Failed to parse CSV file', err);
    }
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

  async count() {
    try {
      const count = await this.db.product.count({ where: { deleted: false } });
      return { count };
    } catch (error) {
      throw new BadRequestException('Could not retrieve product count', error);
    }
  }
}
