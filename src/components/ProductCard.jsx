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
  <div className="group bg-[#0E0E0E] border border-[#C9A84C]/10 rounded-sm p-4 hover:border-[#C9A84C]/30 transition-all duration-300">
   {/* Using slug if available, falling back to ID for safety */}
   <Link
    href={`/products/${product.slug || product.id || product._id}`}
    className="block cursor-pointer"
    suppressHydrationWarning
   >
    <div className="relative aspect-square w-full mb-4 bg-[#1C1A16] rounded-sm overflow-hidden flex items-center justify-center">
     <Image
      src={product.images?.[0] || "/placeholder.jpg"}
      alt={product.name || "Product"}
      fill
      sizes="(max-width: 768px) 100vw, 250px"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      suppressHydrationWarning
     />
    </div>

    <div className="space-y-2">
     <h3 className="font-display italic text-lg text-[#F5EDD6] group-hover:text-[#E8C97A] transition-colors line-clamp-1">
      {product.name}
     </h3>
     <p className="font-accent text-[#C9A84C] text-md">₹{formattedPrice}</p>
    </div>
   </Link>
  </div>
 );
}
