'use client'

import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  body {
    max-width: 100vw;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    color: rgb(var(--foreground-rgb));
    background: linear-gradient(
        to bottom,
        transparent,
        rgb(var(--background-end-rgb))
      )
      rgb(var(--background-start-rgb));
    -webkit-overflow-scrolling: touch;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @media (prefers-color-scheme: dark) {
    html {
      color-scheme: dark;
    }
  }
`

export default GlobalStyle