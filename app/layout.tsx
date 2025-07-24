import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Luke Johnson",
  "jobTitle": "Cybersecurity Student",
  "affiliation": "Purdue University",
  "alumniOf": "Purdue University",
  "email": "contact@rikjimue.com",
  "url": "https://rikjimue.com",
  "sameAs": [
    "https://linkedin.com/in/rikjimue",
    "https://github.com/Rikjimue"
  ]
}

export const metadata = {
  title: 'Luke Johnson - Cybersecurity Student & CTF Competitor',
  description: 'Cybersecurity student at Purdue University specializing in malware analysis, reverse engineering, and CTF competitions. Currently working as IT Security Intern at ConnectOne Bank.',
  keywords: [
    'Luke Johnson',
    'cybersecurity student', 
    'security researcher',
    'CTF competitor',
    'b01lers CTF team',
    'Purdue cybersecurity',
    'malware analysis',
    'reverse engineering',
    'penetration testing',
    'binary exploitation',
    'Python security automation',
    'IT security intern',
    'ConnectOne Bank',
    'cybersecurity portfolio',
    'security projects',
    'databreach monitoring',
    'breach radar',
    'homelab',
    'Proxmox',
    'Kali Linux',
    'Wireshark',
    'Splunk',
    'Arctic Wolf',
    'Ghidra',
    'x86 Assembly',
    'vulnerability research',
    'threat intelligence',
    'SIEM',
    'dark web reconnaissance',
    'CompTIA Security+',
    'cybersecurity internship',
    'information security',
    'web security',
    'network security',
    'digital forensics'
  ].join(', '),
  author: 'Luke Johnson',
  creator: 'Luke Johnson',
  publisher: 'Luke Johnson',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  
  openGraph: {
    title: 'Luke Johnson - Cybersecurity Student & CTF Competitor',
    description: 'Cybersecurity student at Purdue University specializing in malware analysis, reverse engineering, and CTF competitions. Portfolio showcasing security projects and research.',
    url: 'https://rikjimue.com',
    siteName: 'Luke Johnson - Cybersecurity Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://rikjimue.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luke Johnson - Cybersecurity Student Portfolio',
      },
    ],
  },

  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Luke Johnson - Cybersecurity Student & CTF Competitor',
    description: 'Cybersecurity student specializing in malware analysis, reverse engineering, and CTF competitions. Check out my security projects and research.',
    images: ['https://rikjimue.com/og-image.png'],
    creator: '@rikjimue',
  },

  other: {
    'theme-color': '#8b5cf6',
    'color-scheme': 'dark',
    'format-detection': 'telephone=no',
  },

  category: 'technology',
  contact: 'contact@rikjimue.com',
  
  alternates: {
    canonical: 'https://rikjimue.com',
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  )
}
