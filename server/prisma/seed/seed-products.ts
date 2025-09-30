import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProducts() {
  await prisma.product.createMany({
    data: [
      {
        title: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with long battery life',
        price: 25.99,
        inventory: 50,
      },
      {
        title: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard, blue switches',
        price: 79.99,
        inventory: 30,
      },
      {
        title: 'Noise Cancelling Headphones',
        description: 'Over-ear headphones with active noise cancellation',
        price: 199.99,
        inventory: 20,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Products seeded');
}
