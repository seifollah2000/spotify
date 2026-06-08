import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Provider from "@/components/Provider"
import Sidebar from "@/components/Sidebar"
import Player from "@/components/Player"
import AuthModal from "@/components/AuthModal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "A Spotify clone built with Next.js",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="h-screen flex flex-col bg-black">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-spotify-black pb-24">
                {children}
              </main>
            </div>
            <Player />
          </div>
          <AuthModal />
        </Provider>
      </body>
    </html>
  )
}
