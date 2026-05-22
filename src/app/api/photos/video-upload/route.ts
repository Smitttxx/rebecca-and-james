import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => ({
        allowedContentTypes: ['video/*'],
        maximumSizeInBytes: 250 * 1024 * 1024,
        tokenPayload: clientPayload ?? '',
        cacheControlMaxAge: 31536000,
      }),
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        try {
          const uploadedBy = tokenPayload || null
          await prisma.photo.create({
            data: {
              filename: blob.pathname,
              url: blob.url,
              contentType: blob.contentType || 'video/mp4',
              uploadedBy,
              approved: true,
              deleted: false,
            },
          })
        } catch (err) {
          console.error('Failed to save video metadata:', err)
          throw err
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: 'Video upload failed' }, { status: 400 })
  }
}
