import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valid admin UUIDs
const ADMIN_UUIDS = [
  'admin-12345-67890-abcdef', // Replace with actual UUID
  'admin-67890-12345-fedcba'  // Add more as needed
]

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string }> }
) {
  try {
    const { uuid } = await params
    // Check if UUID is valid
    if (!ADMIN_UUIDS.includes(uuid)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const { partyName, maxGuests, guests } = await request.json()

    if (!partyName || !maxGuests || !guests || !Array.isArray(guests)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique 4-digit code
    let code: string
    let isUnique = false
    
    while (!isUnique) {
      code = Math.floor(1000 + Math.random() * 9000).toString()
      const existingParty = await prisma.party.findUnique({
        where: { code }
      })
      isUnique = !existingParty
    }

    // Create the party with guests
    const party = await prisma.party.create({
      data: {
        code: code!,
        partyName,
        maxGuests: parseInt(maxGuests),
        guests: {
          create: guests.map((guest: { firstName: string; lastName: string }) => ({
            firstName: guest.firstName,
            lastName: guest.lastName
          }))
        }
      },
      include: {
        guests: true
      }
    })

    return NextResponse.json({
      success: true,
      party,
      message: 'Party created successfully'
    })
  } catch (error) {
    console.error('Error creating party:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
