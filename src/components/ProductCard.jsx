"use client";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
 // 1. Safely extract the price from the new variants array
 const basePrice =
  product.variants && product.variants.length > 0
   ? product.variants[0].price
   : product.price || 0; // Fallback just in case older products don't have variants yet

 const formattedPrice = basePrice.toFixed(2);

 return (
  <div className="group flex h-full flex-col bg-rein-charcoal border border-rein-gold-primary/10 rounded-lg sm:rounded-sm p-3 sm:p-4 hover:border-rein-gold-primary/30 transition-all duration-300">
   {/* Using slug if available, falling back to ID for safety */}
   <Link
    href={`/products/${product.slug || product.id || product._id}`}
    className="block h-full cursor-pointer"
    suppressHydrationWarning
   >
    <div className="relative aspect-[4/5] sm:aspect-square w-full mb-3 sm:mb-4 bg-rein-surface rounded-md sm:rounded-sm overflow-hidden flex items-center justify-center">
     <Image
      src={product.images?.[0] || "/placeholder.jpg"}
      alt={product.name || "Product"}
      fill
      sizes="(max-width: 768px) 100vw, 250px"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      suppressHydrationWarning
     />
    </div>

    <div className="space-y-1.5 sm:space-y-2">
     <h3 className="font-display italic text-base sm:text-lg leading-snug text-rein-cream group-hover:text-rein-gold-light transition-colors line-clamp-1">
      {product.name}
     </h3>
     <p className="font-accent text-rein-gold-primary text-sm sm:text-md">
      ₹{formattedPrice}
     </p>
    </div>
   </Link>
  </div>
 );
}
