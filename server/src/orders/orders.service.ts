import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@micro-lib/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly db: PrismaService) {}

  async create(userId: number, dto: CreateOrderDto) {
    return this.db.$transaction(async (tx) => {
      let total = 0;

      // check stock for each item
      for (const item of dto.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }
        if (product.inventory < item.quantity) {
          throw new BadRequestException(
            `Product ${product.title} is out of stock`,
          );
        }
        total += product.price * item.quantity;
      }

      // deduct stock
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { inventory: { decrement: item.quantity } },
        });
      }

      // create order
      const order = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: await Promise.all(
              dto.items.map(async (item) => {
                const product = await tx.product.findUnique({
                  where: { id: item.productId },
                });
                return {
                  productId: item.productId,
                  quantity: item.quantity,
                  price: product!.price,
                };
              }),
            ),
          },
        },
        include: { items: true },
      });

      return order;
    });
  }

  async findMyOrders(userId: number) {
    return this.db.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async findAll() {
    return this.db.order.findMany({
      include: {
        user: { select: { id: true, email: true } },
        items: { include: { product: true } },
      },
    });
  }

  async count() {
    try {
      const count = await this.db.order.count();
      return { count };
    } catch (error) {
      throw new BadRequestException('Could not retrieve order count', error);
    }
  }

  async revenue() {
    const sum = await this.db.order.aggregate({
      _sum: { total: true },
    });
    return { revenue: sum._sum.total ?? 0 };
  }
}
