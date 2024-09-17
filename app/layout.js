import "./globals.css";
import { Lato } from "next/font/google";
import { Providers } from "./providers";
import Header from "./frontend/components/header";
import { Suspense } from "react";
import Loading from "@/loading";

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: "Game Keli - Juara RM10,000 & 200 Rank",
  description: "Jom Sertai Pertandingan Memancing Keli di Kolam Pancing Paklong Mat Sen, Semanggol Perak.",
  openGraph: {
    images: [
      {
        url: 'https://admin.paklongmatsen.com/images/kolam-pancing-paklong-mat-sen.png', // Use full URL
        width: 1200, // Recommended width
        height: 630, // Recommended height for Open Graph
        alt: 'Kolam Pancing Paklong Mat Sen',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <Providers font={lato}>
          <Header />
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
