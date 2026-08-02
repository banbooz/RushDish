import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");
  const protocol = forwardedProtocol ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "RushDish — QR ordering built for the rush",
    description:
      "QR ordering for food trucks, festivals and event kitchens. Guests scan, order and pay; crews run service from one clear live queue.",
    openGraph: {
      title: "Feed the crowd. Lose the queue.",
      description: "QR ordering for food trucks, festivals and event kitchens.",
      type: "website",
      images: [{ url: socialImage, width: 1734, height: 907, alt: "RushDish QR ordering for food trucks" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Feed the crowd. Lose the queue.",
      description: "QR ordering for food trucks, festivals and event kitchens.",
      images: [socialImage],
    },
  };
}

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
