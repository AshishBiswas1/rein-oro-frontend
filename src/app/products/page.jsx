import { getProducts } from "@/lib/firestore";
import ProductCard from "@/components/ProductCard";

// 1. ADD THIS LINE: Forces Next.js to fetch fresh data on every page load
export const dynamic = "force-dynamic";

export default async function ShopPage() {
 const products = await getProducts();

 return (
  <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6">
   {/* 1. Refined Header with Golden Accent */}
   <header className="max-w-7xl mx-auto mb-14 sm:mb-20 text-center relative">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C9A84C]/10 via-[#0A0A0A]/0 to-[#0A0A0A]/0 -z-10" />
    <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] mb-6 block">
     THE ARTISAN COLLECTION
    </span>
    <h1 className="font-display text-[clamp(36px,8vw,72px)] leading-[1.1] mb-6 sm:mb-8">
     Purity <span className="italic text-[#E8C97A]">Crowned in Gold</span>
    </h1>
    <p className="text-[#9A9485] max-w-xl mx-auto text-base sm:text-lg leading-relaxed font-ui font-light">
     Experience the zenith of artisanal roasting. Sustainably sourced from
     Bihar’s wetlands, meticulously curated for the discerning palate.
    </p>
   </header>

   {/* 2. Simple Filter Strip (Visual only for now) */}
   <div className="max-w-7xl mx-auto mb-10 sm:mb-12 flex flex-wrap justify-center gap-4 sm:gap-8 border-t border-b border-[#1C1A16] py-5 sm:py-6">
    {["All", "Flavored", "Plain", "Premium"].map((cat) => (
     <button
      key={cat}
      className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-[#9A9485] hover:text-[#C9A84C] transition-colors"
     >
      {cat}
     </button>
    ))}
   </div>

   {/* 3. Product Grid with Staggered Visual Interest */}
   <section className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
     {products.map((product) => (
      <div
       key={product.id || product._id} // Fixed to support Firestore's standard .id
       className="group h-full transition-transform duration-500 hover:-translate-y-2"
      >
       <ProductCard product={product} />
      </div>
     ))}
    </div>
   </section>

   {/* 4. Luxury Footer Teaser */}
   <div className="mt-20 sm:mt-32 max-w-7xl mx-auto text-center border-t border-[#1C1A16] pt-12 sm:pt-16">
    <h3 className="font-display text-xl sm:text-2xl mb-4">
     Quality without compromise.
    </h3>
    <p className="text-[#9A9485] text-xs sm:text-sm">
     Certified Grade A | Hand-sorted | Delivered with Care
    </p>
   </div>
  </main>
 );
}
