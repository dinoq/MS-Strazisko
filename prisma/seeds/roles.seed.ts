import { PrismaClient, RoleNames } from '@prisma/client'

const prisma = new PrismaClient()

export const seedRoles = async () => {
    const roles = [
        {name: RoleNames.Admin},
        {name: RoleNames.User},
    ]

    const rolesInDB = (await prisma.role.findMany({}))

    const rolesToCreate = roles.filter(role => !rolesInDB.find(roleInDB => roleInDB.name == role.name))
    return await prisma.role.createMany({
        data: rolesToCreate
    })
}