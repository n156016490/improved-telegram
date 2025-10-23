import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { PackReservationsProvider } from "@/contexts/pack-reservations";

const poppins = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-geist-alt",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LOUAAB – On loue, on joue !",
  description:
    "LOUAAB est le premier service marocain de location de jouets et jeux de société : découvrez, jouez, échangez sans vous encombrer.",
  metadataBase: new URL("https://louaab.ma"),
  keywords: [
    "location jouets Maroc",
    "location jeux de société",
    "abonnement jouets",
    "LOUAAB",
  ],
  openGraph: {
    title: "LOUAAB – On loue, on joue !",
    description:
      "Accédez à des jouets propres, sûrs et responsables. Packs mensuels, livraison et retour inclus à Casablanca et Rabat.",
    locale: "fr_MA",
    type: "website",
    url: "https://louaab.ma",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-soft-white text-charcoal ${poppins.variable} ${nunito.variable}`}
      >
        <CartProvider>
          <FavoritesProvider>
            <PackReservationsProvider>
              {children}
            </PackReservationsProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
