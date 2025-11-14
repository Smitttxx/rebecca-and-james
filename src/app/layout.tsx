import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";
import GlobalStyle from "@/styles/GlobalStyle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Rebecca and James",
  description: "A beautiful Next.js app with Styled Components and Prisma",
  icons: {
    icon: '/sunflower.png',
    shortcut: '/sunflower.png',
    apple: '/sunflower.png',
  },
  other: {
    'font-preconnect': 'https://fonts.googleapis.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
