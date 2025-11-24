'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const NotFoundContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: ${theme.spacing.xxl};
  align-items: center;
  min-height: 60vh;
  padding: ${theme.spacing.xl};
  margin: 0 auto;
  max-width: 1200px;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xl};
    text-align: center;
  }
`

const NotFoundImage = styled.div`
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  
  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }
`

const NotFoundContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    text-align: center;
  }
`

const NotFoundTitle = styled.h1`
  font-family: ${theme.fonts.serif};
  font-size: 3rem;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: ${theme.spacing.md};
  font-weight: 400;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 4rem;
  }
`

const NotFoundSubtitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.5rem;
  color: ${theme.colors.neutral.gray};
  margin-bottom: ${theme.spacing.lg};
  font-weight: 300;
`

const NotFoundText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.1rem;
  color: ${theme.colors.neutral.darkGray};
  margin-bottom: ${theme.spacing.xl};
  max-width: 500px;
  line-height: 1.6;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  flex-wrap: wrap;
  justify-content: center;
`

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.primary.eucalyptusDark};
  color: ${theme.colors.neutral.white};
  text-decoration: none;
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.primary.eucalyptus};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  background: ${theme.colors.neutral.white};
  color: ${theme.colors.primary.eucalyptusDark};
  border: 2px solid ${theme.colors.primary.eucalyptusDark};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.primary.eucalyptusDark};
    color: ${theme.colors.neutral.white};
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`

export default function NotFound() {
  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <Layout activePage="404">
      <NotFoundContainer>
        <NotFoundContent>
          <NotFoundTitle>404</NotFoundTitle>
          <NotFoundSubtitle>Oops! Page Not Found</NotFoundSubtitle>
          <NotFoundText>
            Looks like you&apos;ve wandered off the beaten path! Don&apos;t worry, 
            even the best wedding guests sometimes take a wrong turn. Let&apos;s get you back to the celebration!
          </NotFoundText>
          
          <ButtonGroup>
            <HomeButton href="/">
              <FontAwesomeIcon icon={faHome} />
              Back to Home
            </HomeButton>
            <BackButton onClick={goBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
              Go Back
            </BackButton>
          </ButtonGroup>
        </NotFoundContent>
        <NotFoundImage>
          <Image 
            src="/404.avif" 
            alt="404 Not Found - Funny Image"
            width={200}
            height={200}
          />
        </NotFoundImage>
      </NotFoundContainer>
    </Layout>
  )
}
