import ProductCard from "./ProductCard";

export default function Bestsellers({ products = [] }) {
 return (
  <section className="py-24 bg-rein-black">
   <div className="max-w-7xl mx-auto px-6">
    {/* Section Header */}
    <div className="flex flex-col md:flex-row items-baseline justify-between mb-16">
     <h2 className="font-display text-4xl md:text-5xl text-rein-cream">
      Our Bestsellers
     </h2>
     {/* Optional link to a full shop page if you build one later */}
     <a
      href="/shop"
      className="hidden md:inline-block text-rein-gold-primary border-b border-rein-gold-primary pb-1 uppercase tracking-widest text-sm hover:text-rein-cream hover:border-rein-cream transition-colors mt-4 md:mt-0"
     >
      View Entire Collection
     </a>
    </div>

    {/* Dynamic Database Grid */}
    {products.length === 0 ? (
     <div className="text-center text-rein-gray-light py-10 border border-rein-gold-dim/20">
      Discovering favorites...
     </div>
    ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
      {products.map((product) => (
       <ProductCard key={product._id} product={product} />
      ))}
     </div>
    )}
   </div>
  </section>
 );
}
