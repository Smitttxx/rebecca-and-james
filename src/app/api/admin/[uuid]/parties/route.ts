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

    const { partyName, code, musicRequests, guests } = await request.json()

    if (!partyName || !guests || !Array.isArray(guests)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Handle code - validate if provided, otherwise generate
    let finalCode: string
    
    if (code && code.trim() !== '') {
      const trimmedCode = code.trim()
      
      // Validate length
      if (trimmedCode.length !== 4) {
        return NextResponse.json(
          { error: 'Invitation code must be exactly 4 characters' },
          { status: 400 }
        )
      }
      
      // Validate format (alphanumeric)
      if (!/^[A-Z0-9]{4}$/.test(trimmedCode)) {
        return NextResponse.json(
          { error: 'Invitation code must be 4 alphanumeric characters (A-Z, 0-9)' },
          { status: 400 }
        )
      }
      
      // Check if code already exists
      const existingParty = await prisma.party.findUnique({
        where: { code: trimmedCode }
      })
      
      if (existingParty) {
        return NextResponse.json(
          { error: 'Invitation code already exists. Please choose a different code.' },
          { status: 400 }
        )
      }
      
      finalCode = trimmedCode
    } else {
      // Generate a unique 4-digit code
      let isUnique = false
      let generatedCode = ''
      
      while (!isUnique) {
        generatedCode = Math.floor(1000 + Math.random() * 9000).toString()
        const existingParty = await prisma.party.findUnique({
          where: { code: generatedCode }
        })
        isUnique = !existingParty
      }
      
      finalCode = generatedCode
    }

    // Create the party with guests
    const party = await prisma.party.create({
      data: {
        code: finalCode,
        partyName,
        musicRequests: musicRequests?.trim() || null,
        guests: {
          create: guests.map((guest: { firstName: string; lastName: string; isChild?: boolean }) => ({
            firstName: guest.firstName,
            lastName: guest.lastName,
            isChild: guest.isChild || false
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
