import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { Providers } from "@/components/providers"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: oklch(0.68 0.18 145);
              --ring: oklch(0.68 0.18 145);
              --sidebar-primary: oklch(0.68 0.18 145);
              --sidebar-ring: oklch(0.68 0.18 145);
            }
            .dark {
              --primary: oklch(0.68 0.18 145);
              --ring: oklch(0.68 0.18 145);
              --sidebar-primary: oklch(0.68 0.18 145);
              --sidebar-ring: oklch(0.68 0.18 145);
            }
          `
        }} />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} h-full font-sans antialiased touch-manipulation`}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
