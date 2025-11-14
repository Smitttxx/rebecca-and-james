'use client'

import styled, { keyframes } from 'styled-components'
import { theme } from '@/styles/theme'
import Layout from '@/components/Layout'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faRing, faCamera, faGlassCheers, faUtensils, faMicrophone, faMusic, faMoon, faCake, faDrumstickBite } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useRef, useState } from 'react'
import CountUp from '@/components/CountUp'
import Link from 'next/link'

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

// Animated Section Wrapper
const AnimatedSection = styled.section<{ $isVisible: boolean }>`
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  }
`

const HeroSection = styled.section`
  text-align: center;
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  background-image: url('/photo-1704452607741-e3e0e87002f6.avif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  animation: ${fadeIn} 1s ease-out;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: visible;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.75);
    z-index: 0;
  }
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
    min-height: 70vh;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    min-height: 80vh;
  }
`

const HeroSubtitle = styled.p`
  font-family: ${theme.fonts.serif};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.mutedGreen};
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: ${theme.spacing.md};
  font-weight: 500;
  position: relative;
  z-index: 1;
`

const HeroTitle = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: ${theme.spacing.md};
  line-height: 1.2;
  color: ${theme.colors.neutral.mutedGreen};
  position: relative;
  z-index: 1;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 4rem;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 5rem;
  }
`

const HeroText = styled.p`
  font-family: ${theme.fonts.serif};
  font-size: 1.1rem;
  color: ${theme.colors.neutral.mutedGreen};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 500;
  position: relative;
  z-index: 1;
`

const CountdownLabelSmall = styled.p`
  font-family: ${theme.fonts.serif};
  font-size: 0.75rem;
  color: ${theme.colors.neutral.gray};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${theme.spacing.xs};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.85rem;
  }
`

const CountdownNumberSmall = styled.div`
  font-family: ${theme.fonts.serif};
  font-size: 2rem;
  color: ${theme.colors.primary.eucalyptusDark};
  font-weight: 700;
  line-height: 1;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`

const RSVPButton = styled(Link)`
  margin-top: ${theme.spacing.xl};
  position: relative;
  z-index: 1;
  display: inline-block;
  background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
  color: ${theme.colors.neutral.white};
  font-family: ${theme.fonts.serif};
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: ${theme.borderRadius.lg};
  text-decoration: none;
  box-shadow: ${theme.shadows.md};
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
    background: linear-gradient(135deg, ${theme.colors.secondary.goldLight}, ${theme.colors.secondary.gold});
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.2rem;
  }
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 2rem;
  color: ${theme.colors.primary.sageDark};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: ${theme.colors.secondary.gold};
  }
`

const StoryContent = styled.div<{ $isVisible: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xl};
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`

const StoryText = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  line-height: 1.7;
  color: ${theme.colors.neutral.darkGray};
  
  p {
    margin-bottom: ${theme.spacing.md};
  }
`

const AccommodationGrid = styled.div<{ $isVisible: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  max-width: 800px;
  margin: 0 auto;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid rgba(122, 139, 107, 0.15);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)'};
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`

const AccommodationInfo = styled.div`
  background: ${theme.colors.neutral.white};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  height: 100%;
`

const HotelHeader = styled.div`
  background: ${theme.colors.primary.eucalyptusDark};
  padding: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.neutral.white};
  margin-bottom: ${theme.spacing.xl};
`

const HotelName = styled.h3`
  font-family: ${theme.fonts.serif};
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: ${theme.spacing.sm};
  letter-spacing: 0.5px;
`

const HotelSubtitle = styled.p`
  font-family: ${theme.fonts.serif};
  font-size: 0.9rem;
  opacity: 0.9;
  font-style: italic;
  font-weight: 300;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid rgba(122, 139, 107, 0.1);
  margin-bottom: ${theme.spacing.sm};
  
  &:last-of-type {
    border-bottom: none;
    margin-bottom: 0;
  }
`

const InfoLabel = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.primary.eucalyptusDark};
  font-weight: 500;
`

const InfoValue = styled.span`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.neutral.darkGray};
  text-align: right;
`

const InfoLink = styled.a`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.primary.eucalyptus};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`

const RateBox = styled.div`
  padding: ${theme.spacing.lg};
  background: ${theme.colors.neutral.white};
  border-top: 1px solid rgba(122, 139, 107, 0.1);
  margin-top: ${theme.spacing.xl};
`

const RateTitle = styled.h4`
  font-family: ${theme.fonts.serif};
  font-size: 1.1rem;
  color: ${theme.colors.primary.eucalyptusDark};
  margin-bottom: ${theme.spacing.sm};
  text-align: center;
  font-weight: 500;
`

const RateText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.neutral.gray};
  text-align: center;
  margin-bottom: ${theme.spacing.md};
`

const RateCta = styled.div`
  background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
  color: ${theme.colors.neutral.white};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-family: ${theme.fonts.serif};
  font-size: 0.85rem;
  font-weight: 600;
`

const AccommodationImage = styled.div`
  background: ${theme.colors.neutral.white};
  overflow: hidden;
  position: relative;
  min-height: 400px;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    min-height: 600px;
  }
`

// Gifts Section - Using AccommodationGrid style
const GiftsSection = styled(AnimatedSection)`
  padding: ${theme.spacing.xxl} ${theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxxl} ${theme.spacing.xl};
  }
`

const GiftsGrid = styled.div<{ $isVisible: boolean }>`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  max-width: 800px;
  margin: 0 auto;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.lg};
  border: 1px solid rgba(122, 139, 107, 0.15);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.98)'};
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
  }
`

const GiftsInfo = styled.div`
  background: ${theme.colors.neutral.white};
  padding: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl};
  }
`

const GiftsSectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.8rem;
  color: ${theme.colors.primary.sageDark};
  text-align: left;
  margin-bottom: ${theme.spacing.lg};
  font-weight: 600;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2rem;
    margin-bottom: ${theme.spacing.xl};
  }
`

const GiftsNoteText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  color: ${theme.colors.neutral.darkGray};
  line-height: 1.8;
  margin-bottom: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.1rem;
    margin-bottom: ${theme.spacing.xl};
  }
`

// Removed unused styled component: GiftsNoteTitle

const GiftsNoteSubtext = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  color: ${theme.colors.neutral.darkGray};
  line-height: 1.8;
  margin-bottom: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.05rem;
    margin-bottom: ${theme.spacing.xl};
  }
`

const GiftsNoteItalic = styled.p`
  font-family: ${theme.fonts.serif};
  font-size: 1.1rem;
  color: ${theme.colors.secondary.goldDark};
  font-style: italic;
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
  font-weight: 500;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.2rem;
    margin-bottom: ${theme.spacing.xl};
  }
`

// Removed unused styled component: GiftsNoteClosing

const GiftsImage = styled.div`
  background: ${theme.colors.neutral.white};
  overflow: hidden;
  position: relative;
  min-height: 400px;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    min-height: 600px;
  }
`

const TimelineContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  padding: ${theme.spacing.lg} 0;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.md} ${theme.spacing.sm};
  }
`

const TimelineLine = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  left: 148px;
  top: 60px;
  bottom: 60px;
  width: 3px;
  background: linear-gradient(180deg, ${theme.colors.secondary.gold} 0%, ${theme.colors.primary.eucalyptusLight} 50%, ${theme.colors.secondary.gold} 100%);
  transform-origin: top;
  transform: ${props => props.$isVisible ? 'scaleY(1)' : 'scaleY(0)'};
  transition: transform 1.2s ease-out;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    left: 117px;
    top: 40px;
    bottom: 40px;
    width: 2px;
  }
`

const TimelineItem = styled.div<{ $isVisible: boolean; $delay?: number }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.lg} 0;
  position: relative;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease-out;
  transition-delay: ${props => props.$delay || 0}ms;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: row;
    align-items: center;
    gap: ${theme.spacing.md};
    padding: ${theme.spacing.md} 0;
    padding-left: 0;
    margin-left: 0;
  }
`

const TimelineTime = styled.div<{ $isVisible: boolean; $delay?: number }>`
  font-family: ${theme.fonts.serif};
  font-size: 1.2rem;
  color: ${theme.colors.primary.eucalyptusDark};
  font-weight: 700;
  text-align: right;
  width: 100px;
  flex-shrink: 0;
  transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(-30px)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  transition-delay: ${props => (props.$delay || 0) + 20}ms;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    text-align: right;
    width: 75px;
    font-size: 1rem;
    flex-shrink: 0;
    transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(-15px)'};
  }
`

const TimelineIcon = styled.div<{ $isVisible: boolean; $delay?: number }>`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: ${theme.shadows.md};
  border: 3px solid ${theme.colors.neutral.white};
  position: relative;
  z-index: 2;
  transform: ${props => props.$isVisible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-180deg)'};
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  transition-delay: ${props => props.$delay || 0}ms;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;
    border-width: 2px;
    
    svg {
      font-size: 0.85rem !important;
    }
  }
`

const TimelineEvent = styled.div<{ $isVisible: boolean; $delay?: number }>`
  font-family: ${theme.fonts.script};
  font-size: 1.2rem;
  color: ${theme.colors.neutral.darkGray};
  font-weight: 500;
  text-align: left;
  background: ${theme.colors.neutral.white};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  box-shadow: ${theme.shadows.sm};
  border: 1px solid ${theme.colors.primary.eucalyptusLight};
  flex: 1;
  transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(20px)'};
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  transition-delay: ${props => (props.$delay || 0) + 40}ms;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex: 1;
    min-width: 0;
    font-size: 0.95rem;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    transform: ${props => props.$isVisible ? 'translateX(0)' : 'translateX(10px)'};
  }
`

// Hook for intersection observer - allows re-triggering on scroll
function useIntersectionObserver(ref: React.RefObject<HTMLElement | null>, options = {}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { 
        threshold: 0,
        rootMargin: '100px 0px',
        ...options 
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isVisible
}

export default function Home() {
  // Calculate days until wedding (June 20, 2026)
  const [daysUntilWedding, setDaysUntilWedding] = useState(0)
  
  useEffect(() => {
    const calculateDays = () => {
      // June 20, 2026 - create date explicitly to avoid timezone issues
      const weddingYear = 2026
      const weddingMonth = 5 // June (0-indexed)
      const weddingDay = 20
      
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const wedding = new Date(weddingYear, weddingMonth, weddingDay)
      
      const diffTime = wedding.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      // If wedding has passed, show 0, otherwise show the days
      const days = diffDays > 0 ? diffDays : 0
      
      setDaysUntilWedding(days)
    }
    
    // Calculate immediately
    calculateDays()
    
    // Update every hour to keep it accurate
    const interval = setInterval(calculateDays, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])
  
  const timelineItems = [
    { time: '1:00 PM', event: 'Arrive', icon: faCalendarAlt },
    { time: '1:30 PM', event: 'Ceremony', icon: faRing },
    { time: '2:15 PM', event: 'Group shot', icon: faCamera },
    { time: '2:30 PM', event: 'Canapés & drinks', icon: faGlassCheers },
    { time: '4:30 PM', event: 'Wedding breakfast', icon: faUtensils },
    { time: '6:00 PM', event: 'Speeches', icon: faMicrophone },
    { time: '8:15 PM', event: 'Cut the cake', icon: faCake },
    { time: '8:30 PM', event: 'First dance', icon: faMusic },
    { time: '9:00 PM', event: 'Dance floor opens', icon: faMusic },
    { time: '9:30 PM', event: 'Evening buffet', icon: faDrumstickBite },
    { time: '12:00 AM', event: 'Carriages', icon: faMoon }
  ]

  const storyRef = useRef<HTMLElement>(null)
  const accommodationRef = useRef<HTMLElement>(null)
  const giftsRef = useRef<HTMLElement>(null)
  const orderOfDayRef = useRef<HTMLElement>(null)
  const timelineLineRef = useRef<HTMLDivElement>(null)
  
  // Create refs for each timeline item
  const timelineItemRefs = useRef<(HTMLDivElement | null)[]>([])

  const storyVisible = useIntersectionObserver(storyRef)
  const accommodationVisible = useIntersectionObserver(accommodationRef)
  const giftsVisible = useIntersectionObserver(giftsRef)
  const orderOfDayVisible = useIntersectionObserver(orderOfDayRef)
  const timelineLineVisible = useIntersectionObserver(timelineLineRef)
  
  // Track visibility for each timeline item
  const [timelineItemVisible, setTimelineItemVisible] = useState<boolean[]>([])
  
  // Initialize timeline visibility array
  useEffect(() => {
    setTimelineItemVisible(new Array(timelineItems.length).fill(false))
  }, [timelineItems.length])
  
  useEffect(() => {
    // Wait a bit for refs to be set, then observe each item
    const timeoutId = setTimeout(() => {
      const observers: IntersectionObserver[] = []
      
      timelineItemRefs.current.forEach((ref, index) => {
        if (!ref) return
        
        const observer = new IntersectionObserver(
          ([entry]) => {
            setTimelineItemVisible(prev => {
              const newState = [...prev]
              newState[index] = entry.isIntersecting
              return newState
            })
          },
          { threshold: 0, rootMargin: '200px 0px' }
        )
        
        observer.observe(ref)
        observers.push(observer)
      })
      
      return () => {
        observers.forEach(observer => observer.disconnect())
      }
    }, 200)
    
    return () => {
      clearTimeout(timeoutId)
    }
  }, [timelineItems.length])

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <Layout activePage="home">
      <HeroSection>
        <HeroSubtitle>You are invited to the wedding of</HeroSubtitle>
        <HeroTitle>
          Rebecca <span style={{ color: theme.colors.secondary.gold, fontWeight: 300 }}>&</span> James
        </HeroTitle>
        <HeroText>Saturday, June 20th, 2026 at 1:00 PM</HeroText>
        <HeroText>
          Everglades Hotel<br />
          Derby Road, Widnes<br />
          WA8 3UJ
        </HeroText>
        <RSVPButton href="/rsvp">RSVP</RSVPButton>
      </HeroSection>

      <AnimatedSection id="our-story" ref={storyRef} $isVisible={storyVisible}>
        <SectionTitle>Our Story</SectionTitle>
        <StoryContent $isVisible={storyVisible}>
          <StoryText>
            <p>
            Rebecca and James have been ”Becky & Jay” since 20th June 2010 - two teenagers who spent their nights chatting on Facebook, planning the next time they could sneak out just to see each other for a few minutes. What started as innocent puppy love quickly became something real, and neither of them ever looked back.
            </p>
            <p>
            They grew up together - from exams and first jobs to owning a home, holidays, and building a home that’s always full of noise, cuddles, and the kind of chaos only kids bring. Their greatest adventures arrived in the form of their boys, Theo and James, who turned their little love story into a family.            </p>
            <p>

            </p>
          <p>
          Their wedding isn’t just about saying yes to each other. It’s about honouring the life they’ve already built together, and promising to keep choosing each other, every day, just like they have since that sunny June afternoon in 2010.
            </p>
          </StoryText>
          <div style={{ 
            background: theme.colors.neutral.white, 
            borderRadius: theme.borderRadius.lg, 
            padding: theme.spacing.lg, 
            boxShadow: theme.shadows.lg,
            textAlign: 'center',
            overflow: 'hidden'
          }}>
            <Image 
              src="/image.png" 
              alt="Rebecca and James"
              width={300}
              height={300}
              style={{ width: '100%', maxWidth: '300px', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, margin: "auto" }}
            />
            <CountdownLabelSmall style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}>Days Until We Say &quot;I Do&quot;</CountdownLabelSmall>
            <CountdownNumberSmall>
              {daysUntilWedding > 0 ? (
                <CountUp 
                  key={`countdown-story-${daysUntilWedding}`}
                  to={daysUntilWedding} 
                  from={0}
                  duration={2}
                  delay={0.5}
                  startWhen={true}
                  onStart={() => {}}
                  onEnd={() => {}}
                />
              ) : (
                '0'
              )}
            </CountdownNumberSmall>
          </div>
        </StoryContent>
      </AnimatedSection>

      <AnimatedSection id="accommodation" ref={accommodationRef} $isVisible={accommodationVisible} style={{ background: theme.colors.neutral.cream }}>
        <SectionTitle>Accommodation</SectionTitle>
        <AccommodationGrid $isVisible={accommodationVisible}>
          <AccommodationInfo>
            <HotelHeader>
              <HotelName>Everglades Hotel</HotelName>
              <HotelSubtitle>Our Wedding Venue</HotelSubtitle>
            </HotelHeader>
            <div style={{ flex: 1 }}>
              <InfoRow>
                <InfoLabel>Address</InfoLabel>
                <InfoValue>Derby Road, Widnes, Cheshire WA8 3UJ</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Contact</InfoLabel>
                <InfoValue>0151 495 5500</InfoValue>
              </InfoRow>
              <InfoRow>
                <InfoLabel>Website</InfoLabel>
                <InfoLink href="https://everglades.lavenderhotels.co.uk/" target="_blank" rel="noopener noreferrer">
                  everglades.lavenderhotels.co.uk
                </InfoLink>
              </InfoRow>
            </div>
            <RateBox style={{ marginTop: 'auto' }}>
              <RateTitle>Special Wedding Rates Available</RateTitle>
              <RateText>Discounted rates for wedding guests - call and quote our wedding.</RateText>
              <RateCta>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Call 0151 495 5500 and quote our wedding</span>
              </RateCta>
            </RateBox>
          </AccommodationInfo>
          <AccommodationImage>
            <Image
              src="/everglades-hotel.jpg" 
              alt="Everglades Hotel exterior"
              width={500}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </AccommodationImage>
        </AccommodationGrid>
      </AnimatedSection>

      <GiftsSection id="gifts" ref={giftsRef} $isVisible={giftsVisible}>
        <GiftsGrid $isVisible={giftsVisible}>
          <GiftsInfo>
            <GiftsSectionTitle>Gifts</GiftsSectionTitle>
            <GiftsNoteText>
              We can&apos;t wait to celebrate with you! We&apos;re lucky to already have everything we need for our family home.
            </GiftsNoteText>
            <GiftsNoteSubtext>
              Truly, the best gift is just having you there. Your love and support is what matters most to us.
            </GiftsNoteSubtext>
            <GiftsNoteSubtext>
              If you were thinking of a gift, we&apos;d love a little help making memories exploring Egypt on our honeymoon.
            </GiftsNoteSubtext>
            <GiftsNoteItalic>Whatever feels right for you</GiftsNoteItalic>
          </GiftsInfo>
          <GiftsImage>
            <Image
              src="/egypt.png"
              alt="Egypt - Our Honeymoon Destination"
              width={500}
              height={600}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </GiftsImage>
        </GiftsGrid>
      </GiftsSection>

      <AnimatedSection id="order-of-day" ref={orderOfDayRef} $isVisible={orderOfDayVisible}>
        <SectionTitle>Order of the Day</SectionTitle>
        <TimelineContainer>
          <TimelineLine ref={timelineLineRef} $isVisible={timelineLineVisible} />
          {timelineItems.map((item, index) => {
            const isItemVisible = timelineItemVisible[index] === true
            const delay = index * 10 // Stagger animation by 10ms per item
            
            return (
              <TimelineItem 
                key={index}
                ref={(el) => {
                  if (el) {
                    timelineItemRefs.current[index] = el
                  }
                }}
                $isVisible={isItemVisible}
                $delay={delay}
              >
                <TimelineTime $isVisible={isItemVisible} $delay={delay}>
                  {item.time}
                </TimelineTime>
                <TimelineIcon $isVisible={isItemVisible} $delay={delay}>
                  <FontAwesomeIcon icon={item.icon} style={{ color: theme.colors.neutral.white, fontSize: '1rem' }} />
                </TimelineIcon>
                <TimelineEvent $isVisible={isItemVisible} $delay={delay}>
                  {item.event}
                </TimelineEvent>
              </TimelineItem>
            )
          })}
        </TimelineContainer>
      </AnimatedSection>
    </Layout>
  )
}
