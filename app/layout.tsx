import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Tablica Pocetnici U-9",
  description: "Tablica nogometne lige za pocetnike U-9",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hr" className="bg-background">
      <body className="antialiased font-sans">{children}</body>
    </html>
  )
}
