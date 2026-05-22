'use client'

import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Layout from '@/components/Layout'

const PhotoGallery = dynamic(() => import('@/components/PhotoGallery'), {
  ssr: false,
  loading: () => (
    <LoadingWrap>
      <span style={{ fontFamily: theme.fonts.body, color: theme.colors.neutral.gray }}>
        Loading memories…
      </span>
    </LoadingWrap>
  ),
})

const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem;
`

const PageTitle = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 2rem;
  color: ${theme.colors.primary.eucalyptus};
  text-align: center;
  margin: 1.5rem 0 0.5rem;
  @media (min-width: ${theme.breakpoints.mobile}) { font-size: 2.5rem; }
`

const PageSub = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.gray};
  text-align: center;
  margin: 0 0 1.5rem;
  font-style: italic;
`

export default function GalleryPage() {
  return (
    <Layout activePage="gallery">
      <PageTitle>Rebecca & James</PageTitle>
      <PageSub>Every photo tells a story — thank you for sharing yours</PageSub>
      <PhotoGallery isAdmin={false} />
    </Layout>
  )
}
