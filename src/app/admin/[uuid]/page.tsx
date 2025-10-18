'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState, useEffect, use, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import Layout from '@/components/Layout'
import AddPartyModal from '@/components/AddPartyModal'

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`

const AdminHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.xl};
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.neutral.white};
  box-shadow: ${theme.shadows.lg};
`

const AdminTitle = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 2.5rem;
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.secondary.goldLight};
`

const AdminSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.1rem;
  opacity: 0.9;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`

const StatCard = styled.div`
  background: ${theme.colors.neutral.white};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.primary.sageLight};
`

const StatNumber = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 2rem;
  font-weight: 600;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.xs};
`

const StatLabel = styled.div`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  font-size: 0.9rem;
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.8rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`

const PartiesList = styled.div`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.primary.sageLight};
  overflow: hidden;
`

const PartyCard = styled.div`
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.primary.sageLight};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${theme.colors.primary.sageLight}10;
  }
`

const PartyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
`

const PartyInfo = styled.div`
  flex: 1;
`

const PartyName = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.xs};
`

const PartyCode = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.gray};
  background: ${theme.colors.neutral.cream};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  display: inline-block;
`

const PartyActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`

const ActionButton = styled.button`
  background: ${theme.colors.secondary.gold};
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${theme.colors.secondary.goldLight};
    transform: translateY(-1px);
  }
  
  &.danger {
    background: ${theme.colors.status.error};
    
    &:hover {
      background: #d32f2f;
    }
  }
`

const GuestsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`

const GuestCard = styled.div`
  background: ${theme.colors.neutral.cream};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.primary.sageLight};
`

const GuestName = styled.div`
  font-family: ${theme.fonts.heading};
  font-weight: 600;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.xs};
`

const GuestDetails = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.8rem;
  color: ${theme.colors.neutral.gray};
  line-height: 1.4;
`

const AddButton = styled.button`
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
  color: ${theme.colors.neutral.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.lg};
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    background: linear-gradient(135deg, ${theme.colors.primary.sage}, ${theme.colors.primary.sageLight});
    transform: translateY(-1px);
    box-shadow: ${theme.shadows.md};
  }
`

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
`

const ErrorMessage = styled.div`
  background: ${theme.colors.status.error}20;
  color: ${theme.colors.status.error};
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  text-align: center;
  font-family: ${theme.fonts.body};
  margin-bottom: ${theme.spacing.lg};
`

interface Guest {
  id: string
  firstName: string
  lastName: string
  isAttending?: boolean
  dietaryRequirements?: string
  menuSelection?: string
}

interface Party {
  id: string
  code: string
  partyName: string
  maxGuests: number
  guests: Guest[]
}

interface AdminStats {
  totalParties: number
  totalGuests: number
  attendingGuests: number
  totalResponses: number
}

export default function AdminPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params)
  const [parties, setParties] = useState<Party[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalParties: 0,
    totalGuests: 0,
    attendingGuests: 0,
    totalResponses: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/${uuid}`)
      
      if (!response.ok) {
        throw new Error('Unauthorized access')
      }
      
      const data = await response.json()
      setParties(data.parties)
      setStats(data.stats)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }, [uuid])

  useEffect(() => {
    fetchAdminData()
  }, [uuid, fetchAdminData])

  const handleDeleteParty = async (partyId: string) => {
    if (!confirm('Are you sure you want to delete this party and all its guests?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/${uuid}/parties/${partyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete party')
      }

      await fetchAdminData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete party')
    }
  }

  const handleAddParty = async (data: { partyName: string; maxGuests: number; guests: { firstName: string; lastName: string }[] }) => {
    try {
      const response = await fetch(`/api/admin/${uuid}/parties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create party')
      }

      setShowAddModal(false)
      await fetchAdminData() // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create party')
    }
  }

  if (loading) {
    return (
      <Layout activePage="admin">
        <AdminContainer>
          <LoadingMessage>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2rem', marginBottom: '1rem', color: theme.colors.primary.sageDark }} />
            <div>Loading admin data...</div>
          </LoadingMessage>
        </AdminContainer>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout activePage="admin">
        <AdminContainer>
          <ErrorMessage>{error}</ErrorMessage>
        </AdminContainer>
      </Layout>
    )
  }

  return (
    <Layout activePage="admin">
      <AdminContainer>
        <AdminHeader>
          <AdminTitle>Rebecca & James&apos; Wedding Admin Dashboard</AdminTitle>
          <AdminSubtitle>Manage your wedding RSVPs and guest information</AdminSubtitle>
        </AdminHeader>

        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.totalParties}</StatNumber>
            <StatLabel>Total Parties</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalGuests}</StatNumber>
            <StatLabel>Total Guests</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.attendingGuests}</StatNumber>
            <StatLabel>Attending</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalResponses}</StatNumber>
            <StatLabel>Responses Received</StatLabel>
          </StatCard>
        </StatsGrid>

        <SectionTitle>All Parties & Guests</SectionTitle>

        <AddButton onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5rem' }} />
          Add New Party
        </AddButton>

        <PartiesList>
          {parties.map((party) => (
            <PartyCard key={party.id}>
              <PartyHeader>
                <PartyInfo>
                  <PartyName>{party.partyName}</PartyName>
                  <PartyCode>Code: {party.code}</PartyCode>
                </PartyInfo>
                <PartyActions>
                  <ActionButton>
                    <FontAwesomeIcon icon={faEdit} />
                  </ActionButton>
                  <ActionButton 
                    className="danger"
                    onClick={() => handleDeleteParty(party.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </ActionButton>
                </PartyActions>
              </PartyHeader>

              <GuestsList>
                {party.guests.map((guest) => (
                  <GuestCard key={guest.id}>
                    <GuestName>{guest.firstName} {guest.lastName}</GuestName>
                    <GuestDetails>
                      <div>
                        Status: {guest.isAttending === true ? '✅ Attending' : 
                                guest.isAttending === false ? '❌ Not Attending' : 
                                '⏳ No Response'}
                      </div>
                      {guest.menuSelection && (
                        <div>🍽️ {guest.menuSelection}</div>
                      )}
                      {guest.dietaryRequirements && (
                        <div>🥗 {guest.dietaryRequirements}</div>
                      )}
                    </GuestDetails>
                  </GuestCard>
                ))}
              </GuestsList>
            </PartyCard>
          ))}
        </PartiesList>

        <AddPartyModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddParty}
        />
      </AdminContainer>
    </Layout>
  )
}
