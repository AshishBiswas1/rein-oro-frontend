import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/firestore";

// Opt into dynamic rendering if your database updates frequently,
// or leave it standard to let Next.js heavily cache the catalog.
export const revalidate = 60; // Revalidates the cache every 60 seconds

export default async function ShopPage() {
 // 1. Server-side data fetch directly from your Firestore utility
 const products = await getProducts();

 return (
  <main className="bg-[#0A0A0A] min-h-screen flex flex-col pb-24">
   <Navbar />

   {/* Hero Header Section */}
   <header className="pt-32 sm:pt-40 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto text-center w-full relative">
    {/* Subtle background glow for depth */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-[#0A0A0A]/0 to-[#0A0A0A]/0 pointer-events-none" />

    <span className="relative text-[#C9A84C] text-[11px] tracking-[0.4em] uppercase mb-4 font-medium block">
     The Master Collection
    </span>
    <h1 className="relative font-display text-[32px] sm:text-[42px] md:text-[52px] text-[#F5EDD6] leading-tight italic">
     Curated Purity
    </h1>
    <div className="relative w-12 h-[1px] bg-[#C9A84C]/40 mt-8 mx-auto" />
    <p className="relative mt-8 max-w-2xl mx-auto text-[#9A9485] font-ui text-sm sm:text-base leading-relaxed">
     Explore our complete portfolio of hand-roasted reserves. Every batch is
     stone-ground, nitrogen-flushed, and sealed for absolute perfection.
    </p>
   </header>

   {/* Main Catalog Grid */}
   <section className="px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1">
    {products && products.length > 0 ? (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
      {products.map((product) => (
       <ProductCard key={product._id || product.id} product={product} />
      ))}
     </div>
    ) : (
     /* Defensive UI: Fallback for empty database */
     <div className="text-center py-24 text-[#9A9485] font-ui border border-[#C9A84C]/10 bg-[#0E0E0E] rounded-sm max-w-2xl mx-auto shadow-2xl">
      <p className="tracking-wide uppercase text-xs">
       The vault is currently being restocked.
      </p>
      <p className="mt-2 text-[11px] opacity-60">
       Check back soon for our next artisanal batch.
      </p>
     </div>
    )}
   </section>
  </main>
 );
}
