import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextRequest, NextResponse } from 'next/server'

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
      onUploadCompleted: async () => {
        // Metadata is saved by the client via /api/photos/save-media after upload completes
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: 'Video upload failed' }, { status: 400 })
  }
}
