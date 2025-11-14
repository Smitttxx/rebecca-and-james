import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Valid admin UUIDs
const ADMIN_UUIDS = [
  'admin-12345-67890-abcdef',
  'admin-67890-12345-fedcba'
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

    const { code, excludePartyId } = await request.json()

    if (!code || code.trim() === '') {
      return NextResponse.json({ available: true })
    }

    const trimmedCode = code.trim()

    // Check if code already exists
    const existingParty = await prisma.party.findFirst({
      where: {
        code: trimmedCode,
        ...(excludePartyId && { id: { not: excludePartyId } })
      }
    })

    return NextResponse.json({
      available: !existingParty,
      exists: !!existingParty
    })
  } catch (error) {
    console.error('Error checking code:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

