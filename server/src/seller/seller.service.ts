import { PrismaService } from '@micro-lib/database/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';

@Injectable()
export class SellerService {
  constructor(private readonly db: PrismaService) {}

  async createSeller(dto: CreateSellerDto) {
    if (!dto) {
      throw new Error('Invalid seller data');
    }

    // check for existing email or phone
    const existingSeller = await this.db.seller.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingSeller) {
      throw new Error('Seller with this email or phone already exists');
    }

    const seller = await this.db.seller.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        businessName: dto.businessName,
        category: dto.category,
        description: dto.description,
        idCard: dto.idCard,
      },
    });
    return seller;
  }

  async getAllSellers() {
    return this.db.seller.findMany();
  }

  async getSellerById(id: number) {
    return this.db.seller.findUnique({
      where: { id },
    });
  }
}
