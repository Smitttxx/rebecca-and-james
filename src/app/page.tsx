'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faMapMarkerAlt, faHeart, faCamera, faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.neutral.cream} 0%, ${theme.colors.primary.sageLight} 100%);
  position: relative;
  overflow: hidden;
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  position: relative;
  z-index: 10;
`

const Logo = styled.div`
  font-family: ${theme.fonts.script};
  font-size: 1.5rem;
  font-weight: 600;
  color: ${theme.colors.primary.sageDark};
`

const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing.xl};
`

const NavLink = styled(Link)`
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  color: ${theme.colors.neutral.darkGray};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${theme.colors.primary.sageDark};
  }
`

const HeroSection = styled.section`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
  margin-bottom: ${theme.spacing.xl};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl} 0;
    margin-bottom: ${theme.spacing.xxl};
  }
`

const Title = styled.h1`
  font-family: ${theme.fonts.script};
  font-size: 3rem;
  font-weight: 400;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 4rem;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 5rem;
  }
`

const Date = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.2rem;
  color: ${theme.colors.neutral.darkGray};
  margin-bottom: ${theme.spacing.lg};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.4rem;
  }
`

const IntroText = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.1rem;
  color: ${theme.colors.neutral.gray};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.2rem;
    max-width: 700px;
  }
`

const StorySection = styled.section`
  padding: ${theme.spacing.xl} 0;
  margin-bottom: ${theme.spacing.xl};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl} 0;
    margin-bottom: ${theme.spacing.xxl};
  }
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 2.2rem;
  color: ${theme.colors.primary.sageDark};
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  position: relative;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 2.8rem;
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

const StoryContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xl};
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr;
    gap: ${theme.spacing.xxl};
  }
`

const StoryText = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  line-height: 1.7;
  color: ${theme.colors.neutral.darkGray};
  
  p {
    margin-bottom: ${theme.spacing.lg};
  }
`

const StoryImage = styled.div`
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.lg};
  text-align: center;
  
  img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: ${theme.borderRadius.md};
  }
`

const EventDetails = styled.section`
  background: linear-gradient(135deg, ${theme.colors.primary.sageLight}, ${theme.colors.primary.sage});
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.primary.sage};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  }
`

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.lg};
  max-width: 1000px;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing.xl};
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    max-width: 1200px;
    gap: ${theme.spacing.xxl};
  }
`

const DetailCard = styled.div`
  text-align: center;
  padding: ${theme.spacing.lg};
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.primary.sageLight};
  transition: all 0.3s ease;
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`

const DetailIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg};
  font-size: 1.5rem;
  color: ${theme.colors.neutral.white};
  box-shadow: ${theme.shadows.sm};
`

const DetailTitle = styled.h3`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  color: ${theme.colors.primary.sageDark};
  margin-bottom: ${theme.spacing.sm};
  font-weight: 500;
`

const DetailText = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.neutral.gray};
  line-height: 1.5;
  font-size: 0.9rem;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`


const SunflowerDecoration = styled.div`
  position: absolute;
  top: 20%;
  right: 10%;
  width: 100px;
  height: 100px;
  background: ${theme.colors.accent.sunflower};
  border-radius: ${theme.borderRadius.full};
  opacity: 0.1;
  
  &::before {
    content: '🌻';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
  }
`

export default function Home() {
  return (
    <Layout activePage="home">
      <HeroSection>
        <Title>Rebecca & James</Title>
        <Date>October 15th, 2024</Date>
        <IntroText>
          Join us as we celebrate our love story and begin our journey as husband and wife.
        </IntroText>
      </HeroSection>

      <EventDetails>
        <DetailsGrid>
          <DetailCard>
            <DetailIcon>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </DetailIcon>
            <DetailTitle>When</DetailTitle>
            <DetailText>
              October 15th, 2024<br />
              4:00 PM
            </DetailText>
          </DetailCard>
          <DetailCard>
            <DetailIcon>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </DetailIcon>
            <DetailTitle>Where</DetailTitle>
            <DetailText>
              Willow Creek Gardens<br />
              Portland, Oregon
            </DetailText>
          </DetailCard>
          <DetailCard>
            <DetailIcon>
              <FontAwesomeIcon icon={faHeart} />
            </DetailIcon>
            <DetailTitle>Dress Code</DetailTitle>
            <DetailText>
              Garden Party Elegant<br />
              Earth tones welcome
            </DetailText>
          </DetailCard>
        </DetailsGrid>
      </EventDetails>

      <StorySection>
        <SectionTitle>Our Story</SectionTitle>
        <StoryContent>
          <StoryText>
            <p>
              Rebecca and James first met at a coffee shop in downtown Portland on a rainy Tuesday morning. 
              What started as a chance encounter over spilled coffee turned into hours of conversation about 
              travel, books, and dreams.
            </p>
            <p>
              Three years later, James proposed during a sunset hike at their favorite trail, with a ring 
              hidden in Rebecca's favorite hiking backpack. She said yes before he could even finish asking 
              the question!
            </p>
            <p>
              Now, we're excited to celebrate this next chapter with our closest family and friends. 
              Thank you for being part of our journey.
            </p>
          </StoryText>
          <StoryImage>
            <img 
              src="/api/placeholder/400/300" 
              alt="Rebecca and James" 
            />
          </StoryImage>
        </StoryContent>
      </StorySection>
    </Layout>
  )
}
