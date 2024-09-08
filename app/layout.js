import "./globals.css";
import { Lato } from "next/font/google";
import { Providers } from "./providers";
import Header from "./frontend/components/header";

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
  display: 'swap'
})

export const metadata = {
  title: "Mat Sen Kolam Pancing",
  description: "Kolam Pancing Mat Sen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <Providers font={lato}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
