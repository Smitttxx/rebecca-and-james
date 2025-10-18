import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create sample parties with guests
  const parties = [
    {
      code: '1234',
      partyName: 'The Smith Family',
      maxGuests: 2,
      guests: [
        {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@email.com',
          phone: '(555) 123-4567',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        }
      ]
    },
    {
      code: '5678',
      partyName: 'The Johnson Family',
      maxGuests: 3,
      guests: [
        {
          firstName: 'Michael',
          lastName: 'Johnson',
          email: 'michael.johnson@email.com',
          phone: '(555) 234-5678',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        },
        {
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@email.com',
          phone: '(555) 234-5678',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        },
        {
          firstName: 'Emma',
          lastName: 'Johnson',
          email: 'emma.johnson@email.com',
          phone: '(555) 234-5678',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        }
      ]
    },
    {
      code: '9012',
      partyName: 'The Williams Family',
      maxGuests: 1,
      guests: [
        {
          firstName: 'Robert',
          lastName: 'Williams',
          email: 'robert.williams@email.com',
          phone: '(555) 345-6789',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        }
      ]
    },
    {
      code: '3456',
      partyName: 'The Brown Family',
      maxGuests: 2,
      guests: [
        {
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@email.com',
          phone: '(555) 456-7890',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        },
        {
          firstName: 'Lisa',
          lastName: 'Brown',
          email: 'lisa.brown@email.com',
          phone: '(555) 456-7890',
          isAttending: null,
          dietaryRequirements: null,
          menuSelection: null
        }
      ]
    }
  ]

  // Clear existing data
  await prisma.guest.deleteMany()
  await prisma.party.deleteMany()

  // Create parties and guests
  for (const partyData of parties) {
    const { guests, ...partyInfo } = partyData
    
    const party = await prisma.party.create({
      data: {
        ...partyInfo,
        guests: {
          create: guests
        }
      }
    })

    console.log(`✅ Created party: ${party.partyName} (Code: ${party.code})`)
  }

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Test invitation codes:')
  console.log('  1234 - The Smith Family (2 guests)')
  console.log('  5678 - The Johnson Family (3 guests)')
  console.log('  9012 - The Williams Family (1 guest)')
  console.log('  3456 - The Brown Family (2 guests)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
