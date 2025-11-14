'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Link from 'next/link'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faEnvelope, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.neutral.cream} 0%, ${theme.colors.primary.sageLight} 100%);
  position: relative;
  overflow-x: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background-image: url('/leaves.png');
    background-size: contain;
    background-repeat: no-repeat;
    opacity: 0.15;
    z-index: 1;
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      width: 250px;
      height: 250px;
    }
    
    @media (min-width: ${theme.breakpoints.desktop}) {
      width: 350px;
      height: 350px;
    }
  }
`

const BlottedPaperDecoration = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  background-image: url('/blotted-paper.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.03;
  z-index: 1;
  pointer-events: none;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 300px;
    height: 300px;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    width: 400px;
    height: 400px;
  }
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  position: relative;
  z-index: 10;
  background: linear-gradient(135deg, ${theme.colors.primary.eucalyptusDark}, ${theme.colors.primary.eucalyptus});
  box-shadow: ${theme.shadows.sm};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.md} ${theme.spacing.lg};
  }
`

const Logo = styled(Link)`
  font-family: ${theme.fonts.script};
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.neutral.white};
  text-decoration: none;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.3rem;
  }
`

const Nav = styled.nav<{ $isOpen?: boolean }>`
  display: flex;
  gap: ${theme.spacing.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    background: linear-gradient(135deg, ${theme.colors.primary.eucalyptusDark}, ${theme.colors.primary.eucalyptus});
    flex-direction: column;
    padding: ${theme.spacing.xl};
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease;
    box-shadow: ${theme.shadows.lg};
    z-index: 1000;
  }
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    gap: ${theme.spacing.lg};
  }
`

const NavLink = styled(Link)`
  font-family: ${theme.fonts.body};
  font-size: 0.85rem;
  color: ${theme.colors.neutral.white};
  text-decoration: none;
  transition: color 0.3s ease;
  opacity: 0.9;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 0.95rem;
  }
  
  &:hover {
    opacity: 1;
    color: ${theme.colors.secondary.goldLight};
  }
  
  &.active {
    color: ${theme.colors.secondary.goldLight};
    font-weight: 600;
    opacity: 1;
  }
`

const BurgerButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.neutral.white};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: block;
  }
`

const Overlay = styled.div<{ $isOpen?: boolean }>`
  display: none;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`

const MainContent = styled.main`
  padding: 0;
  max-width: 100%;
  margin: 0;
  width: 100%;
  position: relative;
`

const BackgroundDecoration = styled.div`
  position: absolute;
  top: 20%;
  right: 10%;
  width: 100px;
  height: 100px;
  background-image: url('/plant-stem.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.06;
  z-index: 1;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 150px;
    height: 150px;
    top: 15%;
    right: 8%;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    width: 200px;
    height: 200px;
    top: 12%;
    right: 6%;
  }
`

const BottomLeftDecoration = styled.div`
  position: absolute;
  bottom: 15%;
  left: 5%;
  width: 120px;
  height: 120px;
  background-image: url('/pampas.png');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.05;
  z-index: 1;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    width: 180px;
    height: 180px;
    bottom: 10%;
    left: 3%;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    width: 250px;
    height: 250px;
    bottom: 8%;
    left: 2%;
  }
`

const Footer = styled.footer`
  color: ${theme.colors.neutral.white};
  text-align: center;
  padding: ${theme.spacing.xl};
  width: 100%;
  background: ${theme.colors.primary.eucalyptusDark};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.xxl};
  }
`

const FooterTitle = styled.h3`
  font-family: ${theme.fonts.script};
  font-size: 1.5rem;
  margin-bottom: ${theme.spacing.sm};
`

const FooterText = styled.p`
  font-family: ${theme.fonts.body};
  opacity: 0.9;
  margin-bottom: ${theme.spacing.lg};
`

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.lg};
`

const SocialIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${theme.colors.neutral.white};
  border-radius: ${theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
  color: ${theme.colors.primary.eucalyptusDark};
  font-size: 1.2rem;
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    transform: scale(1.1);
    background: ${theme.colors.primary.eucalyptusDark};
    color: ${theme.colors.neutral.white};
  }
`

const ContactSection = styled.div`
  margin-top: ${theme.spacing.lg};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`

const ContactTitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  opacity: 0.9;
  margin-bottom: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
`

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  align-items: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: center;
    gap: ${theme.spacing.xl};
  }
`

const ContactPerson = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  align-items: center;
`

const ContactName = styled.div`
  font-family: ${theme.fonts.serif};
  font-size: 1rem;
  font-weight: 600;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
`

const ContactPhone = styled.a`
  font-family: ${theme.fonts.body};
  font-size: 0.9rem;
  color: ${theme.colors.neutral.white};
  text-decoration: none;
  transition: opacity 0.3s ease;
  opacity: 0.9;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 1rem;
  }
  
  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`

interface LayoutProps {
  children: React.ReactNode
  activePage?: string
}

export default function Layout({ children, activePage }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

      return (
        <>
          <Container>
            <BackgroundDecoration />
            <BottomLeftDecoration />
            <BlottedPaperDecoration />
            
            <Header>
          <Logo href="/">R & J</Logo>
          <BurgerButton onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
          </BurgerButton>
          <Nav $isOpen={isMenuOpen}>
            <NavLink href="/" className={activePage === 'home' ? 'active' : ''} onClick={closeMenu}>Home</NavLink>
            <NavLink href="/#event-details" onClick={closeMenu}>Event Details</NavLink>
            <NavLink href="/#order-of-day" onClick={closeMenu}>Order of Day</NavLink>
            <NavLink href="/#gifts" onClick={closeMenu}>Gifts</NavLink>
            <NavLink href="/#accommodation" onClick={closeMenu}>Accommodation</NavLink>
            <NavLink href="/#our-story" onClick={closeMenu}>Our Story</NavLink>
            <NavLink href="/rsvp" className={activePage === 'rsvp' ? 'active' : ''} onClick={closeMenu}>RSVP</NavLink>
            <NavLink href="/admin/admin-12345-67890-abcdef" className={activePage === 'admin' ? 'active' : ''} onClick={closeMenu}>Admin</NavLink>
          </Nav>
        </Header>

        <Overlay $isOpen={isMenuOpen} onClick={closeMenu} />

        <MainContent>
          {children}
        </MainContent>
      </Container>

      <Footer>
        <FooterTitle>Rebecca & James</FooterTitle>
        <FooterText>June 20th, 2026 • Everglades Hotel</FooterText>
        <SocialIcons>
          <SocialIcon>
            <FontAwesomeIcon icon={faCamera} />
          </SocialIcon>
          <SocialIcon>
            <FontAwesomeIcon icon={faEnvelope} />
          </SocialIcon>
        </SocialIcons>
        <ContactSection>
          <ContactTitle>Please Feel Free To Reach Out To Either Of Us If You Have Any Questions</ContactTitle>
          <ContactDetails>
            <ContactPerson>
              <ContactName>Rebecca</ContactName>
              <ContactPhone href="tel:07984748539">07984 748539</ContactPhone>
            </ContactPerson>
            <ContactPerson>
              <ContactName>James</ContactName>
              <ContactPhone href="tel:07496308150">07496 308150</ContactPhone>
            </ContactPerson>
          </ContactDetails>
        </ContactSection>
      </Footer>
    </>
  )
}
