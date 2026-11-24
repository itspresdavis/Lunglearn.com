import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-sans" });
const serif = Source_Serif_4({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://lunglearn.com"),
  title: { default: "Lung Learn", template: "%s · Lung Learn" },
  description: "The home of respiratory education. Learn anatomy. Understand disease. Master respiratory care.",
  openGraph: {
    title: "Lung Learn",
    description: "Learn anatomy. Understand disease. Master respiratory care.",
    siteName: "Lung Learn",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
