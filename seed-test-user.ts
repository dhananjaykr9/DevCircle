import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "test@example.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const firstCity = await prisma.city.findFirst();
    let cityId = firstCity?.id;
    if (!cityId) {
        const newCity = await prisma.city.create({ data: { name: 'TestCity', state: 'TS', tier: 'Tier-1', tags: 'tech', isActive: true } });
        cityId = newCity.id;
    }

    const testUser = await prisma.user.upsert({
        where: { email },
        update: { hashedPassword, onboarded: true, cityId },
        create: {
            email,
            hashedPassword,
            name: "Test User",
            onboarded: true,
            cityId
        }
    });

    console.log("Test user created/updated:", testUser.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
