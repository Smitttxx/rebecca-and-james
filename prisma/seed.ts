import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.guest.deleteMany()
  await prisma.party.deleteMany()

  // Create Parties and Guests based on the exact spreadsheet - grouped by invitation code
  // All guests between one code and the next code are in the same party
  const parties = [
    // Row 1-4: Bride, Groom, Groomsmen, and Ring Bearer - Combined into one party
    {
      code: 'RJFC',
      partyName: 'Rebecca & James Family',
      guests: [
        { firstName: 'Rebecca', lastName: 'Hearne', fullName: 'Rebecca Hearne', guestTag: 'Bride', isChild: false },
        { firstName: 'James', lastName: 'Cupit', fullName: 'James Cupit', guestTag: 'Groom', isChild: false },
        { firstName: 'James-Thomas', lastName: 'Cupit', fullName: 'James-Thomas Cupit', guestTag: 'Groomsmen', isChild: false },
        { firstName: 'Theo', lastName: 'Cupit', fullName: 'Theo Cupit', guestTag: 'Ring Bearer', isChild: true }
      ]
    },
    {
      code: 'Q8AN',
      partyName: 'Smith Family',
      guests: [
        { firstName: 'Maria', lastName: 'Smith', fullName: 'Maria Smith', guestTag: 'Friends of the Couple', isChild: false },
        { firstName: 'Douglas', lastName: 'Smith', fullName: 'Douglas Smith', guestTag: 'Friends of the Couple', isChild: false },
      ]
    },
    // Row 5-6: MOB1 - Jackie Hearne & Mike Salvarno
    {
      code: 'MOB1',
      partyName: 'Jackie Hearne & Mike Salvarno',
      guests: [
        { firstName: 'Jackie', lastName: 'Hearne', fullName: 'Jackie Hearne', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Mike', lastName: 'Salvarno', fullName: 'Mike Salvarno', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 7-9: TLE4 - Thomas Jackson-Hearne Family
    {
      code: 'TLE4',
      partyName: 'Thomas Jackson-Hearne Family',
      guests: [
        { firstName: 'Thomas', lastName: 'Jackson-Hearne', fullName: 'Thomas Jackson-Hearne', guestTag: 'Best Man', isChild: false },
        { firstName: 'Leah', lastName: 'Jackson-Hearne', fullName: 'Leah Jackson-Hearne', guestTag: 'Bridesmaid', isChild: false },
        { firstName: 'Ewan', lastName: 'Jackson-Hearne', fullName: 'Ewan Jackson-Hearne', guestTag: 'Bride Family', isChild: true }
      ]
    },
    // Row 10-11: MOG7 - Sheila Cupit & Robbie Cupit
    {
      code: 'MOG7',
      partyName: 'Sheila Cupit & Robbie Cupit',
      guests: [
        { firstName: 'Sheila', lastName: 'Cupit', fullName: 'Sheila Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Robbie', lastName: 'Cupit', fullName: 'Robbie Cupit', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 12-13: J4E3 - John & Eileen Bethel
    {
      code: 'J4E3',
      partyName: 'John & Eileen Bethel',
      guests: [
        { firstName: 'John', lastName: 'Bethel', fullName: 'John Bethel', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Eileen', lastName: 'Bethel', fullName: 'Eileen Bethel', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 14-15: T9SO - Sam Rigby & Tom Cupit
    {
      code: 'T9SO',
      partyName: 'Sam Rigby & Tom Cupit',
      guests: [
        { firstName: 'Sam', lastName: 'Rigby', fullName: 'Sam Rigby', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Tom', lastName: 'Cupit', fullName: 'Tom Cupit', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 16: FOB6 - Noel Raison
    {
      code: 'FOB6',
      partyName: 'Noel Raison',
      guests: [
        { firstName: 'Noel', lastName: 'Raison', fullName: 'Noel Raison', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 17-18: UZ8I - Zoe Noble & Ivan Noble
    {
      code: 'UZ8I',
      partyName: 'Zoe Noble & Ivan Noble',
      guests: [
        { firstName: 'Zoe', lastName: 'Noble', fullName: 'Zoe Noble', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Ivan', lastName: 'Noble', fullName: 'Ivan Noble', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 19-20: 2BQS - Boyd Raison & Seamus Doherty
    {
      code: '2BQS',
      partyName: 'Boyd Raison & Seamus Doherty',
      guests: [
        { firstName: 'Boyd', lastName: 'Raison', fullName: 'Boyd Raison', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Seamus', lastName: 'Doherty', fullName: 'Seamus Doherty', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 21-22: E5H3 - Emily Hearne & John Meacock
    {
      code: 'E5H3',
      partyName: 'Emily Hearne & John Meacock',
      guests: [
        { firstName: 'Emily', lastName: 'Hearne', fullName: 'Emily Hearne', guestTag: 'Bridesmaid', isChild: false },
        { firstName: 'John', lastName: 'Meacock', fullName: 'John Meacock', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 23-26: NHCJ - Nicola Blackmore Family
    {
      code: 'NHCJ',
      partyName: 'Nicola Blackmore Family',
      guests: [
        { firstName: 'Nicola', lastName: 'Blackmore', fullName: 'Nicola Blackmore', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Holly', lastName: 'Blackmore', fullName: 'Holly Blackmore', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Cameron', lastName: 'Blackmore', fullName: 'Cameron Blackmore', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Jessica', lastName: 'Hearne', fullName: 'Jessica Hearne', guestTag: 'Bride Family', isChild: true }
      ]
    },
    // Row 27-30: NC3E - Natalie Sweeting Family
    {
      code: 'NC3E',
      partyName: 'Natalie Sweeting Family',
      guests: [
        { firstName: 'Natalie', lastName: 'Sweeting', fullName: 'Natalie Sweeting', guestTag: 'MOH', isChild: false },
        { firstName: 'Colin', lastName: 'Knowles', fullName: 'Colin Knowles', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Elisia', lastName: 'Sweeting', fullName: 'Elisia Sweeting', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Elayah', lastName: 'Sweeting', fullName: 'Elayah Sweeting', guestTag: 'Bride Family', isChild: true }
      ]
    },
    // Row 31-35: GCM1 - Gary Cupit Family
    {
      code: 'GCM1',
      partyName: 'Gary Cupit Family',
      guests: [
        { firstName: 'Gary', lastName: 'Cupit', fullName: 'Gary Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Catherine', lastName: 'Crothers', fullName: 'Catherine Crothers', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Megan', lastName: 'Cupit', fullName: 'Megan Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Little Gary', lastName: 'Cupit', fullName: 'Little Gary Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Isobel', lastName: 'Cupit', fullName: 'Isobel Cupit', guestTag: 'Groom Family', isChild: true }
      ]
    },
    // Row 36-40: B53M - Barry Cupit Family
    {
      code: 'B53M',
      partyName: 'Barry Cupit Family',
      guests: [
        { firstName: 'Barry', lastName: 'Cupit', fullName: 'Barry Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Rose', lastName: 'Kayes', fullName: 'Rose Kayes', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Dylan', lastName: 'Kayes', fullName: 'Dylan Kayes', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Eliza', lastName: 'Cupit', fullName: 'Eliza Cupit', guestTag: 'Groom Family', isChild: true },
        { firstName: 'Matilda', lastName: 'Cupit', fullName: 'Matilda Cupit', guestTag: 'Groom Family', isChild: true }
      ]
    },
    // Row 41-43: PK7F - Peter Cupit Family (including Katie Sheard)
    {
      code: 'PK7F',
      partyName: 'Peter Cupit Family',
      guests: [
        { firstName: 'Peter', lastName: 'Cupit', fullName: 'Peter Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Finley', lastName: 'Cupit', fullName: 'Finley Cupit', guestTag: 'Groom Family', isChild: true },
        { firstName: 'Katie', lastName: 'Sheard', fullName: 'Katie Sheard', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 44-45: LJ4A - Laura Austin & Joe Austin
    {
      code: 'LJ4A',
      partyName: 'Laura Austin & Joe Austin',
      guests: [
        { firstName: 'Laura', lastName: 'Austin', fullName: 'Laura Austin', guestTag: 'Bridesmaid', isChild: false },
        { firstName: 'Joe', lastName: 'Austin', fullName: 'Joe Austin', guestTag: 'Friend', isChild: false }
      ]
    },
    // Row 46-47: EV3C - Ellie Vann & Connor Costello
    {
      code: 'EV3C',
      partyName: 'Ellie Vann & Connor Costello',
      guests: [
        { firstName: 'Ellie', lastName: 'Vann', fullName: 'Ellie Vann', guestTag: 'Friend', isChild: false },
        { firstName: 'Connor', lastName: 'Costello', fullName: 'Connor Costello', guestTag: 'Friend', isChild: false }
      ]
    },
    // Row 48-49: B3RC - Becca Roberts & Sonny Cannon
    {
      code: 'B3RC',
      partyName: 'Becca Roberts & Sonny Cannon',
      guests: [
        { firstName: 'Becca', lastName: 'Roberts', fullName: 'Becca Roberts', guestTag: 'Friend', isChild: false },
        { firstName: 'Sonny', lastName: 'Cannon', fullName: 'Sonny Cannon', guestTag: 'Friend', isChild: false }
      ]
    },
    // Row 50-52: P9PJ - Paul Hearne Family
    {
      code: 'P9PJ',
      partyName: 'Paul Hearne Family',
      guests: [
        { firstName: 'Paul', lastName: 'Hearne', fullName: 'Paul Hearne', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Paula', lastName: 'Riley', fullName: 'Paula Riley', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Joel', lastName: 'Riley', fullName: 'Joel Riley', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 53-55: CJ7L - Carol Farrelly Family
    {
      code: 'CJ7L',
      partyName: 'Carol Farrelly Family',
      guests: [
        { firstName: 'Carol', lastName: 'Farrelly', fullName: 'Carol Farrelly', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Lana', lastName: 'Farrelly', fullName: 'Lana Farrelly', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Callum', lastName: 'Farrelly', fullName: 'Callum Farrelly', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 56-57: G7SM - Gemma & Leah Hearne
    {
      code: 'G7SM',
      partyName: 'Gemma & Leah Hearne',
      guests: [
        { firstName: 'Gemma', lastName: 'Hearne', fullName: 'Gemma Hearne', guestTag: 'Bride Family', isChild: false },
        { firstName: 'Leah', lastName: 'Hearne', fullName: 'Leah Hearne', guestTag: 'Bride Family', isChild: false }
      ]
    },
    // Row 58-59: SJ3C - Stan & Jackie Cupit
    {
      code: 'SJ3C',
      partyName: 'Stan & Jackie Cupit',
      guests: [
        { firstName: 'Stan', lastName: 'Cupit', fullName: 'Stan Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Jackie', lastName: 'Cupit', fullName: 'Jackie Cupit', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 60-61: R6AC - John (Red) & Adelle Cupit
    {
      code: 'R6AC',
      partyName: 'John (Red) & Adelle Cupit',
      guests: [
        { firstName: 'John (Red)', lastName: 'Cupit', fullName: 'John (Red) Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Adelle', lastName: 'Cupit', fullName: 'Adelle Cupit', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 62: NPC2 - Neil Cupit
    {
      code: 'NPC2',
      partyName: 'Neil Cupit',
      guests: [
        { firstName: 'Neil', lastName: 'Cupit', fullName: 'Neil Cupit', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 63-64: UJ3A - John & Anne Cupit
    {
      code: 'UJ3A',
      partyName: 'John & Anne Cupit',
      guests: [
        { firstName: 'John', lastName: 'Cupit', fullName: 'John Cupit', guestTag: 'Groom Family', isChild: false },
        { firstName: 'Anne', lastName: 'Cupit', fullName: 'Anne Cupit', guestTag: 'Groom Family', isChild: false }
      ]
    },
    // Row 65: MJ4G - Graeme Moore
    {
      code: 'MJ4G',
      partyName: 'Graeme Moore',
      guests: [
        { firstName: 'Graeme', lastName: 'Moore', fullName: 'Graeme Moore', guestTag: 'Friend', isChild: false }
      ]
    },
    // Row 66-71: Updated with new codes
    {
      code: '7SH2',
      partyName: 'Tom Killick',
      guests: [
        { firstName: 'Tom', lastName: 'Killick', fullName: 'Tom Killick', guestTag: 'Friend', isChild: false }
      ]
    },
    {
      code: '2S6T',
      partyName: 'Patrick Truran',
      guests: [
        { firstName: 'Patrick', lastName: 'Truran', fullName: 'Patrick Truran', guestTag: '', isChild: false }
      ]
    },
    {
      code: '9SB3',
      partyName: 'Samir Ahmed',
      guests: [
        { firstName: 'Samir', lastName: 'Ahmed', fullName: 'Samir Ahmed', guestTag: '', isChild: false }
      ]
    },
    {
      code: 'YS78',
      partyName: 'Abbie Potter',
      guests: [
        { firstName: 'Abbie', lastName: 'Potter', fullName: 'Abbie Potter', guestTag: '', isChild: false }
      ]
    },
    {
      code: '3S1B',
      partyName: 'Chris Daniels',
      guests: [
        { firstName: 'Chris', lastName: 'Daniels', fullName: 'Chris Daniels', guestTag: '', isChild: false }
      ]
    },
    {
      code: '5F2N',
      partyName: 'Mike Toole',
      guests: [
        { firstName: 'Mike', lastName: 'Toole', fullName: 'Mike Toole', guestTag: '', isChild: false }
      ]
    }
  ]

  // Create all parties
  for (const partyData of parties) {
    const party = await prisma.party.create({
      data: {
        code: partyData.code,
        partyName: partyData.partyName,
        guests: {
          create: partyData.guests.map(guest => ({
            firstName: guest.firstName,
            lastName: guest.lastName,
            fullName: guest.fullName,
            guestTag: guest.guestTag,
            isChild: guest.isChild,
            useKidsMenu: guest.isChild ? true : false
          }))
        }
      },
      include: {
        guests: true
      }
    })
    console.log(`✅ Created party: ${party.partyName} (Code: ${party.code}, ${party.guests.length} guest${party.guests.length > 1 ? 's' : ''})`)
  }

  const totalGuests = parties.reduce((sum, p) => sum + p.guests.length, 0)
  console.log('\n🎉 Database seeded successfully!')
  console.log(`📊 Total: ${parties.length} parties, ${totalGuests} guests`)
  console.log('\n📋 Test invitation codes:')
  parties.slice(0, 15).forEach(party => {
    console.log(`  ${party.code} - ${party.partyName} (${party.guests.length} guest${party.guests.length > 1 ? 's' : ''})`)
  })
  if (parties.length > 15) {
    console.log(`  ... and ${parties.length - 15} more parties`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
