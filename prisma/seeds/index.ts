import { seedRoles } from "./roles.seed";
import { seedUsers } from "./users.seed";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  await seedRoles();
  await seedUsers();
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
