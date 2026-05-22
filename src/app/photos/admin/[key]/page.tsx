import { notFound } from 'next/navigation'
import AdminGalleryClient from './AdminGalleryClient'

interface Props {
  params: Promise<{ key: string }>
}

export default async function AdminGalleryPage({ params }: Props) {
  const { key } = await params
  const adminKey = process.env.PHOTO_ADMIN_KEY

  if (!adminKey || key !== adminKey) {
    notFound()
  }

  return <AdminGalleryClient />
}
