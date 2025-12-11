import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";

export const metadata: Metadata = {
  title: "Sbzee",
  description:
    "Order fresh vegetables and fruits online with Sbzee. Enjoy farm-fresh quality, quick grocery home delivery, and trusted vegetable delivery near you.",
  metadataBase: new URL("https://sbzee.com"),
  alternates: { canonical: "https://sbzee.com" },
  keywords:
    "vegetables online, order vegetables online, fresh vegetables online, buy vegetables online, fresh vegetables, vegetable delivery, grocery home delivery near me, fruit shop near me, vegetable delivery near me",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Sbzee Fuels Life — Daily Power of Fruits & Vegetables",
    description:
      "Explore how fresh fruits and vegetables power energy, immunity, focus and joy—plus seasonal guides, FAQs, and sustainable choices.",
    type: "website",
    url: "https://sbzee.com",
    images: [
      {
        url: "/assets/img/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sbzee Fuels Life",
      },
    ],
  },
  robots: { index: true, follow: true },
  twitter: {
    card: "summary_large_image",
    title: "Sbzee Fuels Life — Daily Power of Fruits & Vegetables",
    description:
      "Why Sbzee matters in daily life: energy, immunity, mental focus, sustainability, and seasonal eating.",
    images: ["/assets/img/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="alternate" type="application/rss+xml" title="AssuredPay" />
        {/* Google Analytics */}
        {/* <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-6WFCMMZR1H"
        /> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);} 
              gtag('js', new Date());
              gtag('config', 'G-6WFCMMZR1H');
            `,
          }}
        />
        {/* JSON-LD structured data for SEO */}
        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sbzee.com/#organization",
      "name": "Sbzee",
      "url": "https://sbzee.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sbzee.com/assets/img/LogoGreen.png",
        "width": 600,
        "height": 60
      },
      "sameAs": [
        "https://www.instagram.com/Sbzee",
        "https://www.linkedin.com/company/Sbzee"
      ],
      "description": "Order fresh vegetables and fruits online with Sbzee. Enjoy farm-fresh quality, quick grocery home delivery, and trusted vegetable delivery near you."
    },
    {
      "@type": "WebSite",
      "@id": "https://sbzee.com/#website",
      "url": "https://sbzee.com/",
      "name": "Sbzee",
      "publisher": {
        "@id": "https://sbzee.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sbzee.com/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://sbzee.com/#webpage",
      "url": "https://sbzee.com/",
      "name": "Sbzee - Order Fresh Fruits & Vegetables Online",
      "isPartOf": {
        "@id": "https://sbzee.com/#website"
      },
      "about": {
        "@id": "https://sbzee.com/#organization"
      },
      "description": "Order fresh vegetables and fruits online with Sbzee. Enjoy farm-fresh quality, quick grocery home delivery, and trusted vegetable delivery near you.",
      "inLanguage": "en"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://sbzee.com/#localbusiness",
      "name": "Sbzee",
      "image": "https://sbzee.com/assets/img/LogoGreen.png",
      "url": "https://sbzee.com/",
      "telephone": "+919266339912",
      "priceRange": "₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sector 62",
        "addressLocality": "Noida",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "201309",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.6139,
        "longitude": 77.2090
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "23:00"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/Sbzee",
        "https://www.linkedin.com/company/Sbzee"
      ],
      "description": "Sbzee offers online delivery of fresh vegetables, fruits, and groceries. Experience farm-fresh quality and fast doorstep delivery every day."
    }
  ]
}
            `,
          }}
        /> */}
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <Header />
          <main>{children}</main>
          {/* <Footer /> */}
          <BackToTop />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
