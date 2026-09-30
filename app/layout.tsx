import type { Metadata } from "next"
import { Cormorant_Garamond, Outfit } from "next/font/google"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"
import { site } from "@/lib/site"
import "./globals.css"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
})

const sans = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:bg-ivory focus:px-4 focus:py-2"
        >
          Aller au contenu
        </a>
        <Providers>{children}</Providers>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#f7f3ec",
              color: "#141311",
              border: "1px solid #e3dcd2",
              borderRadius: 0,
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  )
}
