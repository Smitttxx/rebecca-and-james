import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { partyId, guests, musicRequests } = await request.json()

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

        // Get existing guests to check submission status
        const existingGuests = await Promise.all(
          guests.map(guest => 
            prisma.guest.findUnique({ where: { id: guest.id } })
          )
        )
        
        // Update guests
        const updatePromises = guests.map((guest, index) => {
          const existingGuest = existingGuests[index]
          
          // Check if this is the first submission (has meal selections but no submittedAt)
          const isFirstSubmission = !existingGuest?.submittedAt && 
            guest.starterSelection && 
            guest.mainSelection && 
            guest.dessertSelection
          
          return prisma.guest.update({
            where: { id: guest.id },
            data: {
              isAttending: guest.isAttending,
              dietaryRequirements: guest.dietaryRequirements,
              starterSelection: guest.starterSelection,
              mainSelection: guest.mainSelection,
              dessertSelection: guest.dessertSelection,
              email: guest.email,
              phone: guest.phone,
              useKidsMenu: guest.useKidsMenu ?? false,
              submittedAt: isFirstSubmission ? new Date() : existingGuest?.submittedAt
            }
          })
        })

        // Update party music requests
        if (musicRequests !== undefined) {
          await prisma.party.update({
            where: { id: partyId },
            data: {
              musicRequests: musicRequests || null
            }
          })
        }

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
