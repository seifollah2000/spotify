import type { Metadata } from "next"
import { Inter, Vazirmatn } from "next/font/google"
// @ts-ignore
import "./globals.css"
import Provider from "@/components/Provider"
import Sidebar from "@/components/Sidebar"
import Player from "@/components/Player"
import AuthModal from "@/components/AuthModal"
import { LangProvider } from "@/lib/lang"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazir" })

export const metadata: Metadata = {
  title: "اسپاتیفای | Spotify",
  description: "سرویس پخش موسیقی",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={`${inter.variable} ${vazirmatn.variable}`}>
      <body className="font-vazir">
        <Provider>
          <LangProvider>
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
          </LangProvider>
        </Provider>
      </body>
    </html>
  )
}
