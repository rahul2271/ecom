import 'dotenv/config';
// 1. Explicitly import Role from @prisma/client
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding...');
  
  // Clean start
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create the Admin User
  await prisma.user.create({
    data: {
      name: 'Rahul Chauhan',
      email: 'admin@rctechsolutions.com',
      password: 'secure_password', // Ensure this is hashed in a real production app
      role: Role.ADMIN, // Now TypeScript can find 'Role'
      affiliateCode: 'rahul-admin',
    },
  });

  // 3. Create a Featured Product
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
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });