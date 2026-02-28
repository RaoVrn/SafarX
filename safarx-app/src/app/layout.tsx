import type { Metadata } from "next"
import type { Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "SafarX - Map your journey. Preserve your memories.",
  description: "The premium travel companion that transforms how you capture, organize, and relive every adventure. Built for the modern explorer.",
  keywords: "travel, journey, memories, mapping, adventure, travel companion, premium travel app",
  authors: [{ name: "SafarX Team" }],
  creator: "SafarX",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://safarx.com",
    title: "SafarX - Map your journey. Preserve your memories.",
    description: "The premium travel companion that transforms how you capture, organize, and relive every adventure.",
    siteName: "SafarX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SafarX - Premium Travel Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SafarX - Map your journey. Preserve your memories.",
    description: "The premium travel companion that transforms how you capture, organize, and relive every adventure.",
    images: ["/og-image.jpg"],
    creator: "@safarx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-black text-white antialiased overflow-x-hidden selection:bg-violet-500/20 selection:text-white">
        <div className="min-h-screen bg-black">
          {children}
        </div>
      </body>
    </html>
  )
}