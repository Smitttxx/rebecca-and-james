import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50')))
    const uploader = searchParams.get('uploader') ?? ''

    const baseWhere = { approved: true, deleted: false }
    const where = {
      ...baseWhere,
      ...(uploader
        ? { uploadedBy: { startsWith: uploader, mode: 'insensitive' as const } }
        : {}),
    }

    const [totalPhotos, photos, uniqueUploaders] = await Promise.all([
      prisma.photo.count({ where }),
      prisma.photo.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, url: true, contentType: true, uploadedBy: true, uploadedAt: true, filename: true },
      }),
      prisma.photo.groupBy({
        by: ['uploadedBy'],
        where: { ...baseWhere, uploadedBy: { not: null } },
      }),
    ])

    const totalPages = Math.ceil(totalPhotos / limit)

    return NextResponse.json({
      photos,
      pagination: {
        currentPage: page,
        totalPages,
        totalPhotos,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
      uploaders: uniqueUploaders.map((u) => u.uploadedBy).filter(Boolean),
    })
  } catch (error) {
    console.error('Error fetching photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}
