"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Eye } from "phosphor-react";
import { useCartStore } from "../store/useCartStore"; // Imported global cart state

gsap.registerPlugin(ScrollTrigger);

const products = [
 {
  id: 1,
  name: "Peri Peri Makhana",
  weight: "250g",
  price: 249,
  rating: 5,
  reviews: 124,
  badge: "BESTSELLER",
 },
 {
  id: 2,
  name: "Himalayan Salt & Pepper",
  weight: "250g",
  price: 229,
  rating: 4.8,
  reviews: 89,
 },
 {
  id: 3,
  name: "Truffle & Parmesan",
  weight: "100g",
  price: 349,
  rating: 5,
  reviews: 42,
  badge: "NEW",
 },
 {
  id: 4,
  name: "Classic Roasted",
  weight: "500g",
  price: 449,
  rating: 4.9,
  reviews: 210,
 },
];

export default function FeaturedCollection() {
 // Hook up the addItem function from Zustand
 const addItem = useCartStore((state) => state.addItem);

 useEffect(() => {
  // Wrap animations in context to prevent remount bugs
  let ctx = gsap.context(() => {
   gsap.fromTo(
    ".section-header",
    { opacity: 0, y: 30 },
    {
     opacity: 1,
     y: 0,
     duration: 0.7,
     ease: "power2.out",
     scrollTrigger: { trigger: ".section-header", start: "top 80%" },
    },
   );

   gsap.fromTo(
    ".product-card",
    { opacity: 0, y: 60, scale: 0.97 },
    {
     opacity: 1,
     y: 0,
     scale: 1,
     duration: 0.6,
     stagger: 0.1,
     ease: "power2.out",
     scrollTrigger: { trigger: ".products-grid", start: "top 75%" },
    },
   );
  });

  // Revert animations when component unmounts
  return () => ctx.revert();
 }, []);

 return (
  <section className="py-24 bg-rein-black px-6">
   <div className="max-w-7xl mx-auto">
    {/* Section Header */}
    <div className="section-header text-center mb-16 flex flex-col items-center">
     <span className="font-ui font-medium text-[11px] tracking-[0.4em] text-rein-gold-primary uppercase mb-4">
      Our Collection
     </span>
     <h2 className="font-display font-bold text-4xl md:text-[52px] text-rein-cream">
      Flavors Worthy of the Crown
     </h2>
    </div>

    {/* Product Grid */}
    <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
     {products.map((product) => (
      <div
       key={product.id}
       className="product-card group bg-rein-charcoal rounded-[4px] border border-rein-gold-primary/10 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-2 hover:shadow-[0_24px_80px_rgba(201,168,76,0.12)] hover:border-rein-gold-primary/40 flex flex-col"
      >
       {/* Image Container */}
       <div className="relative aspect-square bg-rein-surface overflow-hidden">
        {product.badge && (
         <div className="absolute top-4 left-4 z-20 bg-rein-gold-primary text-rein-black font-ui font-semibold text-[11px] tracking-wider px-3 py-1">
          {product.badge}
         </div>
        )}
        {/* Image Placeholder */}
        <div className="w-full h-full bg-rein-surface flex items-center justify-center text-rein-gold-dim/20 transition-transform duration-600 group-hover:scale-[1.06]">
         [Product Image]
        </div>

        {/* Hover Overlay Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-rein-black/90 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 flex space-x-2">
         {/* Functional Add to Cart Button */}
         <button
          onClick={(e) => {
           e.preventDefault();
           e.stopPropagation(); // <-- Add this line right here
           addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            selectedWeight: product.weight,
            quantity: 1,
           });
          }}
          className="flex-1 bg-rein-gold-primary text-rein-black font-ui font-semibold text-xs tracking-wider uppercase py-3 rounded-sm hover:bg-rein-gold-light transition-colors relative z-50"
         >
          Add to Cart
         </button>

         <button className="w-12 flex items-center justify-center bg-rein-surface text-rein-cream border border-rein-gold-primary/30 rounded-sm hover:text-rein-gold-primary transition-colors">
          <Eye size={20} weight="light" />
         </button>
        </div>
       </div>

       {/* Card Body */}
       <div className="p-5 flex flex-col flex-grow">
        <Link
         href={`/products/${product.id}`}
         className="font-display italic text-[20px] text-rein-cream mb-1 hover:text-rein-gold-primary transition-colors"
        >
         {product.name}
        </Link>
        <span className="font-ui font-light text-[13px] text-rein-gray-light mb-4">
         {product.weight}
        </span>

        <div className="mt-auto flex items-end justify-between">
         <div className="flex flex-col space-y-1">
          <div className="flex space-x-[2px] text-rein-gold-primary">
           {[...Array(5)].map((_, i) => (
            <Star
             key={i}
             size={12}
             weight={i < Math.floor(product.rating) ? "fill" : "regular"}
            />
           ))}
          </div>
         </div>
         <span className="font-accent font-semibold text-[20px] text-rein-gold-primary">
          ₹{product.price}
         </span>
        </div>
       </div>
      </div>
     ))}
    </div>

    {/* Bottom CTA */}
    <div className="text-center">
     <Link
      href="/products"
      className="inline-block font-ui font-medium text-[13px] tracking-[0.2em] uppercase text-rein-gold-primary border-b border-transparent hover:border-rein-gold-primary transition-colors pb-1"
     >
      View All Products →
     </Link>
    </div>
   </div>
  </section>
 );
}
