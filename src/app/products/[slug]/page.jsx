// frontend/src/app/products/[slug]/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
 Star,
 Minus,
 Plus,
 Leaf,
 Drop,
 ShieldCheck,
 CaretRight,
} from "phosphor-react";
import { useCartStore } from "../../../store/useCartStore";

// Mock Database (Will be replaced by Node.js Backend later)
const mockProducts = {
 "peri-peri-makhana": {
  id: 1,
  name: "Peri Peri Makhana",
  description:
   "A fiery, tangy symphony of authentic African bird's eye chili and aromatic herbs. Hand-harvested lotus seeds, slow-roasted to absolute perfection without a single drop of oil. A bold statement for the discerning palate.",
  rating: 4.9,
  reviews: 124,
  variants: [
   { weight: "100g", price: 149 },
   { weight: "250g", price: 249 },
   { weight: "500g", price: 449 },
  ],
  features: ["100% Oil-Free Roast", "Vegan Certified", "Rich in Antioxidants"],
  ingredients:
   "Premium Foxnuts (Makhana), Peri Peri Spice Blend, Himalayan Pink Salt, Dehydrated Garlic, Onion Powder, Natural Flavorings.",
 },
 "truffle-parmesan": {
  id: 3,
  name: "Truffle & Parmesan",
  description:
   "Earthy Italian black truffles meet aged vegetarian parmesan. The ultimate luxury snack experience, offering a rich, umami depth that lingers long after the final crunch.",
  rating: 5.0,
  reviews: 42,
  variants: [
   { weight: "100g", price: 249 },
   { weight: "250g", price: 449 },
  ],
  features: ["Imported Truffles", "Vegetarian Cheese", "Zero Trans Fat"],
  ingredients:
   "Premium Foxnuts (Makhana), Vegetarian Parmesan Cheese Powder, Black Truffle Extract, Sea Salt.",
 },
};

export default function ProductPage() {
 const params = useParams();
 const slug = params?.slug || "peri-peri-makhana"; // Fallback for safety
 const product = mockProducts[slug] || mockProducts["peri-peri-makhana"];

 const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
 const [quantity, setQuantity] = useState(1);
 const addItem = useCartStore((state) => state.addItem);

 // Reset state if product changes
 useEffect(() => {
  setSelectedVariant(product.variants[0]);
  setQuantity(1);
 }, [product]);

 const handleAddToCart = () => {
  addItem({
   id: product.id,
   name: product.name,
   price: selectedVariant.price,
   selectedWeight: selectedVariant.weight,
   quantity: quantity,
  });
 };

 return (
  <div className="min-h-screen bg-rein-black pt-32 pb-24">
   <div className="max-w-7xl mx-auto px-6">
    {/* Breadcrumbs */}
    <nav className="flex items-center space-x-2 font-ui text-xs text-rein-gray-mid uppercase tracking-widest mb-12">
     <Link href="/" className="hover:text-rein-gold-primary transition-colors">
      Home
     </Link>
     <CaretRight size={12} />
     <Link
      href="/products"
      className="hover:text-rein-gold-primary transition-colors"
     >
      Shop
     </Link>
     <CaretRight size={12} />
     <span className="text-rein-cream">{product.name}</span>
    </nav>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
     {/* LEFT: Sticky Image Gallery */}
     <div className="relative">
      <div className="sticky top-32 space-y-4">
       <div className="aspect-[4/5] w-full bg-rein-surface border border-rein-gold-dim/20 flex items-center justify-center text-rein-gold-dim/30 text-sm font-ui">
        [Main Product Image High-Res]
       </div>
       <div className="grid grid-cols-2 gap-4">
        <div className="aspect-square bg-rein-charcoal border border-rein-gold-dim/10 flex items-center justify-center text-rein-gold-dim/20 text-xs">
         [Detail View 1]
        </div>
        <div className="aspect-square bg-rein-charcoal border border-rein-gold-dim/10 flex items-center justify-center text-rein-gold-dim/20 text-xs">
         [Detail View 2]
        </div>
       </div>
      </div>
     </div>

     {/* RIGHT: Product Details & Cart Action */}
     <div className="flex flex-col">
      {/* Header */}
      <div className="border-b border-rein-gold-dim/20 pb-8 mb-8">
       <h1 className="font-display font-bold text-4xl md:text-5xl text-rein-cream mb-4">
        {product.name}
       </h1>

       <div className="flex items-center space-x-4 mb-6">
        <div className="flex text-rein-gold-primary">
         {[...Array(5)].map((_, i) => (
          <Star
           key={i}
           size={16}
           weight={i < Math.floor(product.rating) ? "fill" : "regular"}
          />
         ))}
        </div>
        <span className="font-ui text-sm text-rein-gray-light">
         ({product.reviews} Reviews)
        </span>
       </div>

       <p className="font-accent text-3xl text-rein-gold-primary">
        ₹{selectedVariant.price}
       </p>
      </div>

      {/* Description */}
      <p className="font-ui font-light text-rein-gray-light text-[17px] leading-[1.85] mb-10">
       {product.description}
      </p>

      {/* Variant Selector */}
      <div className="mb-8">
       <h3 className="font-ui text-xs font-semibold uppercase tracking-[0.2em] text-rein-gold-primary mb-4">
        Select Weight
       </h3>
       <div className="flex flex-wrap gap-4">
        {product.variants.map((variant) => (
         <button
          key={variant.weight}
          onClick={() => setSelectedVariant(variant)}
          className={`px-8 py-3 font-ui text-sm tracking-widest border transition-all duration-300 ${
           selectedVariant.weight === variant.weight
            ? "border-rein-gold-primary bg-rein-gold-primary/10 text-rein-gold-primary"
            : "border-rein-gold-dim/30 text-rein-cream hover:border-rein-gold-primary/60"
          }`}
         >
          {variant.weight}
         </button>
        ))}
       </div>
      </div>

      {/* Quantity & Add to Cart */}
      <div className="flex items-center gap-6 mb-12">
       <div className="flex items-center border border-rein-gold-dim/30 h-14">
        <button
         onClick={() => setQuantity(Math.max(1, quantity - 1))}
         className="px-5 text-rein-cream hover:text-rein-gold-primary transition-colors"
        >
         <Minus size={16} />
        </button>
        <span className="font-ui text-lg w-8 text-center text-rein-cream">
         {quantity}
        </span>
        <button
         onClick={() => setQuantity(quantity + 1)}
         className="px-5 text-rein-cream hover:text-rein-gold-primary transition-colors"
        >
         <Plus size={16} />
        </button>
       </div>

       <button
        onClick={handleAddToCart}
        className="flex-1 bg-rein-gold-primary text-rein-black h-14 font-ui font-semibold tracking-[0.2em] uppercase hover:bg-rein-gold-light hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-all"
       >
        Add to Cart — ₹{selectedVariant.price * quantity}
       </button>
      </div>

      {/* Brand Guarantees */}
      <div className="grid grid-cols-3 gap-4 py-8 border-y border-rein-gold-dim/20 mb-8">
       <div className="flex flex-col items-center text-center space-y-3">
        <Drop size={28} weight="light" className="text-rein-gold-primary" />
        <span className="font-ui text-xs text-rein-gray-light uppercase tracking-wider">
         Zero Oil
         <br />
         Roasted
        </span>
       </div>
       <div className="flex flex-col items-center text-center space-y-3">
        <Leaf size={28} weight="light" className="text-rein-gold-primary" />
        <span className="font-ui text-xs text-rein-gray-light uppercase tracking-wider">
         100%
         <br />
         Natural
        </span>
       </div>
       <div className="flex flex-col items-center text-center space-y-3">
        <ShieldCheck
         size={28}
         weight="light"
         className="text-rein-gold-primary"
        />
        <span className="font-ui text-xs text-rein-gray-light uppercase tracking-wider">
         Premium
         <br />
         Grade
        </span>
       </div>
      </div>

      {/* Accordion Details */}
      <div className="space-y-6">
       <div>
        <h4 className="font-ui font-semibold text-rein-cream uppercase tracking-widest text-sm mb-2">
         Ingredients
        </h4>
        <p className="font-ui text-rein-gray-light text-sm leading-relaxed">
         {product.ingredients}
        </p>
       </div>
       <div>
        <h4 className="font-ui font-semibold text-rein-cream uppercase tracking-widest text-sm mb-2">
         Shipping & Returns
        </h4>
        <p className="font-ui text-rein-gray-light text-sm leading-relaxed">
         Complimentary shipping on orders over ₹599. Orders are dispatched
         within 24 hours in luxury, temperature-controlled packaging.
        </p>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
