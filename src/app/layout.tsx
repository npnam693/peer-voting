import './globals.css'
import type { Metadata } from 'next'
import Nav from '../components/Nav'
import { AuthProvider } from '@/context/appContext'

export const metadata: Metadata = {
  title: 'PeerVoting',
  description: 'Empowering Consensus with Blockchain Voting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="./favicon.ico" sizes="any" />
      </head>
      <body>
          <AuthProvider>
          <main className='app'>
            <Nav />
            {children}
          </main>
          </AuthProvider>
          <div className="gradient" />
      </body>
    </html>
  )
}
