import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://bandurai.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bandura - The operating system for winning complex deals",
    template: "%s | Bandura",
  },
  description: "Increase your win rates. Reduce your cost per bid. Improve your ability to predict and qualify bids. Automate capture planning 6-9 months before ITT.",
  keywords: ["capture planning", "bid management", "win probability", "competitor intelligence", "pre-sales", "ITT", "public sector contracts"],
  authors: [{ name: "Bandura" }],
  creator: "Bandura",
  publisher: "Bandura",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/icons/icon-32.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Bandura",
    title: "Bandura - The operating system for winning complex deals",
    description: "Increase your win rates. Reduce your cost per bid. Improve your ability to predict and qualify bids.",
    images: [
      {
        url: `${siteUrl}/thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "Bandura - The operating system for winning complex deals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bandura - The operating system for winning complex deals",
    description: "Increase your win rates. Reduce your cost per bid. Improve your ability to predict and qualify bids.",
    images: [`${siteUrl}/thumbnail.png`],
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
  verification: {
    google: "z7ory3era40PQXSTt3mYZpnCLIMil5xDx8WzFCu_PJE",
  },
  alternates: {
    canonical: siteUrl,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bandura",
  url: siteUrl,
  logo: `${siteUrl}/favicon.ico`,
  description: "The operating system for winning complex deals",
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@bandurai.com",
    contactType: "Customer Service",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bandura",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: "Automate capture planning 6-9 months before ITT. Win probability analysis, competitor matrices, and full capture plans.",
  url: siteUrl,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FYW11TTBYZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FYW11TTBYZ');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
        {children}
      </body>
    </html>
  );
}
