import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valid admin UUIDs - in production, you'd want to store these securely
const ADMIN_UUIDS = [
  'admin-12345-67890-abcdef', // Replace with actual UUID
  'admin-67890-12345-fedcba'  // Add more as needed
]

export async function GET(
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

    // Fetch all parties with their guests
    const parties = await prisma.party.findMany({
      include: {
        guests: {
          orderBy: {
            firstName: 'asc'
          }
        }
      },
      orderBy: {
        partyName: 'asc'
      }
    })

    // Calculate stats
    const totalParties = parties.length
    const totalGuests = parties.reduce((sum, party) => sum + party.guests.length, 0)
    const attendingGuests = parties.reduce((sum, party) => 
      sum + party.guests.filter(guest => guest.isAttending === true).length, 0
    )
    const totalResponses = parties.reduce((sum, party) => 
      sum + party.guests.filter(guest => guest.isAttending !== null).length, 0
    )

    const stats = {
      totalParties,
      totalGuests,
      attendingGuests,
      totalResponses
    }

    return NextResponse.json({
      parties,
      stats
    })
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
