'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'

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
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.sm};
    align-items: flex-start;
    padding-top: ${theme.spacing.md};
  }
`

const ModalContent = styled.div`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.xl};
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${theme.shadows.lg};
  
  @media (max-width: 768px) {
    max-width: 95vw;
    padding: ${theme.spacing.lg};
    max-height: 95vh;
  }
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
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
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
  background: ${theme.colors.neutral.white};
  color: ${theme.colors.neutral.darkGray};
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.sageDark};
  }
  
  &::placeholder {
    color: ${theme.colors.neutral.gray};
  }
  
  @media (max-width: 768px) {
    font-size: 16px; /* Prevents zoom on iOS */
  }
`

const GuestsSection = styled.div`
  border: 1px solid ${theme.colors.primary.sageLight};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`

const GuestRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr minmax(100px, auto) minmax(40px, auto);
  gap: ${theme.spacing.sm};
  align-items: end;
  margin-bottom: ${theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.xs};
    align-items: stretch;
    
    & > * {
      width: 100%;
    }
  }
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.primary.sageDark};
  cursor: pointer;
  white-space: nowrap;
  padding: ${theme.spacing.sm};
  min-width: fit-content;
  
  input[type="checkbox"] {
    cursor: pointer;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.sm} 0;
    width: 100%;
  }
`

const RemoveButton = styled.button`
  background: ${theme.colors.status.error};
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    background: #d32f2f;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
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
  width: 100%;
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.sage}, ${theme.colors.primary.sageLight});
  }
  
  &:disabled {
    background: ${theme.colors.neutral.gray};
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: ${theme.spacing.md};
  }
`

interface Guest {
  id?: string
  firstName: string
  lastName: string
  isChild: boolean
}


const ErrorMessage = styled.div`
  color: ${theme.colors.status.error};
  font-size: 0.85rem;
  margin-top: ${theme.spacing.xs};
  font-family: ${theme.fonts.body};
`

interface AddPartyModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { partyName: string; code?: string; guests: Guest[] }) => void
  initialData?: {
    partyName: string
    code?: string
    id?: string
    guests: Guest[]
  }
  adminUuid?: string
}

export default function AddPartyModal({ isOpen, onClose, onSubmit, initialData, adminUuid }: AddPartyModalProps) {
  const [partyName, setPartyName] = useState(initialData?.partyName || '')
  const [code, setCode] = useState(initialData?.code || '')
  const [codeError, setCodeError] = useState('')
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [guests, setGuests] = useState<Guest[]>(
    initialData?.guests && initialData.guests.length > 0 
      ? initialData.guests 
      : [{ firstName: '', lastName: '', isChild: false }]
  )

  // Reset form when modal opens/closes or data changes
  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.partyName) {
        // Editing mode - populate with existing data
        console.log('Populating form with:', initialData)
        setPartyName(initialData.partyName || '')
        setCode(initialData.code || '')
        // Ensure guests array is properly populated - create a fresh array
        if (initialData.guests && initialData.guests.length > 0) {
          const guestsData = initialData.guests.map(g => ({
            id: g.id,
            firstName: g.firstName || '',
            lastName: g.lastName || '',
            isChild: g.isChild || false
          }))
          setGuests(guestsData)
        } else {
          setGuests([{ firstName: '', lastName: '', isChild: false }])
        }
      } else {
        // Adding mode - reset form
        console.log('Resetting form for new party')
        setPartyName('')
        setCode('')
        setGuests([{ firstName: '', lastName: '', isChild: false }])
      }
      // Reset error states when modal opens
      setCodeError('')
      setSubmitError('')
      setIsSubmitting(false)
    }
  }, [isOpen, initialData]) // Use initialData as dependency

  const validateCode = (codeValue: string): string => {
    const trimmedCode = codeValue.trim()
    if (!trimmedCode) {
      return '' // Empty is OK (will be auto-generated for new parties)
    }
    if (trimmedCode.length !== 4) {
      return 'Invitation code must be exactly 4 characters'
    }
    if (!/^[A-Z0-9]{4}$/.test(trimmedCode)) {
      return 'Invitation code must be 4 alphanumeric characters (A-Z, 0-9)'
    }
    return ''
  }

  const checkCodeAvailability = async (codeValue: string) => {
    if (!codeValue || codeValue.trim().length !== 4 || !adminUuid) {
      return
    }

    setIsCheckingCode(true)
    try {
      const response = await fetch(`/api/admin/${adminUuid}/check-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: codeValue.trim(),
          excludePartyId: initialData?.id
        }),
      })

      const data = await response.json()
      
      if (!data.available) {
        setCodeError('This invitation code is already in use. Please choose a different code.')
      } else {
        // Clear the "already in use" error if code is now available, but keep format errors
        setCodeError(prevError => {
          if (prevError === 'This invitation code is already in use. Please choose a different code.') {
            const formatError = validateCode(codeValue)
            return formatError
          }
          return prevError
        })
      }
    } catch (error) {
      console.error('Error checking code availability:', error)
      // Don't show error to user for check failures, just format validation
    } finally {
      setIsCheckingCode(false)
    }
  }

  // Debounced code availability check
  useEffect(() => {
    // Clear any existing timeout
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current)
    }

    const trimmedCode = code.trim()
    const formatError = validateCode(trimmedCode)
    
    // Only check availability if format is valid and code is exactly 4 characters
    if (!formatError && trimmedCode.length === 4 && adminUuid) {
      checkTimeoutRef.current = setTimeout(() => {
        checkCodeAvailability(trimmedCode)
      }, 500)
    } else if (trimmedCode.length < 4) {
      // Clear "already in use" error if code is incomplete
      setCodeError(prevError => {
        if (prevError === 'This invitation code is already in use. Please choose a different code.') {
          return ''
        }
        return prevError
      })
    }

    // Cleanup timeout on unmount or when code changes
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current)
      }
    }
  }, [code, adminUuid, initialData?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setCode(newCode)
    
    const formatError = validateCode(newCode)
    setCodeError(formatError)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setIsSubmitting(true)
    
    try {
      // Validate code format
      const trimmedCode = code.trim()
      const formatError = validateCode(trimmedCode)
      if (formatError) {
        setCodeError(formatError)
        setIsSubmitting(false)
        return
      }
      
      // If code is provided, check availability one more time before submitting
      if (trimmedCode && adminUuid) {
        setIsCheckingCode(true)
        try {
          const response = await fetch(`/api/admin/${adminUuid}/check-code`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code: trimmedCode,
              excludePartyId: initialData?.id
            }),
          })

          const data = await response.json()
          
          if (!data.available) {
            setCodeError('This invitation code is already in use. Please choose a different code.')
            setIsCheckingCode(false)
            setIsSubmitting(false)
            return
          }
        } catch (error) {
          console.error('Error checking code availability:', error)
          setCodeError('Unable to verify code availability. Please try again.')
          setIsCheckingCode(false)
          setIsSubmitting(false)
          return
        } finally {
          setIsCheckingCode(false)
        }
      }
      
      // Filter out empty guests
      const validGuests = guests.filter(guest => 
        guest.firstName.trim() && guest.lastName.trim()
      )
      
      // Call onSubmit and wait for it to complete
      await onSubmit({
        partyName,
        code: trimmedCode || undefined,
        guests: validGuests
      })
      
      // Show success message with SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: initialData ? 'Details updated successfully!' : 'Party created successfully!',
        confirmButtonColor: '#d7b259',
        confirmButtonText: 'OK',
        timer: 2000,
        timerProgressBar: true
      })
      
      // Close modal after success
      onClose()
      
      // Reset form
      setPartyName('')
      setCode('')
      setCodeError('')
      setSubmitError('')
      setGuests([{ firstName: '', lastName: '', isChild: false }])
    } catch (error) {
      // Handle submission errors
      const errorMessage = error instanceof Error ? error.message : 'Failed to save. Please try again.'
      setSubmitError(errorMessage)
      setIsSubmitting(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addGuest = () => {
    setGuests([...guests, { firstName: '', lastName: '', isChild: false }])
  }

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index))
    }
  }

  const updateGuest = (index: number, field: keyof Guest, value: string | boolean) => {
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
          <ModalTitle>{initialData ? 'Edit Party' : 'Add New Party'}</ModalTitle>
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
            <Label htmlFor="code">
              Invitation Code 
              {!initialData && <span style={{ fontWeight: 400, fontSize: '0.9rem', color: theme.colors.neutral.gray }}> (optional - will be auto-generated if empty)</span>}
            </Label>
            <Input
              id="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="e.g., MOB1"
              maxLength={4}
              style={codeError ? { borderColor: theme.colors.status.error } : {}}
            />
            {codeError && <ErrorMessage>{codeError}</ErrorMessage>}
            {isCheckingCode && (
              <div style={{ fontSize: '0.85rem', color: theme.colors.neutral.gray, marginTop: theme.spacing.xs }}>
                Checking availability...
              </div>
            )}
            {!initialData && !codeError && !isCheckingCode && code.length > 0 && code.length < 4 && (
              <div style={{ fontSize: '0.85rem', color: theme.colors.neutral.gray, marginTop: theme.spacing.xs }}>
                {4 - code.length} character{4 - code.length > 1 ? 's' : ''} remaining
              </div>
            )}
          </FormGroup>

          {submitError && (
            <ErrorMessage style={{ marginBottom: theme.spacing.md }}>
              {submitError}
            </ErrorMessage>
          )}

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
                <CheckboxLabel>
                  <input
                    type="checkbox"
                    checked={guest.isChild}
                    onChange={(e) => updateGuest(index, 'isChild', e.target.checked)}
                  />
                  Child
                </CheckboxLabel>
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

          <SubmitButton 
            type="submit"
            disabled={isSubmitting || isCheckingCode}
          >
            {isSubmitting 
              ? (initialData ? 'Updating...' : 'Creating...') 
              : (initialData ? 'Update Party' : 'Create Party')
            }
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  )
}
