import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { url, filename, contentType, uploadedBy } = await request.json()
    if (!url || !filename) {
      return NextResponse.json({ error: 'url and filename required' }, { status: 400 })
    }
    const photo = await prisma.photo.create({
      data: {
        filename,
        url,
        contentType: contentType || 'video/mp4',
        uploadedBy: uploadedBy || null,
        approved: true,
        deleted: false,
      },
    })
    return NextResponse.json({ success: true, photo })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Save media error:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
