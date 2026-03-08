import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    try {
        const usersCount = await prisma.user.count();
        console.log("Users configured:", usersCount);
        const citiesCount = await prisma.city.count();
        console.log("Cities configured:", citiesCount);

        // Test write if there's a user
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            console.log("First user ID:", firstUser.id);
        }
    } catch (err) {
        console.error("Prisma error:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
