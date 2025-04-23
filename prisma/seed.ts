import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Generate 50 sample schools
  const schools = Array.from({ length: 50 }).map(() => ({
    name: `${faker.location.city()} ${faker.helpers.arrayElement(['High School', 'Academy', 'International School', 'Public School'])}`,
    address: faker.location.streetAddress(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude()
  }));

  // Clear existing data and seed new schools
  await prisma.school.deleteMany();
  await prisma.school.createMany({
    data: schools,
    skipDuplicates: true
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });