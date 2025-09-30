/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './seed-admin';
import { seedUser } from './seed-user';
import { seedProducts } from './seed-products';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  await seedAdmin();
  await seedUser();
  await seedProducts();

  console.log('✅ Seeding completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    void prisma.$disconnect();
  });
