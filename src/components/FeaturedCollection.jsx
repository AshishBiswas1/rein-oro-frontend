import ProductCard from "./ProductCard";

export default function FeaturedCollection({ products = [] }) {
 // Grab only the first 3 products to keep the featured grid balanced
 const featuredProducts = products.slice(0, 3);

 return (
  <section className="py-20 sm:py-24 bg-rein-charcoal border-y border-rein-gold-dim/20">
   <div className="max-w-7xl mx-auto px-4 sm:px-6">
    {/* Section Header */}
    <div className="text-center mb-10 sm:mb-16">
     <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-rein-cream mb-4">
      Curated Selections
     </h2>
     <p className="text-rein-gold-primary tracking-widest uppercase text-[11px] sm:text-sm font-semibold">
      Experience the Pinnacle of Taste
     </p>
    </div>

    {/* Dynamic Database Grid */}
    {featuredProducts.length === 0 ? (
     <div className="text-center text-rein-gray-light py-8 sm:py-10 border border-rein-gold-dim/20">
      Inventory updating...
     </div>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {featuredProducts.map((product) => (
       <ProductCard key={product._id} product={product} />
      ))}
     </div>
    )}
   </div>
  </section>
 );
}
