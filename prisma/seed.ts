import { PrismaClient } from '@prisma/client'
import { cities } from '../src/lib/data'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding initial setup for DevCircle...')

    // Insert Cities 
    for (const city of cities) {
        await prisma.city.upsert({
            where: { name: city.name },
            update: {},
            create: {
                name: city.name,
                state: city.state,
                tier: city.tier,
                tags: city.tags.join(','),
                isActive: city.active,
            },
        })
    }

    console.log('Seeding complete! Only foundational data (cities) remains. No fake data.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
