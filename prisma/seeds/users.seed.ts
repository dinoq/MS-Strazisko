import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const seedUsers = async () => {
  const adminRole = (await prisma.role.findUnique({
    where: {
      name: "Admin",
    },
  }))?.id_role;

  if(!adminRole){
    return;
  }

  await prisma.user.create({
    data: {
      username: "admin",
      password_hash: await bcrypt.hash("test", 12),
      Role: {
        connect: {
          id_role: adminRole,
        },
      },
    },
  });
};
