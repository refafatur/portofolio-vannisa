import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import Script from "next/script";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'devicon/devicon.min.css';
import "./globals.css";
import Navbar from "./components/Navbar";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://refafatur-portofolio.vercel.app/"),
  title: "Vannisa Maulvi - Portfolio",
  description:
    "Vannisa Maulvi - Data Analyst & Front-End Developer. Specializing in web development, data analysis, and modern UI/UX design.",
  keywords:
    "data analyst, front-end developer, web developer, Python, MySQL, HTML, CSS, JavaScript, Laravel",
  authors: [{ name: "Vannisa Maulvi" }],
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "wdm9pYDstzsO5PjU73Rqq6ayfjQSb8T4djpu5_tqOvs",
  },
  alternates: {
    canonical: "https://refafatur-portofolio.vercel.app/",
  },
  openGraph: {
    title: "Vannisa Maulvi - Portfolio",
    description: "Data Analyst & Front-End Developer specializing in data-driven web applications.",
    url: "https://refafatur-portofolio.vercel.app/",
    type: "website",
    images: [
      {
        url: "/image/me3.jpeg", // Path gambar di folder public
        width: 1200,                // Standar lebar OG Image
        height: 630,                // Standar tinggi OG Image
        alt: "Vannisa Maulvi Portfolio",
      },
    ],
  },
  icons: {
    icon: "/image/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Perbaikan: Melengkapi struktur jsonLd yang tadi terpotong
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Vannisa Maulvi Portfolio",
      "alternateName": "Vannisa Maulvi",
      "url": "https://refafatur-portofolio.vercel.app/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://refafatur-portofolio.vercel.app/?s={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Vannisa Maulvi",
      "jobTitle": "Data Analyst & Front-End Developer",
      "url": "https://refafatur-portofolio.vercel.app/",
      "sameAs": [
        "https://www.instagram.com/vannisamaulvi/",
        "https://github.com/vannisamaulvi",
        "https://www.linkedin.com/in/vannisa-maulvi/"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "Home",
      "url": "https://refafatur-portofolio.vercel.app/"
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "About",
      "url": "https://refafatur-portofolio.vercel.app/about"
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "Project",
      "url": "https://refafatur-portofolio.vercel.app/project"
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "Contact",
      "url": "https://refafatur-portofolio.vercel.app/contact"
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "Certificates",
      "url": "https://refafatur-portofolio.vercel.app/certificates"
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      "name": "Gallery",
      "url": "https://refafatur-portofolio.vercel.app/gallery"
    }
  ];

  return (
    <html lang="id" data-theme="light">
      <head>
        {/* <link rel="stylesheet" href="https://cloudflare.com" /> */}
        {/* <link rel="stylesheet" href="https://jsdelivr.net" /> */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={quicksand.variable}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
