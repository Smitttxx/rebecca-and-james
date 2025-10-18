import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { partyId, guests } = await request.json()

    if (!partyId || !guests || !Array.isArray(guests)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Verify party exists
    const party = await prisma.party.findUnique({
      where: { id: partyId }
    })

    if (!party) {
      return NextResponse.json(
        { error: 'Party not found' },
        { status: 404 }
      )
    }

    // Update guests
    const updatePromises = guests.map(guest => 
      prisma.guest.update({
        where: { id: guest.id },
        data: {
          isAttending: guest.isAttending,
          dietaryRequirements: guest.dietaryRequirements,
          menuSelection: guest.menuSelection,
          email: guest.email,
          phone: guest.phone
        }
      })
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      message: 'RSVP submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting RSVP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
