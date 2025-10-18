'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'

const SunflowerIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.accent.sunflower};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg};
  font-size: 1.5rem;
  box-shadow: ${theme.shadows.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 80px;
    height: 80px;
    font-size: 2rem;
  }
`

const Title = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 2rem;
  font-weight: 400;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`

const Description = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.gray};
  text-align: center;
  max-width: 400px;
  margin: 0 auto ${theme.spacing.xl};
  line-height: 1.5;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
    max-width: 500px;
  }
`

const CodeCard = styled.div`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.sm};
  text-align: center;
  max-width: 350px;
  width: 100%;
  margin: 0 auto;
  border: 1px solid ${theme.colors.primary.sageLight};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xl};
    max-width: 400px;
  }
`

const CardDescription = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  margin-bottom: ${theme.spacing.lg};
  font-size: 0.8rem;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-size: 1.2rem;
  font-weight: 600;
  color: ${theme.colors.primary.sageDark};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InputContainer = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.primary.sageLight};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  text-align: center;
  letter-spacing: 1px;
  color: ${theme.colors.neutral.darkGray};
  background: ${theme.colors.neutral.white};
  transition: border-color 0.3s ease;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
    font-size: 1.1rem;
    letter-spacing: 2px;
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.sageDark};
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
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: 1rem;
  }
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.sage}, ${theme.colors.primary.sageLight});
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
  
  &:disabled {
    background: ${theme.colors.neutral.gray};
    cursor: not-allowed;
    transform: none;
    box-shadow: ${theme.shadows.sm};
  }
`

const ErrorMessage = styled.div`
  color: ${theme.colors.status.error};
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  text-align: center;
  margin-top: ${theme.spacing.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`

export default function RSVPPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid code')
      }

      // Store party data in sessionStorage and redirect to form
      sessionStorage.setItem('partyData', JSON.stringify(data.party))
      router.push('/rsvp/form')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout activePage="rsvp">
      <SunflowerIcon>🌻</SunflowerIcon>

      <Title>RSVP</Title>

      <Description>
        We&apos;re so excited to celebrate with you! Please enter your invitation code below to access your personalized RSVP form.
      </Description>

      <CodeCard>
        <CardDescription>
          Please check your invitation for your unique RSVP code.
        </CardDescription>

        <Form onSubmit={handleSubmit}>
          <Label htmlFor="inviteCode">Invitation Code</Label>

          <InputContainer>
            <Input
              type="text"
              id="inviteCode"
              name="inviteCode"
              placeholder="ENTER YOUR 4-DIGIT CODE"
              maxLength={4}
              pattern="[0-9]{4}"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </InputContainer>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Validating...' : 'Continue to RSVP'}
          </SubmitButton>
        </Form>
      </CodeCard>
    </Layout>
  )
}
