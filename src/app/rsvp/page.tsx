'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import Image from 'next/image'

const InvitationContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, ${theme.colors.neutral.cream} 0%, ${theme.colors.primary.sageLight} 100%);
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    background-image: url('/photo-1596751303147-05d69e653ca4 (1).avif');
    background-size: cover;
    background-position: center top -230px;
    background-repeat: no-repeat;
  }
`

const BackgroundImage = styled(Image)`
  display: none;
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    display: block;
    width: 100%;
    height: auto;
    position: relative;
    top: -230px;
    margin-bottom: -230px;
  }
`

const FormOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    top: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    padding-top: 0;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    top: 45%;
  }
`


const InvitationCard = styled.div`
  width: 85%;
  max-width: 500px;
  background: ${theme.colors.neutral.white};
  border: 2px solid ${theme.colors.secondary.gold};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  box-shadow: ${theme.shadows.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 80%;
    max-width: 550px;
    padding: ${theme.spacing.xxl};
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    width: 70%;
    max-width: 600px;
    padding: ${theme.spacing.xxxl};
    background: transparent;
    border: none;
    box-shadow: none;
  }
`

const SunflowerDecoration = styled.div`
  width: 50px;
  height: 50px;
  background-image: url('/sunflower.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: ${theme.spacing.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 80px;
    height: 80px;
    margin-bottom: ${theme.spacing.md};
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    width: 100px;
    height: 100px;
    margin-bottom: ${theme.spacing.md};
  }
`

const InvitationTitle = styled.h1`
  font-family: ${theme.fonts.serif};
  font-size: 1.8rem;
  font-weight: 400;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
    margin-bottom: ${theme.spacing.md};
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 2.5rem;
    margin-bottom: ${theme.spacing.md};
  }
`

const InvitationSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.primary.eucalyptusDark};
  text-align: center;
  margin-bottom: ${theme.spacing.xs};
  line-height: 1.5;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
    margin-bottom: ${theme.spacing.sm};
    line-height: 1.6;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 1.1rem;
    margin-bottom: ${theme.spacing.sm};
  }
`

const CodeHint = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.75rem;
  color: ${theme.colors.neutral.gray};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
  font-style: italic;
  line-height: 1.5;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.85rem;
    margin-bottom: ${theme.spacing.lg};
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 0.9rem;
    margin-bottom: ${theme.spacing.xl};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    gap: ${theme.spacing.lg};
  }
`

const Label = styled.label`
  font-family: ${theme.fonts.serif};
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.primary.eucalyptusDark};
  text-align: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 1.2rem;
  }
`

const InputContainer = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.primary.eucalyptusLight};
  border-radius: ${theme.borderRadius.sm};
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  text-align: center;
  letter-spacing: 1px;
  color: ${theme.colors.neutral.darkGray};
  background: ${theme.colors.neutral.white};
  transition: border-color 0.3s ease;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: 1rem;
    letter-spacing: 2px;
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.eucalyptusDark};
  }
  
  &::placeholder {
    color: ${theme.colors.neutral.gray};
    letter-spacing: 0.5px;
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      letter-spacing: 1px;
    }
  }
`

const SubmitButton = styled.button`
  background: ${theme.colors.primary.eucalyptusDark};
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  font-family: ${theme.fonts.serif};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: 1rem;
  }
  
  &:hover {
    background: ${theme.colors.primary.eucalyptus};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const ErrorMessage = styled.div`
  color: ${theme.colors.status.error};
  font-family: ${theme.fonts.body};
  font-size: 0.7rem;
  text-align: center;
  margin-top: ${theme.spacing.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.8rem;
  }
`

export default function RSVPPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Please enter your invitation code')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store party data in session storage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('partyData', JSON.stringify(data.party))
        }
        router.push('/rsvp/form')
      } else {
        setError(data.error || 'Invalid invitation code')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout activePage="rsvp">
      <InvitationContainer>
        <BackgroundImage 
          src="/photo-1596751303147-05d69e653ca4 (1).avif"
          alt="Wedding Invitation Background"
          width={1920}
          height={1440}
          priority
        />
        <FormOverlay>
          <InvitationCard>
            <SunflowerDecoration />
            <InvitationTitle>RSVP</InvitationTitle>
            <InvitationSubtitle>
              Please enter your invitation code to respond
            </InvitationSubtitle>
            <CodeHint>
              Your unique code can be found on your invitation
            </CodeHint>
            
            <Form onSubmit={handleSubmit}>
              <Label htmlFor="code">Invitation Code</Label>
              <InputContainer>
                <Input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="ENTER YOUR CODE"
                  pattern="[A-Z0-9]{4}"
                  maxLength={4}
                  disabled={isLoading}
                />
              </InputContainer>
              
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Continue'}
              </SubmitButton>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </Form>
          </InvitationCard>
        </FormOverlay>
      </InvitationContainer>
    </Layout>
  )
}