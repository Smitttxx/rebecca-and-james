import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import path from 'path'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: 'Blob storage token not configured on server' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const uploadedBy = (formData.get('uploadedBy') as string | null) || null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const name = file.name.toLowerCase()
    const mime = file.type || ''
    const isImage =
      mime.startsWith('image/') ||
      /\.(heic|heif|heics|avif|webp|jpg|jpeg|jfif|png|gif|bmp|tif|tiff)$/i.test(name)

    if (!isImage) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 415 })
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — max 4.5MB` },
        { status: 413 }
      )
    }

    let buffer = Buffer.from(await file.arrayBuffer()) as Buffer
    let contentType = mime || 'image/jpeg'
    let uploadName = file.name

    const isHeic =
      mime.includes('heic') ||
      mime.includes('heif') ||
      /\.(heic|heif|heics)$/i.test(name)

    if (isHeic) {
      try {
        const sharp = (await import('sharp')).default
        buffer = await sharp(buffer).rotate().jpeg({ quality: 90 }).toBuffer()
        contentType = 'image/jpeg'
        uploadName = file.name.replace(/\.(heic|heif|heics)$/i, '.jpg')
      } catch {
        return NextResponse.json(
          { error: 'Failed to convert HEIC file' },
          { status: 415 }
        )
      }
    } else {
      // Auto-rotate based on EXIF data (silently skip if sharp fails)
      try {
        const sharp = (await import('sharp')).default
        buffer = await sharp(buffer).rotate().toBuffer()
      } catch {
        // Non-fatal — continue with original buffer
      }
    }

    const ext = path.extname(uploadName) || '.jpg'
    const filename = `photo-${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`

    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType,
    })

    const photo = await prisma.photo.create({
      data: {
        filename,
        url: blob.url,
        contentType,
        uploadedBy: uploadedBy || null,
        approved: true,
        deleted: false,
      },
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Image upload error:', error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
