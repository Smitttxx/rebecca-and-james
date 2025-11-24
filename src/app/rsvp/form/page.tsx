'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faLeaf, faCheck } from '@fortawesome/free-solid-svg-icons'
import Layout from '@/components/Layout'

const PageContainer = styled.div`
  background: #e3e9dd;
  padding: 3rem 1.5rem 4rem;
  min-height: 100vh;
`

const InviteBanner = styled.div`
  max-width: 900px;
  margin: 0 auto 2.5rem;
  background: #fbf7ec;
  border-radius: 28px;
  border: 1px solid rgba(153, 140, 104, 0.35);
  box-shadow: 0 14px 35px rgba(0,0,0,0.05);
  padding: 1.75rem 2rem 1.9rem;
  text-align: center;
`

const InviteTitle = styled.h1`
  font-family: "Cormorant Garamond", "Georgia", serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 1.4rem;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: 0.3rem;
`

const InviteSubtitle = styled.p`
  margin-top: 0.3rem;
  font-size: 0.85rem;
  color: #767765;
  font-family: ${theme.fonts.body};
`

const PartyInfo = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  display: inline-block;
`

const PartyName = styled.h2`
  font-family: "Cormorant Garamond", "Georgia", serif;
  font-size: 1.1rem;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: 0.25rem;
  letter-spacing: 0.04em;
`

const GuestCount = styled.p`
  font-family: ${theme.fonts.body};
  color: #8a8b7a;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const GuestGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
  }
`

const MenuCard = styled.article`
  background: #fbf7ec;
  border-radius: 24px;
  padding: 1.75rem 1.75rem 1.5rem;
  box-shadow: 0 14px 35px rgba(0,0,0,0.06);
  border: 1px solid rgba(150, 135, 100, 0.25);
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    inset: 12px;
    border-radius: 18px;
    border: 1px solid rgba(200, 184, 145, 0.5);
    pointer-events: none;
  }
`

const MenuHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`

const MenuInitials = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid #c0af7b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  background: #f3ead2;
  color: ${theme.colors.primary.eucalyptusDark};
`

const MenuTitleBlock = styled.div`
  flex: 1;
`

const MenuGuestName = styled.h2`
  font-family: "Cormorant Garamond", "Georgia", serif;
  font-size: 1.2rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${theme.colors.primary.eucalyptusDark};
  margin: 0;
`

const MenuSubtitle = styled.p`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a8b7a;
  margin: 0.25rem 0 0 0;
`

const MenuAttendance = styled.div`
  display: inline-flex;
  background: #f2efe4;
  border-radius: 999px;
  padding: 3px;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
`

const MenuToggle = styled.button<{ $active?: boolean }>`
  border: 0;
  background: transparent;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  opacity: 0.7;
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  color: ${theme.colors.primary.eucalyptusDark};
  transition: all 0.2s ease;
  
  ${props => props.$active ? `
    background: ${theme.colors.primary.eucalyptusDark};
    color: #ffffff;
    opacity: 1;
    font-weight: 600;
  ` : ''}
  
  &:hover {
    opacity: ${props => props.$active ? '1' : '0.9'};
  }
`

const MenuSection = styled.section<{ $visible?: boolean }>`
  border-top: 1px solid rgba(189, 177, 138, 0.45);
  padding-top: 1.1rem;
  margin-top: 0.9rem;
  max-height: ${props => props.$visible ? '1000px' : '0'};
  opacity: ${props => props.$visible ? '1' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out, opacity 0.4s ease-in-out, padding 0.4s ease-in-out, margin 0.4s ease-in-out;
  padding-top: ${props => props.$visible ? '1.1rem' : '0'};
  padding-bottom: ${props => props.$visible ? '0' : '0'};
  margin-top: ${props => props.$visible ? '0.9rem' : '0'};
  margin-bottom: ${props => props.$visible ? '0' : '0'};
`

const MenuSectionTitle = styled.h3`
  font-family: "Cormorant Garamond", "Georgia", serif;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 0.8rem;
  color: #d7b259;
  font-weight: 600;
`

const MenuOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const MenuOption = styled.div<{ $selected?: boolean }>`
  padding: 0.65rem 0.75rem;
  border-radius: 14px;
  border: 1px solid transparent;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  
  &:hover {
    background: rgba(237, 229, 205, 0.8);
  }
  
  ${props => props.$selected ? `
    border-color: #d4b25a;
    background: rgba(235, 217, 170, 0.35);
  ` : ''}
`

const MenuOptionContent = styled.div`
  flex: 1;
`

const MenuOptionTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${theme.colors.primary.eucalyptusDark};
`

// Removed unused styled component: MenuOptionTag

const MenuOptionMark = styled.div`
  font-size: 0.9rem;
  margin-top: 0.1rem;
  color: #d7b259;
  font-weight: 600;
`

const BeansCheckbox = styled.div`
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: rgba(215, 178, 89, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(215, 178, 89, 0.3);
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: ${theme.colors.primary.eucalyptusDark};
`

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #d7b259;
`

const ChildBadge = styled.div`
  display: inline-block;
  background: #d7b259;
  color: #2d3325;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 0.5rem;
`

const MenuTypeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(215, 178, 89, 0.1);
  border-radius: 12px;
  border: 1px solid rgba(215, 178, 89, 0.3);
`

const MenuTypeButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  border: 1px solid ${props => props.$active ? '#d7b259' : 'rgba(215, 178, 89, 0.3)'};
  background: ${props => props.$active ? '#d7b259' : 'transparent'};
  color: ${props => props.$active ? '#2d3325' : '#6c6c56'};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  font-weight: ${props => props.$active ? 600 : 400};
  transition: all 0.2s ease;
  opacity: ${props => props.$active ? '1' : '0.7'};
  
  &:hover {
    background: ${props => props.$active ? '#d7b259' : 'rgba(215, 178, 89, 0.2)'};
    opacity: 1;
  }
`

const ReadOnlyNotice = styled.div`
  background: rgba(212, 178, 90, 0.15);
  border: 1px solid rgba(212, 178, 90, 0.4);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: #6c6c56;
  text-align: center;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, margin 0.3s ease-in-out, padding 0.3s ease-in-out;
  animation: fadeInUp 0.3s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const UnableToAttendNotice = styled.div`
  background: rgba(108, 108, 86, 0.1);
  border: 1px solid rgba(108, 108, 86, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: #6c6c56;
  text-align: center;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, margin 0.3s ease-in-out, padding 0.3s ease-in-out;
  animation: fadeInUp 0.3s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

// Removed unused styled component: MenuOptionReadOnly

const MealSelectionsBox = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(212, 178, 90, 0.1);
  border-radius: 12px;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out, margin 0.3s ease-in-out, padding 0.3s ease-in-out;
  animation: fadeInUp 0.3s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const MenuNotes = styled.section`
  border-top: 1px dashed rgba(189, 177, 138, 0.6);
  margin-top: 1.25rem;
  padding-top: 0.9rem;
`

const MenuNotesLabel = styled.label`
  display: block;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  margin-bottom: 0.35rem;
  color: #8a8566;
  font-family: ${theme.fonts.body};
`

const MenuNotesTextarea = styled.textarea`
  width: 100%;
  border-radius: 12px;
  padding: 0.6rem 0.75rem;
  border: 1px solid rgba(189, 177, 138, 0.8);
  min-height: 60px;
  font-size: 0.8rem;
  resize: vertical;
  background: #fdfaf3;
  font-family: ${theme.fonts.body};
  color: ${theme.colors.primary.eucalyptusDark};
  
  &:focus {
    outline: none;
    border-color: #d4b25a;
  }
  
  &::placeholder {
    color: #9a9474;
  }
`

const ValidationMessage = styled.div<{ $isError: boolean }>`
  font-family: ${theme.fonts.body};
  font-size: ${props => props.$isError ? '0.85rem' : '0.7rem'};
  color: ${props => props.$isError ? '#d32f2f' : '#6c6c56'};
  text-align: ${props => props.$isError ? 'left' : 'center'};
  margin-top: 0.5rem;
  margin-bottom: ${props => props.$isError ? '1rem' : '0'};
  padding: ${props => props.$isError ? '0.75rem 1rem' : '0.35rem 0.5rem'};
  background: ${props => props.$isError ? 'rgba(211, 47, 47, 0.1)' : 'rgba(108, 108, 86, 0.1)'};
  border-radius: 8px;
  border-left: 2px solid ${props => props.$isError ? '#d32f2f' : '#6c6c56'};
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  ul {
    margin: 0;
    padding-left: 1.2rem;
  }
  
  li {
    margin-bottom: 0.25rem;
    line-height: 1.4;
  }
`

const PlaylistCardWrapper = styled.div<{ $visible: boolean }>`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  margin-bottom: ${props => props.$visible ? '2.5rem' : '0'};
  max-height: ${props => props.$visible ? '1000px' : '0'};
  opacity: ${props => props.$visible ? '1' : '0'};
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), 
              opacity 0.4s ease-in-out, 
              margin-bottom 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
`

const PlaylistCard = styled.div`
  background: #fbf7ec;
  border-radius: 28px;
  border: 1px solid rgba(153, 140, 104, 0.35);
  box-shadow: 0 14px 35px rgba(0,0,0,0.05);
  padding: 1.75rem 2rem 1.9rem;
  text-align: center;
  transform: translateY(0);
  transition: transform 0.4s ease-out;
  animation: fadeInUp 0.4s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`

const KidsMenuNotice = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: #767765;
  text-align: center;
  margin-bottom: 1rem;
`

const MusicRequestTitle = styled.h3`
  font-family: "Cormorant Garamond", "Georgia", serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 1.4rem;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: 0.5rem;
`

const MusicRequestText = styled.textarea`
  width: 100%;
  border-radius: 12px;
  padding: 0.75rem;
  border: 1px solid rgba(189, 177, 138, 0.8);
  min-height: 100px;
  font-size: 0.85rem;
  resize: vertical;
  background: #fdfaf3;
  font-family: ${theme.fonts.body};
  color: ${theme.colors.primary.eucalyptusDark};
  margin-top: 1rem;
  
  &:focus {
    outline: none;
    border-color: #d4b25a;
  }
  
  &::placeholder {
    color: #9a9474;
  }
`

// Removed unused styled components: ContactSection, ContactTitle, ContactDetails, ContactPerson, ContactName, ContactPhone

const ConfirmationSection = styled.div`
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 2.5rem;
  background: #fbf7ec;
  border-radius: 28px;
  border: 1px solid rgba(153, 140, 104, 0.35);
  box-shadow: 0 14px 35px rgba(0,0,0,0.05);
  padding: 1.75rem 2rem 1.9rem;
  text-align: center;
`

const ConfirmationTitle = styled.h3`
  font-family: "Cormorant Garamond", "Georgia", serif;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 1.2rem;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: 0.5rem;
`

const ConfirmationText = styled.p`
  font-family: ${theme.fonts.body};
  color: #767765;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
`

const ConfirmationButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: center;
  }
`

const ConfirmButton = styled.button<{ $variant?: 'confirm' | 'decline' }>`
  padding: 0.75rem 1.5rem;
  border: 1px solid #d7b259;
  border-radius: 999px;
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #d7b259;
  color: #2d3325;
  
  &:hover {
    background: #c0a04d;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const DeadlineText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.75rem;
  color: #8a8b7a;
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
`

const SuccessMessage = styled.div`
  max-width: 900px;
  margin: 0 auto 2.5rem;
  background: #fbf7ec;
  border-radius: 28px;
  border: 1px solid rgba(153, 140, 104, 0.35);
  box-shadow: 0 14px 35px rgba(0,0,0,0.05);
  padding: 2rem;
  text-align: center;
  color: ${theme.colors.primary.eucalyptusDark};
`

const ErrorMessage = styled.div`
  max-width: 900px;
  margin: 0 auto 2.5rem;
  background: #fbf7ec;
  border-radius: 28px;
  border: 1px solid rgba(211, 47, 47, 0.35);
  box-shadow: 0 14px 35px rgba(0,0,0,0.05);
  padding: 1.75rem 2rem 1.9rem;
  text-align: center;
  color: #d32f2f;
  font-family: ${theme.fonts.body};
  font-weight: 600;
`

const LoadingMessage = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  font-family: ${theme.fonts.body};
  color: #767765;
  font-size: 0.9rem;
`

interface Guest {
  id: string
  firstName: string
  lastName: string
  isChild?: boolean
  useKidsMenu?: boolean
  email?: string
  phone?: string
  isAttending?: boolean
  dietaryRequirements?: string
  starterSelection?: string
  mainSelection?: string
  dessertSelection?: string
  submittedAt?: string
  withBeans?: boolean
}

interface Party {
  id: string
  partyName: string
  musicRequests?: string
  guests: Guest[]
}

const meals = {
  adult: {
    starters: [
      {
        id: 'soup',
        name: 'Fresh Seasonal Soup',
        description: 'With crusty granary bread',
        tag: '(V)',
        icon: faLeaf,
        color: '#4ECDC4'
      },
      {
        id: 'caesar',
        name: 'Classic Caesar Salad',
        description: 'With chicken, fresh parmesan and parma ham',
        tag: '',
        icon: faUtensils,
        color: '#8B4513'
      }
    ],
    mains: [
      {
        id: 'tart',
        name: 'Asparagus & Cheddar Tart',
        description: 'Puff pastry tart with provencal vegetables',
        tag: '(V)',
        icon: faLeaf,
        color: '#4ECDC4'
      },
      {
        id: 'chicken',
        name: 'Thyme Roasted Chicken',
        description: 'With truffled creamed potatoes, seasonal veg and red wine jus',
        tag: '',
        icon: faUtensils,
        color: '#8B4513'
      }
    ],
    desserts: [
      {
        id: 'cheesecake',
        name: 'Strawberry Cheesecake',
        description: 'With berries and strawberry cream',
        tag: '',
        icon: faUtensils,
        color: '#FF6B6B'
      },
      {
        id: 'brownie',
        name: 'Double Chocolate Brownie',
        description: 'With salted caramel ice cream and chocolate sauce',
        tag: '(V)',
        icon: faUtensils,
        color: '#8B4513'
      }
    ]
  },
  kids: {
    starters: [
      {
        id: 'kids-starter',
        name: 'Garlic Bread',
        description: 'Garlic bread',
        tag: '',
        icon: faUtensils,
        color: '#4ECDC4'
      }
    ],
    mains: [
      {
        id: 'kids-chicken-main',
        name: 'Chicken Nuggets',
        description: 'With chips and beans (optional)',
        tag: '',
        icon: faUtensils,
        color: '#8B4513'
      },
      {
        id: 'kids-pizza-main',
        name: 'Cheese Pizza',
        description: 'With chips and beans (optional)',
        tag: '',
        icon: faUtensils,
        color: '#8B4513'
      },
      {
        id: 'kids-fish-main',
        name: 'Fish Fingers',
        description: 'With chips and beans (optional)',
        tag: '',
        icon: faUtensils,
        color: '#8B4513'
      },
      {
        id: 'kids-sausage-main',
        name: 'Sausage',
        description: 'With chips and beans (optional)',
        tag: '',
        icon: faUtensils,
        color: '#8B4513'
      },
    ],
    desserts: [
      {
        id: 'kids-ice-cream',
        name: 'Ice Cream',
        description: 'Vanilla ice cream with chocolate sauce',
        tag: '',
        icon: faUtensils,
        color: '#FF6B6B'
      }
    ]
  }
}

export default function RSVPFormPage() {
  const [party, setParty] = useState<Party | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const partyData = sessionStorage.getItem('partyData')
      if (partyData) {
        const parsedParty = JSON.parse(partyData)
        // Set default useKidsMenu to true for children
        parsedParty.guests = parsedParty.guests.map((guest: Guest) => ({
          ...guest,
          useKidsMenu: guest.isChild ? (guest.useKidsMenu ?? true) : false
        }))
        setParty(parsedParty)
      } else {
        router.push('/rsvp')
      }
    }
    setLoading(false)
  }, [router])

  const handleGuestChange = (guestId: string, field: string, value: string | boolean) => {
    if (!party) return
    
    // Check if guest has already submitted meal selections
    const guest = party.guests.find(g => g.id === guestId)
    const hasSubmittedMeals = guest?.submittedAt && guest.starterSelection && guest.mainSelection && guest.dessertSelection
    
    // Prevent meal changes if already submitted (but allow attendance changes)
    if (hasSubmittedMeals && (field === 'starterSelection' || field === 'mainSelection' || field === 'dessertSelection' || field === 'useKidsMenu')) {
      return // Don't allow changes to meal selections after submission
    }
    
    // Track if we're changing to "Attending" to scroll to menu
    const isChangingToAttending = field === 'isAttending' && value === true && guest?.isAttending !== true
    
    setParty({
      ...party,
      guests: party.guests.map(guest => {
        if (guest.id === guestId) {
          const updatedGuest = { ...guest, [field]: value }
          
          // Only clear meal selections when setting to "not attending" if they haven't already submitted
          // If they've submitted, keep the meal selections even if they change to "not attending"
          if (field === 'isAttending' && value === false && !hasSubmittedMeals) {
            updatedGuest.starterSelection = undefined
            updatedGuest.mainSelection = undefined
            updatedGuest.dessertSelection = undefined
            updatedGuest.dietaryRequirements = undefined
          }
          
          // Clear meal selections when switching menu type (only if not already submitted)
          if (field === 'useKidsMenu' && !hasSubmittedMeals) {
            updatedGuest.starterSelection = undefined
            updatedGuest.mainSelection = undefined
            updatedGuest.dessertSelection = undefined
          }
          return updatedGuest
        }
        return guest
      })
    })
    
    // Scroll to menu section when changing to "Attending"
    if (isChangingToAttending) {
      setTimeout(() => {
        const menuCard = document.getElementById(`menu-card-${guestId}`)
        if (menuCard) {
          menuCard.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100) // Small delay to ensure DOM has updated
    }
    
    if (error) {
      setError('')
    }
  }

  const getGuestValidationStatus = (guest: Guest) => {
    if (guest.isAttending === undefined) {
      return { isValid: false, message: 'Please select attendance' }
    }
    
    // If guest has already submitted meals, only validate attendance
    const hasSubmittedMeals = guest.submittedAt && guest.starterSelection && guest.mainSelection && guest.dessertSelection
    if (hasSubmittedMeals) {
      return { isValid: true, message: '' }
    }
    
    if (guest.isAttending === true) {
      const missingSelections = []
      if (!guest.starterSelection) missingSelections.push('starter')
      if (!guest.mainSelection) missingSelections.push('main course')
      if (!guest.dessertSelection) missingSelections.push('dessert')
      
      if (missingSelections.length > 0) {
        return { 
          isValid: false, 
          message: `Missing: ${missingSelections.join(', ')}` 
        }
      }
    }
    
    return { isValid: true, message: '' }
  }

  const isFormValid = useMemo(() => {
    if (!party) return false

    const hasUnansweredRSVPs = party.guests.some(guest => guest.isAttending === undefined)
    if (hasUnansweredRSVPs) {
      return false
    }

    // Only validate meal selections for guests who haven't already submitted
    const attendingGuests = party.guests.filter(guest => guest.isAttending === true)
    const guestsNeedingMealSelection = attendingGuests.filter(guest => {
      const hasSubmittedMeals = guest.submittedAt && guest.starterSelection && guest.mainSelection && guest.dessertSelection
      return !hasSubmittedMeals
    })
    
    const incompleteMealSelections = guestsNeedingMealSelection.some(guest => 
      !guest.starterSelection || !guest.mainSelection || !guest.dessertSelection
    )
    
    if (incompleteMealSelections) {
      return false
    }

    return true
  }, [party])

  const getValidationDetails = () => {
    if (!party) return { isValid: false, issues: [] }

    const issues: string[] = []

    // Check for unanswered RSVPs
    const unansweredGuests = party.guests.filter(guest => guest.isAttending === undefined)
    if (unansweredGuests.length > 0) {
      const names = unansweredGuests.map(g => `${g.firstName} ${g.lastName}`).join(', ')
      issues.push(`${names} ${unansweredGuests.length === 1 ? 'needs' : 'need'} to select "Attending" or "Unable to Attend"`)
    }

    // Check for incomplete meal selections (only for guests who haven't submitted)
    const attendingGuests = party.guests.filter(guest => guest.isAttending === true)
    const guestsNeedingMealSelection = attendingGuests.filter(guest => {
      const hasSubmittedMeals = guest.submittedAt && guest.starterSelection && guest.mainSelection && guest.dessertSelection
      return !hasSubmittedMeals
    })

    guestsNeedingMealSelection.forEach(guest => {
      const missingItems: string[] = []
      if (!guest.starterSelection) missingItems.push('starter')
      if (!guest.mainSelection) missingItems.push('main course')
      if (!guest.dessertSelection) missingItems.push('dessert')
      
      if (missingItems.length > 0) {
        issues.push(`${guest.firstName} ${guest.lastName} is missing: ${missingItems.join(', ')}`)
      }
    })

    return {
      isValid: issues.length === 0,
      issues
    }
  }

  const validateFormWithError = () => {
    if (!party) return false

    const validation = getValidationDetails()
    if (!validation.isValid) {
      setError(validation.issues.join('. '))
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!party) return

    if (!validateFormWithError()) {
      return
    }

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
          guests: party.guests.map(({ id, isAttending, dietaryRequirements, starterSelection, mainSelection, dessertSelection, email, phone, useKidsMenu, withBeans }) => ({
            id,
            isAttending,
            dietaryRequirements,
            starterSelection,
            mainSelection,
            dessertSelection,
            email,
            phone,
            useKidsMenu,
            withBeans
          })),
          musicRequests: party.musicRequests,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit RSVP')
      }

      setSuccess(true)
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('partyData')
        // Scroll to top to show the success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout activePage="rsvp">
        <PageContainer>
          <LoadingMessage>Loading your RSVP form...</LoadingMessage>
        </PageContainer>
      </Layout>
    )
  }

  if (!party) {
    return (
      <Layout activePage="rsvp">
        <PageContainer>
          <ErrorMessage>No party data found. Please start over.</ErrorMessage>
        </PageContainer>
      </Layout>
    )
  }

  if (success) {
    // Check if anyone is attending
    const hasAttendingGuests = party ? party.guests.some(guest => guest.isAttending === true) : false
    
    return (
      <Layout activePage="rsvp">
        <PageContainer>
          <SuccessMessage>
            <FontAwesomeIcon icon={faCheck} style={{ fontSize: '2rem', marginBottom: '1rem', color: '#d7b259' }} />
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: '600' }}>
              Thank you!
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>
              Your RSVP has been submitted successfully.
              {hasAttendingGuests ? (
                <> We can&apos;t wait to celebrate with you!</>
              ) : (
                <> We&apos;re sorry you won&apos;t be able to join us, but we appreciate you letting us know.</>
              )}
            </div>
          </SuccessMessage>
        </PageContainer>
      </Layout>
    )
  }

  return (
    <Layout activePage="rsvp">
      <PageContainer>
        <InviteBanner>
          <InviteTitle>You&apos;re Invited!</InviteTitle>
          <InviteSubtitle>Please Respond by April 1st, 2026</InviteSubtitle>
          <PartyInfo>
            <PartyName>{party.partyName}</PartyName>
            <GuestCount>{party.guests.length} guest{party.guests.length !== 1 ? 's' : ''} invited</GuestCount>
          </PartyInfo>
        </InviteBanner>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <GuestGrid>
            {party.guests.map((guest, index) => (
              <MenuCard key={guest.id} id={`menu-card-${guest.id}`}>
                <MenuHeader>
                  <MenuInitials>
                    {guest.firstName[0]}{guest.lastName[0]}
                  </MenuInitials>
                  <MenuTitleBlock>
                    <MenuGuestName>
                      {guest.firstName} {guest.lastName}
                      {guest.isChild && <ChildBadge>Child</ChildBadge>}
                    </MenuGuestName>
                    <MenuSubtitle>Guest {index + 1} of {party.guests.length}</MenuSubtitle>
                  </MenuTitleBlock>
                </MenuHeader>
                
                {(() => {
                  const hasSubmittedMeals = guest.submittedAt && guest.starterSelection && guest.mainSelection && guest.dessertSelection
                  
                  // If guest has already submitted meals, show simplified view
                  if (hasSubmittedMeals) {
                    // If they're unable to attend, show a different message
                    if (!guest.isAttending) {
                      return (
                        <>
                          <UnableToAttendNotice>
                            Sorry you&apos;re missing it, we will miss you! 💕
                          </UnableToAttendNotice>
                          
                          <MenuAttendance>
                            <MenuToggle
                              type="button"
                              $active={false}
                              onClick={() => handleGuestChange(guest.id, 'isAttending', true)}
                            >
                              Attending
                            </MenuToggle>
                            <MenuToggle
                              type="button"
                              $active={true}
                              onClick={() => handleGuestChange(guest.id, 'isAttending', false)}
                            >
                              Unable to attend
                            </MenuToggle>
                          </MenuAttendance>
                        </>
                      )
                    }
                    
                    // If they're attending, show meal selections and notice
                    return (
                      <>
                        <ReadOnlyNotice>
                          ✓ We&apos;ve received your meal selections{guest.submittedAt ? ` on ${new Date(guest.submittedAt).toLocaleDateString('en-GB', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}` : ''}. Your food choices cannot be changed, but you can update your attendance status below.
                        </ReadOnlyNotice>
                        
                        <MenuAttendance>
                          <MenuToggle
                            type="button"
                            $active={true}
                            onClick={() => handleGuestChange(guest.id, 'isAttending', true)}
                          >
                            Attending
                          </MenuToggle>
                          <MenuToggle
                            type="button"
                            $active={false}
                            onClick={() => handleGuestChange(guest.id, 'isAttending', false)}
                          >
                            Unable to attend
                          </MenuToggle>
                        </MenuAttendance>
                        
                        {/* Show submitted meal selections in read-only format - only if attending */}
                        {guest.isAttending && (
                          <MealSelectionsBox>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: theme.colors.primary.eucalyptusDark, marginBottom: '0.75rem' }}>
                              Your Selected Meals:
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6c6c56', lineHeight: '1.6' }}>
                              <div>🍽️ Starter: <strong>{guest.starterSelection}</strong></div>
                              <div>🍽️ Main: <strong>{guest.mainSelection}</strong>{guest.isChild && guest.withBeans ? ' (with beans)' : guest.isChild && guest.withBeans === false ? ' (without beans)' : ''}</div>
                              <div>🍽️ Dessert: <strong>{guest.dessertSelection}</strong></div>
                              {guest.dietaryRequirements && (
                                <div style={{ marginTop: '0.5rem' }}>🥗 Dietary: {guest.dietaryRequirements}</div>
                              )}
                            </div>
                          </MealSelectionsBox>
                        )}
                      </>
                    )
                  }
                  
                  // If not submitted, show full form
                  return (
                    <>
                      <MenuAttendance>
                        <MenuToggle
                          type="button"
                          $active={guest.isAttending === true}
                          onClick={() => handleGuestChange(guest.id, 'isAttending', true)}
                        >
                          Attending
                        </MenuToggle>
                        <MenuToggle
                          type="button"
                          $active={guest.isAttending === false}
                          onClick={() => handleGuestChange(guest.id, 'isAttending', false)}
                        >
                          Unable to attend
                        </MenuToggle>
                      </MenuAttendance>
                      
                      {(() => {
                        const menuType = guest.isChild ? 'kids' : 'adult'
                        const menuItems = meals[menuType]
                        
                        return (
                          <>
                            <MenuSection $visible={guest.isAttending === true}>
                              <MenuSectionTitle>{guest.firstName}&apos;s Starter</MenuSectionTitle>
                              <MenuOptions>
                                {menuItems.starters.map((meal) => {
                                  const isSelected = guest.starterSelection === meal.id
                                  return (
                                    <MenuOption
                                      key={meal.id}
                                      $selected={isSelected}
                                      onClick={() => handleGuestChange(guest.id, 'starterSelection', meal.id)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <MenuOptionContent>
                                        <MenuOptionTitle>{meal.name} {meal.tag}</MenuOptionTitle>
                                      </MenuOptionContent>
                                      {isSelected && <MenuOptionMark>✔</MenuOptionMark>}
                                    </MenuOption>
                                  )
                                })}
                              </MenuOptions>
                            </MenuSection>

                            <MenuSection $visible={guest.isAttending === true}>
                              <MenuSectionTitle>{guest.firstName}&apos;s Main Course</MenuSectionTitle>
                              <KidsMenuNotice>
                                {guest.isChild && 'All kids Meals are served with chips and beans (optional)'}
                              </KidsMenuNotice>
                              <MenuOptions>
                                {menuItems.mains.map((meal) => {
                                  const isSelected = guest.mainSelection === meal.id
                                  return (
                                    <MenuOption
                                      key={meal.id}
                                      $selected={isSelected}
                                      onClick={() => handleGuestChange(guest.id, 'mainSelection', meal.id)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <MenuOptionContent>
                                        <MenuOptionTitle>{meal.name} {meal.tag}</MenuOptionTitle>
                                      </MenuOptionContent>
                                      {isSelected && <MenuOptionMark>✔</MenuOptionMark>}
                                    </MenuOption>
                                  )
                                })}
                              </MenuOptions>
                              {menuType === 'kids' && guest.mainSelection && (
                                <BeansCheckbox>
                                  <CheckboxLabel>
                                    <CheckboxInput
                                      type="checkbox"
                                      checked={guest.withBeans || false}
                                      onChange={(e) => handleGuestChange(guest.id, 'withBeans', e.target.checked)}
                                    />
                                    Include beans with meal
                                  </CheckboxLabel>
                                </BeansCheckbox>
                              )}
                            </MenuSection>

                            <MenuSection $visible={guest.isAttending === true}>
                              <MenuSectionTitle>{guest.firstName}&apos;s Dessert</MenuSectionTitle>
                              <MenuOptions>
                                {menuItems.desserts.map((meal) => {
                                  const isSelected = guest.dessertSelection === meal.id
                                  return (
                                    <MenuOption
                                      key={meal.id}
                                      $selected={isSelected}
                                      onClick={() => handleGuestChange(guest.id, 'dessertSelection', meal.id)}
                                      style={{ cursor: 'pointer' }}
                                    >
                                      <MenuOptionContent>
                                        <MenuOptionTitle>{meal.name} {meal.tag}</MenuOptionTitle>
                                      </MenuOptionContent>
                                      {isSelected && <MenuOptionMark>✔</MenuOptionMark>}
                                    </MenuOption>
                                  )
                                })}
                              </MenuOptions>
                            </MenuSection>

                            {guest.isAttending === true && (
                              <MenuNotes>
                                <MenuNotesLabel htmlFor={`dietary-${guest.id}`}>
                                  Dietary Requirements / Allergies
                                </MenuNotesLabel>
                                <MenuNotesTextarea
                                  id={`dietary-${guest.id}`}
                                  placeholder="Please let us know about any dietary requirements or allergies..."
                                  value={guest.dietaryRequirements || ''}
                                  onChange={(e) => handleGuestChange(guest.id, 'dietaryRequirements', e.target.value)}
                                />
                              </MenuNotes>
                            )}
                          </>
                        )
                      })()}
                    </>
                  )
                })()}

                {(() => {
                  // Only show validation for guests who haven't submitted
                  const hasSubmittedMeals = guest.submittedAt && guest.starterSelection && guest.mainSelection && guest.dessertSelection
                  if (hasSubmittedMeals) return null
                  
                  const validation = getGuestValidationStatus(guest)
                  return validation.message && (
                    <ValidationMessage $isError={!validation.isValid}>
                      {validation.message}
                    </ValidationMessage>
                  )
                })()}
              </MenuCard>
            ))}
          </GuestGrid>

          {/* Only show music requests if at least one guest is attending */}
          <PlaylistCardWrapper $visible={party ? party.guests.some(guest => guest.isAttending === true) : false}>
            <PlaylistCard>
              <MusicRequestTitle>What Gets You Dancing?</MusicRequestTitle>
              <p style={{ fontSize: '0.85rem', color: '#767765', margin: '0.5rem 0 0 0' }}>
                Help us create the perfect playlist for our celebration!
              </p>
              <MusicRequestText
                placeholder="Tell us about the songs that make you want to dance! You can include artist names, song titles, or even describe the type of music that gets you moving..."
                value={party?.musicRequests || ''}
                onChange={(e) => setParty(prev => prev ? { ...prev, musicRequests: e.target.value } : null)}
              />
            </PlaylistCard>
          </PlaylistCardWrapper>

          <ConfirmationSection>
            <ConfirmationTitle>Ready to Confirm Your RSVP?</ConfirmationTitle>
            {(() => {
              const validation = getValidationDetails()
              if (!validation.isValid && validation.issues.length > 0) {
                return (
                  <ValidationMessage $isError={true}>
                    <strong>Please complete the following before submitting:</strong>
                    <ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.2rem', textAlign: 'left' }}>
                      {validation.issues.map((issue, index) => (
                        <li key={index} style={{ marginBottom: '0.25rem' }}>{issue}</li>
                      ))}
                    </ul>
                  </ValidationMessage>
                )
              }
              return (
                <ConfirmationText>Please ensure all guests have their meal selections and dietary requirements completed above.</ConfirmationText>
              )
            })()}
            <ConfirmationButtons>
              <ConfirmButton
                type="submit"
                $variant="confirm"
                disabled={submitting || !isFormValid}
              >
                {submitting ? 'Submitting...' : 'Submit RSVP Response'}
              </ConfirmButton>
            </ConfirmationButtons>
            <DeadlineText>You can change your response until April 1st, 2026.</DeadlineText>
          </ConfirmationSection>
        </Form>
      </PageContainer>
    </Layout>
  )
}