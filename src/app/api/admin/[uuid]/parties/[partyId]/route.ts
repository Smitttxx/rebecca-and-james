import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Guest } from '@prisma/client'

// Valid admin UUIDs - same as in the main admin route
const ADMIN_UUIDS = [
  'admin-12345-67890-abcdef', // Replace with actual UUID
  'admin-67890-12345-fedcba'  // Add more as needed
]

interface IncomingGuest {
  id?: string
  firstName: string
  lastName: string
  isChild?: boolean
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; partyId: string }> }
) {
  try {
    const { uuid, partyId } = await params
    // Check if UUID is valid
    if (!ADMIN_UUIDS.includes(uuid)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { partyName, code, musicRequests, guests } = body

    // Validate code if provided
    if (code !== undefined && code !== null && code !== '') {
      const trimmedCode = code.trim()
      
      // Check length
      if (trimmedCode.length !== 4) {
        return NextResponse.json(
          { error: 'Invitation code must be exactly 4 characters' },
          { status: 400 }
        )
      }
      
      // Check format (alphanumeric)
      if (!/^[A-Z0-9]{4}$/.test(trimmedCode)) {
        return NextResponse.json(
          { error: 'Invitation code must be 4 alphanumeric characters (A-Z, 0-9)' },
          { status: 400 }
        )
      }
      
      // Check if code is being updated and if it's unique
      const existingParty = await prisma.party.findFirst({
        where: {
          code: trimmedCode,
          id: { not: partyId }
        }
      })
      
      if (existingParty) {
        return NextResponse.json(
          { error: 'Invitation code already exists. Please choose a different code.' },
          { status: 400 }
        )
      }
    }

    // Get existing guests to preserve RSVP data
    const existingGuests = await prisma.guest.findMany({
      where: { partyId: partyId }
    })

    // Update party details
    const updatedParty = await prisma.party.update({
      where: {
        id: partyId
      },
      data: {
        partyName,
        ...(code !== undefined && code !== null && code.trim() !== '' && { code: code.trim() }),
        musicRequests: musicRequests?.trim() || null
      }
    })

    if (guests && guests.length > 0) {
      // Match incoming guests to existing guests by ID first, then by name
      const guestsToUpdate: Array<{ existing: Guest; incoming: IncomingGuest }> = []
      const guestsToCreate: Array<IncomingGuest> = []
      const processedExistingIds = new Set<string>()

      for (const incomingGuest of guests) {
        // First try to match by ID if provided
        let match = incomingGuest.id 
          ? existingGuests.find(existing => existing.id === incomingGuest.id)
          : null

        // If no ID match, try matching by name
        if (!match) {
          match = existingGuests.find(
            existing => 
              existing.firstName.toLowerCase().trim() === incomingGuest.firstName.toLowerCase().trim() &&
              existing.lastName.toLowerCase().trim() === incomingGuest.lastName.toLowerCase().trim() &&
              !processedExistingIds.has(existing.id)
          )
        }

        if (match) {
          guestsToUpdate.push({ existing: match, incoming: incomingGuest })
          processedExistingIds.add(match.id)
        } else {
          guestsToCreate.push(incomingGuest)
        }
      }

      // Update existing guests (preserve all RSVP data, only update name/child status if changed)
      await Promise.all(
        guestsToUpdate.map(({ existing, incoming }) =>
          prisma.guest.update({
            where: { id: existing.id },
            data: {
              firstName: incoming.firstName,
              lastName: incoming.lastName,
              isChild: incoming.isChild ?? false,
              // Preserve all existing RSVP data - don't overwrite it
            }
          })
        )
      )

      // Create new guests that don't match existing ones
      await Promise.all(
        guestsToCreate.map((guest: IncomingGuest) =>
          prisma.guest.create({
            data: {
              firstName: guest.firstName,
              lastName: guest.lastName,
              isChild: guest.isChild ?? false,
              partyId: partyId
            }
          })
        )
      )

      // Delete guests that are no longer in the incoming list
      const guestsToDelete = existingGuests.filter(
        existing => !processedExistingIds.has(existing.id)
      )

      if (guestsToDelete.length > 0) {
        await prisma.guest.deleteMany({
          where: {
            id: { in: guestsToDelete.map(g => g.id) }
          }
        })
      }
    } else {
      // If no guests provided, delete all existing guests
      await prisma.guest.deleteMany({
        where: {
          partyId: partyId
        }
      })
    }

    return NextResponse.json({
      success: true,
      party: updatedParty,
      message: 'Party updated successfully'
    })
  } catch (error) {
    console.error('Error updating party:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ uuid: string; partyId: string }> }
) {
  try {
    const { uuid, partyId } = await params
    // Check if UUID is valid
    if (!ADMIN_UUIDS.includes(uuid)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    // Delete the party (guests will be deleted automatically due to cascade)
    await prisma.party.delete({
      where: {
        id: partyId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Party deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting party:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
