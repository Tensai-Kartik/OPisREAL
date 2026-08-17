import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "OP is Real — One Piece Character Guessing Game",
  description: "Test your anime & manga knowledge! Guess the secret One Piece character with tactical clues, bounties, devil fruits, haki, and storyline debut arcs.",
  metadataBase: new URL("https://op-is-real.vercel.app"),
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/logo.png",
      },
    ],
  },
  openGraph: {
    title: "OP is Real — One Piece Character Guessing Game",
    description: "Test your anime & manga knowledge! Guess the secret One Piece character.",
    url: "https://op-is-real.vercel.app",
    siteName: "OP is Real",
    images: [
      {
        url: "/logo_bg.png",
        width: 512,
        height: 512,
        alt: "OP is Real Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OP is Real — One Piece Character Guessing Game",
    description: "Test your anime & manga knowledge! Guess the secret One Piece character.",
    images: ["/logo_bg.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
