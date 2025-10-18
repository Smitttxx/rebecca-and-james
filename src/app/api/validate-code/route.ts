import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || code.length !== 4) {
      return NextResponse.json(
        { error: 'Invalid invitation code format' },
        { status: 400 }
      )
    }

    // Find party by code
    const party = await prisma.party.findUnique({
      where: { code },
      include: {
        guests: true
      }
    })

    if (!party) {
      return NextResponse.json(
        { error: 'Invalid invitation code' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      party: {
        id: party.id,
        partyName: party.partyName,
        maxGuests: party.maxGuests,
        guests: party.guests.map(guest => ({
          id: guest.id,
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: guest.email,
          phone: guest.phone,
          isAttending: guest.isAttending,
          dietaryRequirements: guest.dietaryRequirements,
          menuSelection: guest.menuSelection
        }))
      }
    })
  } catch (error) {
    console.error('Error validating invitation code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
