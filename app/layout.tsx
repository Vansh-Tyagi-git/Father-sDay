import '../styles/globals.css'
import React from 'react'
import Navbar from '../components/Navbar'

export const metadata = {
  title: "Father's Day — Story",
  description: 'A cinematic scrollytelling tribute',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
