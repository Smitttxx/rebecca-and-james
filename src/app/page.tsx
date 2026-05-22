'use client'

import styled, { keyframes } from 'styled-components'
import { theme } from '@/styles/theme'
import Layout from '@/components/Layout'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import CountUp from '@/components/CountUp'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

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

function useIntersectionObserver(ref: React.RefObject<HTMLElement | null>, options = {}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting) },
      { threshold: 0, rootMargin: '100px 0px', ...options }
    )

    observer.observe(element)
    return () => { observer.disconnect() }
  }, [ref, options])

  return isVisible
}

export default function Home() {
  const [daysUntilWedding, setDaysUntilWedding] = useState(0)

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const wedding = new Date(2026, 5, 20)
      const diffDays = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      setDaysUntilWedding(diffDays > 0 ? diffDays : 0)
    }
    calculateDays()
    const interval = setInterval(calculateDays, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  const storyRef = useRef<HTMLElement>(null)
  const storyVisible = useIntersectionObserver(storyRef)

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => { document.documentElement.style.scrollBehavior = 'auto' }
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
      </HeroSection>

      <AnimatedSection id="our-story" ref={storyRef} $isVisible={storyVisible}>
        <SectionTitle>Our Story</SectionTitle>
        <StoryContent $isVisible={storyVisible}>
          <StoryText>
            <p>
              Rebecca and James have been &quot;Becky & Jay&quot; since 20th June 2010 - two teenagers who spent their nights chatting on Facebook, planning the next time they could sneak out just to see each other for a few minutes. What started as innocent puppy love quickly became something real, and neither of them ever looked back.
            </p>
            <p>
              They grew up together - from exams and first jobs to owning a home, holidays, and building a home that&apos;s always full of noise, cuddles, and the kind of chaos only kids bring. Their greatest adventures arrived in the form of their boys, Theo and James, who turned their little love story into a family.
            </p>
            <p>
              Their wedding isn&apos;t just about saying yes to each other. It&apos;s about honouring the life they&apos;ve already built together, and promising to keep choosing each other, every day, just like they have since that sunny June afternoon in 2010.
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
              style={{ width: '100%', maxWidth: '300px', aspectRatio: '1 / 1', objectFit: 'cover', borderRadius: theme.borderRadius.md, marginBottom: theme.spacing.md, margin: 'auto' }}
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
    </Layout>
  )
}
