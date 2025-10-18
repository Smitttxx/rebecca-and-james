'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faFish, faLeaf, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import Layout from '@/components/Layout'

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  background: linear-gradient(135deg, ${theme.colors.neutral.white}, ${theme.colors.primary.sageLight}10);
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.primary.sageLight};
  box-shadow: ${theme.shadows.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    margin-bottom: ${theme.spacing.xxl};
    padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  }
`

const PageTitle = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 2.2rem;
  font-weight: 400;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2.8rem;
  }
`

const PageSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`

const PartyName = styled.h2`
  font-family: ${theme.fonts.script};
  font-size: 1.6rem;
  font-weight: 400;
  color: ${theme.colors.secondary.gold};
  text-align: center;
  background: linear-gradient(135deg, ${theme.colors.secondary.goldLight}20, ${theme.colors.secondary.gold}10);
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.secondary.goldLight};
  display: inline-block;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.8rem;
    padding: ${theme.spacing.md} ${theme.spacing.xl};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const GuestCard = styled.div`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.primary.sageLight};
  position: relative;
  transition: all 0.3s ease;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl};
  }
  
  &:hover {
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -${theme.spacing.lg};
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${theme.colors.primary.sageLight}, ${theme.colors.secondary.gold}, ${theme.colors.primary.sageLight}, transparent);
    border-radius: ${theme.borderRadius.full};
    box-shadow: 0 1px 3px ${theme.colors.secondary.gold}20;
  }
`

const GuestHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`

const GuestAvatar = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.fonts.script};
  font-size: 1rem;
  color: ${theme.colors.neutral.white};
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: ${theme.shadows.md};
  border: 2px solid ${theme.colors.neutral.white};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 60px;
    height: 60px;
    font-size: 1.2rem;
  }
`

const GuestInfo = styled.div`
  flex: 1;
`

const GuestName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.xs};
  font-weight: 500;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.3rem;
  }
`

const GuestCount = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  font-size: 0.8rem;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`

const RSVPToggle = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  background: ${theme.colors.neutral.cream};
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.primary.sageLight};
`

const RSVPOption = styled.label<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  cursor: pointer;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.3s ease;
  flex: 1;
  justify-content: center;
  font-weight: 600;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  position: relative;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.9rem;
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
  }
  
  ${props => props.$selected ? `
    background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
    color: ${theme.colors.neutral.white};
    box-shadow: ${theme.shadows.sm};
  ` : `
    background: ${theme.colors.neutral.white};
    color: ${theme.colors.neutral.darkGray};
    
    &:hover {
      background: ${theme.colors.secondary.goldLight}20;
      color: ${theme.colors.secondary.gold};
    }
  `}
  
  input[type="radio"] {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
  }
`

const MealSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`

const SectionTitle = styled.h4`
  font-family: ${theme.fonts.heading};
  font-size: 1rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.md};
  font-weight: 500;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`

const MealGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.md};
  }
`

const MealCard = styled.div<{ $selected?: boolean }>`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.primary.sageLight};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
  }
  
  ${props => props.$selected ? `
    border-color: ${theme.colors.secondary.gold};
    background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
    box-shadow: ${theme.shadows.sm};
    
    h5 {
      color: ${theme.colors.neutral.white};
    }
    
    p {
      color: ${theme.colors.neutral.white};
      opacity: 0.9;
    }
    
    div {
      color: ${theme.colors.neutral.white};
    }
    
    &::before {
      content: '✓';
      position: absolute;
      top: ${theme.spacing.xs};
      right: ${theme.spacing.xs};
      width: 20px;
      height: 20px;
      background: ${theme.colors.secondary.gold};
      color: ${theme.colors.neutral.white};
      border-radius: ${theme.borderRadius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.8rem;
      
      @media (min-width: ${theme.breakpoints.tablet}) {
        top: ${theme.spacing.sm};
        right: ${theme.spacing.sm};
        width: 24px;
        height: 24px;
        font-size: 0.9rem;
      }
    }
  ` : `
    &:hover {
      border-color: ${theme.colors.primary.sage};
      box-shadow: ${theme.shadows.sm};
    }
  `}
`

const MealIcon = styled.div`
  font-size: 1.4rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.xs};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.6rem;
    margin-bottom: ${theme.spacing.sm};
  }
`

const MealDot = styled.div`
  display: none;
`

const MealName = styled.h5`
  font-family: ${theme.fonts.heading};
  font-size: 0.9rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.xs};
  font-weight: 500;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`

const MealDescription = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  font-size: 0.75rem;
  line-height: 1.3;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.8rem;
  }
`

const DietarySection = styled.div`
  margin-top: ${theme.spacing.lg};
`

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  font-weight: 600;
  color: ${theme.colors.primary.sageDark};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing.sm};
  display: block;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.9rem;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.sm};
  border: 2px solid ${theme.colors.primary.sageLight};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  background: ${theme.colors.neutral.white};
  color: ${theme.colors.neutral.darkGray};
  resize: vertical;
  min-height: 60px;
  transition: all 0.3s ease;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md};
    font-size: 0.9rem;
    min-height: 80px;
  }
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.sageDark};
    box-shadow: 0 0 0 3px ${theme.colors.primary.sageLight}20;
  }
  
  &:hover {
    border-color: ${theme.colors.primary.sage};
  }
  
  &::placeholder {
    color: ${theme.colors.neutral.gray};
    font-style: italic;
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
  margin-top: ${theme.spacing.lg};
  width: 100%;
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

const SuccessMessage = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
  color: ${theme.colors.neutral.white};
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  margin: ${theme.spacing.xl} auto;
  font-family: ${theme.fonts.body};
  font-weight: 500;
  box-shadow: ${theme.shadows.lg};
  border: 2px solid ${theme.colors.secondary.gold};
  max-width: 600px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
    border-radius: ${theme.borderRadius.lg};
    z-index: -1;
  }
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl};
    margin: ${theme.spacing.xxl} auto;
  }
`

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, ${theme.colors.status.error}, #EF5350);
  color: ${theme.colors.neutral.white};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  font-family: ${theme.fonts.body};
  font-weight: 600;
  box-shadow: ${theme.shadows.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xl};
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  font-size: 0.9rem;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`

interface Guest {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  isAttending?: boolean
  dietaryRequirements?: string
  menuSelection?: string
}

interface Party {
  id: string
  partyName: string
  maxGuests: number
  guests: Guest[]
}

const meals = [
  {
    id: 'beef',
    name: 'Beef Tenderloin',
    description: 'Perfectly seared with roasted seasonal vegetables',
    icon: faUtensils,
    color: '#8B4513'
  },
  {
    id: 'salmon',
    name: 'Herb-Crusted Salmon',
    description: 'Fresh Atlantic salmon with lemon butter sauce',
    icon: faFish,
    color: '#FF6B6B'
  },
  {
    id: 'vegetarian',
    name: 'Wild Mushroom Risotto',
    description: 'Creamy arborio rice with wild mushrooms',
    icon: faLeaf,
    color: '#4ECDC4'
  }
]

export default function RSVPFormPage() {
  const [party, setParty] = useState<Party | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const partyData = sessionStorage.getItem('partyData')
    if (partyData) {
      setParty(JSON.parse(partyData))
    } else {
      router.push('/rsvp')
    }
    setLoading(false)
  }, [router])

  const handleGuestChange = (guestId: string, field: string, value: any) => {
    if (!party) return
    
    setParty({
      ...party,
      guests: party.guests.map(guest => 
        guest.id === guestId ? { ...guest, [field]: value } : guest
      )
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!party) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/submit-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partyId: party.id,
          guests: party.guests
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP')
      }

      setSuccess(true)
      sessionStorage.removeItem('partyData')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout activePage="rsvp">
        <LoadingMessage>Loading your RSVP form...</LoadingMessage>
      </Layout>
    )
  }

  if (!party) {
    return (
      <Layout activePage="rsvp">
        <ErrorMessage>No party data found. Please start over.</ErrorMessage>
      </Layout>
    )
  }

  if (success) {
    return (
      <Layout activePage="rsvp">
        <SuccessMessage>
          <FontAwesomeIcon icon={faCheck} style={{ fontSize: '2rem', marginBottom: '1rem', color: theme.colors.secondary.gold }} />
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>
            Thank you!
          </div>
          <div style={{ fontSize: '1rem', opacity: 0.9 }}>
            Your RSVP has been submitted successfully. We can&apos;t wait to celebrate with you!
          </div>
        </SuccessMessage>
      </Layout>
    )
  }

  return (
    <Layout activePage="rsvp">
      <PageHeader>
        <PageTitle>RSVP Responses</PageTitle>
        <PageSubtitle>Please let us know if you&apos;ll be joining us for our special day</PageSubtitle>
        <PartyName>{party.partyName}</PartyName>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        {party.guests.map((guest) => (
          <GuestCard key={guest.id}>
            <GuestHeader>
              <GuestAvatar>
                {guest.firstName[0]}{guest.lastName[0]}
              </GuestAvatar>
              <GuestInfo>
                <GuestName>{guest.firstName} {guest.lastName}</GuestName>
              </GuestInfo>
            </GuestHeader>

            <RSVPToggle>
              <RSVPOption $selected={guest.isAttending === true}>
                <input 
                  type="radio" 
                  name={`${guest.id}-attending`} 
                  value="yes"
                  checked={guest.isAttending === true}
                  onChange={() => handleGuestChange(guest.id, 'isAttending', true)}
                />
                <FontAwesomeIcon icon={faCheck} />
                <span>Attending</span>
              </RSVPOption>
              <RSVPOption $selected={guest.isAttending === false}>
                <input 
                  type="radio" 
                  name={`${guest.id}-attending`} 
                  value="no"
                  checked={guest.isAttending === false}
                  onChange={() => handleGuestChange(guest.id, 'isAttending', false)}
                />
                <FontAwesomeIcon icon={faTimes} />
                <span>Unable to Attend</span>
              </RSVPOption>
            </RSVPToggle>

            {guest.isAttending === true && (
              <>
                <MealSection>
                  <SectionTitle>Menu Selection</SectionTitle>
                  <MealGrid>
                    {meals.map((meal) => (
                      <MealCard
                        key={meal.id}
                        $selected={guest.menuSelection === meal.id}
                        onClick={() => handleGuestChange(guest.id, 'menuSelection', meal.id)}
                      >
                        <MealIcon>
                          <FontAwesomeIcon icon={meal.icon} />
                        </MealIcon>
                        <MealDot />
                        <MealName>{meal.name}</MealName>
                        <MealDescription>{meal.description}</MealDescription>
                      </MealCard>
                    ))}
                  </MealGrid>
                </MealSection>

                <DietarySection>
                  <Label htmlFor={`${guest.id}-dietary`}>Dietary Requirements</Label>
                  <TextArea
                    id={`${guest.id}-dietary`}
                    name={`${guest.id}-dietary`}
                    placeholder="Please let us know about any allergies, dietary restrictions, or special requirements..."
                    value={guest.dietaryRequirements || ''}
                    onChange={(e) => handleGuestChange(guest.id, 'dietaryRequirements', e.target.value)}
                  />
                </DietarySection>
              </>
            )}
          </GuestCard>
        ))}

        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit RSVP'}
        </SubmitButton>
      </Form>
    </Layout>
  )
}