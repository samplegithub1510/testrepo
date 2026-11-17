import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@/content";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: `${profile.name} | Forward Deployed Engineer`,
  description: profile.valueStatement,
  openGraph: {
    title: `${profile.name} | Forward Deployed Engineer`,
    description: profile.valueStatement,
    images: ["/og.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#060a13",
  width: "device-width",
  initialScale: 1,
};

// Sets the theme before first paint so there is no flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
