import type React from "react"
import type { Metadata, Viewport } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

// Optimized font loading
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

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

// Critical CSS to prevent render blocking
const criticalCSS = `
*,::before,::after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}
html{line-height:1.5;-webkit-text-size-adjust:100%}
body{margin:0;line-height:inherit;background:#000;color:#fff;font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace}
.min-h-screen{min-height:100vh}
.bg-black{background-color:#000}
.text-white{color:#fff}
.font-mono{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,"SF Mono",Consolas,"Liberation Mono",Menlo,monospace}
.relative{position:relative}
.overflow-x-hidden{overflow-x:hidden}
.border-b{border-bottom-width:1px}
.border-purple-500\\/30{border-color:rgba(168,85,247,0.3)}
.p-4{padding:1rem}
.backdrop-blur-sm{backdrop-filter:blur(4px)}
.bg-black\\/80{background-color:rgba(0,0,0,0.8)}
.z-20{z-index:20}
.flex{display:flex}
.items-center{align-items:center}
.justify-between{justify-content:space-between}
.gap-2{gap:0.5rem}
.gap-6{gap:1.5rem}
.text-xl{font-size:1.25rem;line-height:1.75rem}
.text-lg{font-size:1.125rem;line-height:1.75rem}
.font-bold{font-weight:700}
.text-purple-400{color:#c084fc}
.max-w-4xl{max-width:56rem}
.mx-auto{margin-left:auto;margin-right:auto}
.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
.hover\\:text-purple-400:hover{color:#c084fc}
.hidden{display:none}
.md\\:flex{display:none}
@media (min-width:768px){.md\\:flex{display:flex}}
@media (min-width:768px){.md\\:hidden{display:none}}
.opacity-0{opacity:0}
.opacity-100{opacity:1}
.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4,0,0.2,1);transition-duration:150ms}
.duration-300{transition-duration:300ms}
.grid{display:grid}
.lg\\:grid-cols-2{grid-template-columns:repeat(1,minmax(0,1fr))}
@media (min-width:1024px){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
.space-y-4>:not([hidden])~:not([hidden]){margin-top:1rem}
.space-y-6>:not([hidden])~:not([hidden]){margin-top:1.5rem}
.py-8{padding-top:2rem;padding-bottom:2rem}
.py-12{padding-top:3rem;padding-bottom:3rem}
.sr-only{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip:rect(0,0,0,0)!important;white-space:nowrap!important;border:0!important}
.focus\\:not-sr-only:focus{position:static!important;width:auto!important;height:auto!important;padding:inherit!important;margin:inherit!important;overflow:visible!important;clip:auto!important;white-space:normal!important}
.focus\\:absolute:focus{position:absolute}
.focus\\:top-4:focus{top:1rem}
.focus\\:left-4:focus{left:1rem}
.bg-purple-600{background-color:#9333ea}
.text-purple-300{color:#d8b4fe}
.rounded{border-radius:0.25rem}
.z-50{z-index:50}
.px-4{padding-left:1rem;padding-right:1rem}
.py-2{padding-top:0.5rem;padding-bottom:0.5rem}
`;

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
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
  authors: [{ name: 'Luke Johnson', url: 'https://rikjimue.com' }],
  creator: 'Luke Johnson',
  publisher: 'Luke Johnson',
  robots: 'index, follow',
  
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
  
  alternates: {
    canonical: 'https://rikjimue.com',
    types: {
      'application/rss+xml': [
        { url: '/rss.xml', title: 'Luke Johnson - Security Research Blog RSS Feed' }
      ]
    }
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Critical CSS to prevent render blocking */}
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        
        {/* Load main CSS normally */}
        <link rel="stylesheet" href="/_next/static/css/app/globals.css" />
        
        {/* Optimized font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        
        {/* RSS feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Luke Johnson - Security Research Blog"
          href="/rss.xml"
        />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={jetbrainsMono.className}>
        {/* Skip to main content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded z-50"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
