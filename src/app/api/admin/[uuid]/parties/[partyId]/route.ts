import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valid admin UUIDs - same as in the main admin route
const ADMIN_UUIDS = [
  'admin-12345-67890-abcdef', // Replace with actual UUID
  'admin-67890-12345-fedcba'  // Add more as needed
]

export async function DELETE(
  request: NextRequest,
  { params }: { params: { uuid: string; partyId: string } }
) {
  try {
    // Check if UUID is valid
    if (!ADMIN_UUIDS.includes(params.uuid)) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      )
    }

    // Delete the party (guests will be deleted automatically due to cascade)
    await prisma.party.delete({
      where: {
        id: params.partyId
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
