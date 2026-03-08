import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter }); // Fixes the Prisma 7 constructor error

async function main() {
  console.log('Seeding...');
  // Your existing seed logic here...
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  await prisma.user.create({
    data: {
      name: 'Rahul Chauhan',
      email: 'admin@rctechsolutions.com',
      password: 'secure_password',
      role: Role.ADMIN,
      affiliateCode: 'rahul-admin',
    },
  });

  await prisma.product.create({
    data: {
      name: 'Aero 4K Drone',
      description: 'Foldable 4K drone with 3-axis gimbal.',
      price: 45000,
      category: 'Drones',
      stock: 15,
      images: ['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9'],
    }
  });

  console.log('✅ Seed successful!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });



 