import type { Metadata } from "next";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://banbooz.github.io/RushDish/";
const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const metadataBase = new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`);
const socialImage = new URL(`${publicBasePath}/og-blue-carnival.png`, metadataBase).toString();
const brandMark = `${publicBasePath}/rushdish-mark-final.png`;

export const metadata: Metadata = {
  metadataBase,
  title: "RushDish — QR ordering built for the rush",
  description:
    "QR ordering for food trucks, festivals and event kitchens. Guests scan, order and pay; crews run service from one clear live queue.",
  icons: {
    icon: [{ url: brandMark, type: "image/png" }],
    apple: brandMark,
  },
  openGraph: {
    title: "Feed the crowd. Lose the queue.",
    description: "QR ordering for food trucks, festivals and event kitchens.",
    type: "website",
    url: metadataBase,
    images: [{ url: socialImage, width: 1734, height: 908, alt: "RushDish QR ordering for food trucks" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feed the crowd. Lose the queue.",
    description: "QR ordering for food trucks, festivals and event kitchens.",
    images: [socialImage],
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
        {children}
      </body>
    </html>
  );
}
