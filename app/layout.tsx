import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luke Johnson - Security Researcher",
  description:
    "Personal portfolio and blog of Alex Thompson, a security researcher specializing in penetration testing and vulnerability research.",
  keywords: [
    "security researcher",
    "penetration testing",
    "cybersecurity",
    "ethical hacking",
    "vulnerability research",
  ],
    generator: 'v0.dev'
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
