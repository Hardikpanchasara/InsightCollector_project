import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insight Collector - Collect Messages Easily",
  description: "Send your account link, receive messages, and manage them on your dashboard seamlessly.",
  keywords: "message dashboard, personal messaging platform, account link messages, user message display",
  openGraph: {
    title: "Insight Collector - Simplify Message Management",
    description: "A platform where users can send their account links, collect messages, and manage them easily.",
    url: "https://insight-collector.vercel.app",
    type: "website",
    images: {
      url: "/people.jpg", // Replace with the actual path to your image
      width: 1200,
      height: 630,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preloading Fonts */}
        {/* <link
          rel="preload"
          href="/path-to-font.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        /> */}
        {/* Favicon */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-icon.png" /> */}
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Insight Collector",
              url: "https://insight-collector.vercel.app",
              description:
                "A platform to share your account link, connect with others, and display their messages on your dashboard.",
              applicationCategory: "Communication",
              operatingSystem: "All",
              inLanguage: "en",
              author: {
                "@type": "Organization",
                name: "Insight Collector Messaging",
              },
            }),
          }}
        />
        {/* Canonical Link */}
        <link rel="canonical" href="https://insight-collector.vercel.app" />
      </head>
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
