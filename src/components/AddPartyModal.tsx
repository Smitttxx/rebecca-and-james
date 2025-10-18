'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
`

const ModalContent = styled.div`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.lg};
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`

const ModalTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.5rem;
  color: ${theme.colors.primary.sageDark};
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${theme.colors.neutral.gray};
  cursor: pointer;
  
  &:hover {
    color: ${theme.colors.primary.sageDark};
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-weight: 600;
  color: ${theme.colors.primary.sageDark};
`

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.primary.sageLight};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.sageDark};
  }
`

const GuestsSection = styled.div`
  border: 1px solid ${theme.colors.primary.sageLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
`

const GuestRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${theme.spacing.sm};
  align-items: end;
  margin-bottom: ${theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const RemoveButton = styled.button`
  background: ${theme.colors.status.error};
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  
  &:hover {
    background: #d32f2f;
  }
`

const AddGuestButton = styled.button`
  background: ${theme.colors.secondary.gold};
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  margin-top: ${theme.spacing.md};
  
  &:hover {
    background: ${theme.colors.secondary.goldLight};
  }
`

const SubmitButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.sage}, ${theme.colors.primary.sageLight});
  }
  
  &:disabled {
    background: ${theme.colors.neutral.gray};
    cursor: not-allowed;
  }
`

interface Guest {
  firstName: string
  lastName: string
}

interface AddPartyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { partyName: string; maxGuests: number; guests: Guest[] }) => void
}

export default function AddPartyModal({ isOpen, onClose, onSubmit }: AddPartyModalProps) {
  const [partyName, setPartyName] = useState('')
  const [maxGuests, setMaxGuests] = useState(1)
  const [guests, setGuests] = useState<Guest[]>([
    { firstName: '', lastName: '' }
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty guests
    const validGuests = guests.filter(guest => 
      guest.firstName.trim() && guest.lastName.trim()
    )
    
    onSubmit({
      partyName,
      maxGuests,
      guests: validGuests
    })
    
    // Reset form
    setPartyName('')
    setMaxGuests(1)
    setGuests([{ firstName: '', lastName: '' }])
  }

  const addGuest = () => {
    setGuests([...guests, { firstName: '', lastName: '' }])
  }

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index))
    }
  }

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    const updatedGuests = guests.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    )
    setGuests(updatedGuests)
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add New Party</ModalTitle>
          <CloseButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="partyName">Party Name</Label>
            <Input
              id="partyName"
              type="text"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              placeholder="e.g., The Smith Family"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="maxGuests">Maximum Guests</Label>
            <Input
              id="maxGuests"
              type="number"
              min="1"
              value={maxGuests}
              onChange={(e) => setMaxGuests(parseInt(e.target.value))}
              required
            />
          </FormGroup>

          <GuestsSection>
            <Label>Guests</Label>
            {guests.map((guest, index) => (
              <GuestRow key={index}>
                <Input
                  type="text"
                  placeholder="First Name"
                  value={guest.firstName}
                  onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                  required
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={guest.lastName}
                  onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                  required
                />
                {guests.length > 1 && (
                  <RemoveButton
                    type="button"
                    onClick={() => removeGuest(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </RemoveButton>
                )}
              </GuestRow>
            ))}
            <AddGuestButton type="button" onClick={addGuest}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
              Add Guest
            </AddGuestButton>
          </GuestsSection>

          <SubmitButton type="submit">
            Create Party
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  )
}
