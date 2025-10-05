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
        image: 'https://kadis.com.ng/wp-content/uploads/2025/02/2-2.jpg',
      },
      {
        title: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard, blue switches',
        price: 79.99,
        inventory: 30,
        image:
          'https://m.media-amazon.com/images/I/71Mn3zh2laL._AC_SL1500_.jpg',
      },
      {
        title: 'Noise Cancelling Headphones',
        description: 'Over-ear headphones with active noise cancellation',
        price: 199.99,
        inventory: 20,
        image:
          'https://applepremiumstore.com.ng/wp-content/uploads/2022/07/71a5XAAbzbL._AC_SL1500_.jpg',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Products seeded');
}
