import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Rebecca and James",
  description: "A beautiful Next.js app with Styled Components and Prisma",
  icons: {
    icon: '/sunflower.png',
    shortcut: '/sunflower.png',
    apple: '/sunflower.png',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
