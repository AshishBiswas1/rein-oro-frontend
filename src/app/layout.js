import { Cormorant_Garamond, Jost, Cinzel } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

// Define the Google Fonts
const cormorant = Cormorant_Garamond({
 subsets: ["latin"],
 weight: ["300", "400", "600", "700"],
 style: ["normal", "italic"],
 variable: "--font-cormorant",
});

const jost = Jost({
 subsets: ["latin"],
 weight: ["300", "400", "500", "600"],
 variable: "--font-jost",
});

const cinzel = Cinzel({
 subsets: ["latin"],
 weight: ["400", "600"],
 variable: "--font-cinzel",
});

// SEO Metadata
export const metadata = {
 title: "Rein Oro | Premium Dry Fruits & Makhana",
 description: "Purity Crowned in Gold. Crafted for the Discerning.",
};

// Root Layout
export default function RootLayout({ children }) {
 return (
  <html
   lang="en"
   className={`${cormorant.variable} ${jost.variable} ${cinzel.variable}`}
   data-scroll-behavior="smooth"
   suppressHydrationWarning
  >
   <body
    className="bg-rein-black text-rein-cream font-ui antialiased selection:bg-rein-gold-primary selection:text-rein-black relative min-h-screen overflow-x-hidden"
    suppressHydrationWarning
   >
    {/* Ambient Overhead Glow */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-rein-gold-primary/5 rounded-full blur-[140px] pointer-events-none z-0" />

    {/* Luxury Noise Overlay */}
    <div className="fixed inset-0 bg-luxury-grain pointer-events-none z-50 mix-blend-overlay" />

    {/* Handles conditional Navbar rendering */}
    <LayoutWrapper>{children}</LayoutWrapper>
   </body>
  </html>
 );
}
