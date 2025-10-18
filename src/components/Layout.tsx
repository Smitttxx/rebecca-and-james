'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faCamera, faEnvelope } from '@fortawesome/free-solid-svg-icons'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.neutral.cream} 0%, ${theme.colors.primary.sageLight} 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '🌻';
    position: absolute;
    top: 15%;
    left: 5%;
    font-size: 4rem;
    opacity: 0.08;
    z-index: 1;
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      font-size: 6rem;
      top: 12%;
      left: 3%;
    }
    
    @media (min-width: ${theme.breakpoints.desktop}) {
      font-size: 8rem;
      top: 10%;
      left: 2%;
    }
  }
  
  &::after {
    content: '🌻';
    position: absolute;
    bottom: 20%;
    right: 8%;
    font-size: 3rem;
    opacity: 0.06;
    z-index: 1;
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      font-size: 5rem;
      bottom: 15%;
      right: 5%;
    }
    
    @media (min-width: ${theme.breakpoints.desktop}) {
      font-size: 7rem;
      bottom: 12%;
      right: 3%;
    }
  }
`

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  position: relative;
  z-index: 10;
  background: linear-gradient(135deg, ${theme.colors.primary.sageDark}, ${theme.colors.primary.sage});
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

const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing.md};
  
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

const MainContent = styled.main`
  padding: ${theme.spacing.md};
  max-width: 100%;
  margin: 0 auto;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
    max-width: 1200px;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    padding: ${theme.spacing.xl};
    max-width: 1400px;
  }
`

const SunflowerDecoration = styled.div`
  position: absolute;
  top: 5%;
  right: 5%;
  width: 40px;
  height: 40px;
  background: ${theme.colors.accent.sunflower};
  border-radius: ${theme.borderRadius.full};
  opacity: 0.1;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    top: 8%;
    right: 8%;
    width: 60px;
    height: 60px;
  }
  
  svg {
    font-size: 1.2rem;
    color: ${theme.colors.accent.sunflowerDark};
    
    @media (min-width: ${theme.breakpoints.tablet}) {
      font-size: 1.8rem;
    }
  }
`

const BackgroundSunflower = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  opacity: 0.04;
  z-index: 1;
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
  
  @media (min-width: ${theme.breakpoints.desktop}) {
    font-size: 4rem;
  }
`

const Footer = styled.footer`
  background: linear-gradient(135deg, ${theme.colors.secondary.gold}, ${theme.colors.secondary.goldLight});
  color: ${theme.colors.neutral.white};
  text-align: center;
  padding: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
  width: 100%;
  
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
  color: ${theme.colors.secondary.gold};
  font-size: 1.2rem;
  box-shadow: ${theme.shadows.sm};
  
  &:hover {
    transform: scale(1.1);
    background: ${theme.colors.primary.sageDark};
    color: ${theme.colors.neutral.white};
  }
`

interface LayoutProps {
  children: React.ReactNode
  activePage?: string
}

export default function Layout({ children, activePage }: LayoutProps) {
  return (
    <>
      <Container>
        <SunflowerDecoration>
          <FontAwesomeIcon icon={faSun} />
        </SunflowerDecoration>
        
        <BackgroundSunflower>🌻</BackgroundSunflower>
        
        <Header>
          <Logo href="/">R & J</Logo>
        <Nav>
          <NavLink href="/" className={activePage === 'home' ? 'active' : ''}>Home</NavLink>
          <NavLink href="/rsvp" className={activePage === 'rsvp' ? 'active' : ''}>RSVP</NavLink>
          <NavLink href="/admin/admin-12345-67890-abcdef" className={activePage === 'admin' ? 'active' : ''}>Admin</NavLink>
        </Nav>
        </Header>

        <MainContent>
          {children}
        </MainContent>
      </Container>

      <Footer>
        <FooterTitle>Rebecca & James</FooterTitle>
        <FooterText>October 15th, 2024 • Willow Creek Gardens</FooterText>
        <SocialIcons>
          <SocialIcon>
            <FontAwesomeIcon icon={faCamera} />
          </SocialIcon>
          <SocialIcon>
            <FontAwesomeIcon icon={faEnvelope} />
          </SocialIcon>
        </SocialIcons>
      </Footer>
    </>
  )
}
