"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import gsap from "gsap";
import { useCartStore } from "@/store/useCartStore";
import ReviewForm from "@/components/ReviewForm";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ProductDetailPage() {
 const { slug } = useParams();
 const [product, setProduct] = useState(null);
 const [loading, setLoading] = useState(true);
 const [selectedWeight, setSelectedWeight] = useState("");

 // State to control the active tab
 const [activeTab, setActiveTab] = useState("narrative");
 const contentRef = useRef(null);

 // Global Store Actions
 const addToCart = useCartStore((state) => state.addToCart);
 const toggleDrawer = useCartStore((state) => state.toggleDrawer);
 const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);

 useEffect(() => {
  const fetchProduct = async () => {
   try {
    // 1. Fetch the product details
    const res = await fetch(`/api/products/${slug}`);
    if (!res.ok) throw new Error("Product not found");
    const data = await res.json();

    // 2. Fetch the reviews for this specific product ID
    // Note: We use productId here, which is public, so we don't need auth.currentUser
    const productId = data.id || data._id;
    const reviewsRef = collection(db, "reviews");
    const q = query(
     reviewsRef,
     where("productId", "==", productId),
     orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map((doc) => ({
     id: doc.id,
     ...doc.data(),
    }));

    // 3. Merge product data with fetched reviews
    setProduct({ ...data, reviews });

    // Handle weight logic
    if (data.variants && data.variants.length > 0) {
     setSelectedWeight(data.variants[0].weight);
    } else if (data.weight && data.weight.length > 0) {
     setSelectedWeight(data.weight[0]);
    }
   } catch (error) {
    console.error("Failed to load product/reviews:", error);
   } finally {
    setLoading(false);
   }
  };

  if (slug) fetchProduct();
 }, [slug]);
 // Premium Editorial Stagger Reveal Animation
 useEffect(() => {
  if (!loading && product && contentRef.current) {
   gsap.fromTo(
    ".stagger-reveal",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out" },
   );
  }
 }, [loading, product]);

 // Dynamic Price and Stock Calculation
 const activeVariant = product?.variants?.find(
  (v) => v.weight === selectedWeight,
 );
 const currentPrice = activeVariant ? activeVariant.price : product?.price || 0;

 // Look for the stock of the selected variant, fallback to global stock for legacy items
 const currentStock =
  activeVariant && activeVariant.stock !== undefined
   ? activeVariant.stock
   : product?.stock || 0;

 // Calculate rating counts
 const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
 product?.reviews?.forEach((r) => {
  if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
 });

 const totalReviews = product?.reviews?.length || 0;

 const handleAddToCart = () => {
  if (!product) return;

  const cartItem = {
   _id: product.id || product._id,
   name: product.name,
   price: currentPrice,
   image: product.images?.[0] || "/placeholder.jpg",
   selectedWeight: selectedWeight,
   quantity: 1,
  };

  addToCart(cartItem);

  if (!isDrawerOpen) {
   toggleDrawer();
  }
 };

 // Helper to render structural rating stars cleanly
 const renderStars = (rating) => {
  return Array.from({ length: 5 }).map((_, i) => (
   <span key={i} className={i < rating ? "text-[#C9A84C]" : "text-[#1C1A16]"}>
    ★
   </span>
  ));
 };

 if (loading) {
  return (
   <main className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse font-ui font-medium">
     Accessing Vault Records...
    </div>
   </main>
  );
 }

 if (!product || product.isActive === false) {
  return (
   <main className="bg-[#0A0A0A] min-h-screen flex items-center justify-center text-[#F5EDD6]">
    <div className="text-center space-y-4">
     <h1 className="font-display text-2xl italic text-[#9A9485]">
      This blend has left the vault.
     </h1>
     <p className="text-xs font-ui uppercase tracking-widest text-[#1C1A16]">
      Product unavailable or inactive
     </p>
    </div>
   </main>
  );
 }

 const weightsToDisplay = product.variants
  ? product.variants.map((v) => v.weight)
  : product.weight || [];

 return (
  <main className="bg-[#0A0A0A] min-h-screen text-[#F5EDD6] overflow-x-hidden">
   <Navbar />

   <div
    ref={contentRef}
    className="max-w-7xl mx-auto px-6 pt-36 pb-24 space-y-24"
   >
    {/* UPPER MATRIX: Core Purchasing Zone */}
    <div className="grid lg:grid-cols-[1fr_1fr] gap-16 items-start">
     {/* Left Column: Image */}
     <div className="lg:sticky lg:top-32 w-full aspect-[4/5] bg-[#111111] border border-[#1C1A16] relative overflow-hidden group rounded-sm shadow-xl z-10 stagger-reveal">
      {product.images && product.images[0] ? (
       <Image
        src={product.images[0]}
        alt={product.name}
        fill
        priority={true}
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
       />
      ) : (
       <div className="absolute inset-0 flex items-center justify-center text-[#4A4640] font-ui text-[11px] uppercase tracking-widest">
        Asset Reference Empty
       </div>
      )}
     </div>

     {/* Right Column: Checkout Controls */}
     <div className="space-y-10 lg:py-4">
      <div className="space-y-4 border-b border-[#1C1A16] pb-8 stagger-reveal">
       <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] font-medium block">
        {product.category || "Signature Collection"}
       </span>
       <h1 className="font-display text-[clamp(36px,4vw,52px)] leading-[1.1] text-[#F5EDD6]">
        {product.name}
       </h1>

       {product.shortDescription && (
        <p className="text-[#9A9485] font-ui text-sm italic font-light tracking-wide max-w-xl">
         {product.shortDescription}
        </p>
       )}

       <div className="pt-2 flex items-center gap-4">
        <span className="text-2xl text-[#E8C97A] font-ui font-light tracking-wide transition-all duration-300">
         ₹{Number(currentPrice).toFixed(2)}
        </span>
        {currentStock <= 0 && (
         <span className="text-red-400 text-[9px] font-ui font-semibold uppercase tracking-[0.2em] border border-red-500/20 bg-red-500/5 px-2.5 py-1 rounded-sm">
          Vault Depleted
         </span>
        )}
       </div>
      </div>

      {weightsToDisplay.length > 0 && (
       <div className="space-y-4 pt-2 stagger-reveal">
        <span className="text-[#9A9485] text-[10px] uppercase tracking-[0.2em] block font-medium">
         Select Allocation Tier
        </span>
        <div className="flex flex-wrap gap-3">
         {weightsToDisplay.map((w) => (
          <button
           key={w}
           type="button"
           onClick={() => setSelectedWeight(w)}
           className={`px-6 py-3 text-[11px] uppercase tracking-widest transition-all duration-300 border rounded-sm ${
            selectedWeight === w
             ? "bg-[#C9A84C] border-[#C9A84C] text-[#0A0A0A] font-semibold shadow-[0_0_15px_rgba(201,168,76,0.15)]"
             : "bg-transparent border-[#1C1A16] text-[#9A9485] hover:border-[#C9A84C] hover:text-[#C9A84C]"
           }`}
          >
           {w}
          </button>
         ))}
        </div>
       </div>
      )}

      {/* Action Buttons */}
      <div className="pt-8 stagger-reveal">
       <button
        onClick={handleAddToCart}
        disabled={currentStock <= 0}
        className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] py-5 font-bold tracking-[0.2em] uppercase text-[12px] hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
       >
        {currentStock > 0 ? "Add to Cart" : "Out of Stock"}
       </button>

       <div className="mt-6 flex justify-between text-[11px] uppercase tracking-[0.2em] text-[#9A9485]">
        <span>Complimentary Shipping over ₹1500</span>
        <span
         className={currentStock <= 5 ? "text-yellow-500/80 font-medium" : ""}
        >
         {currentStock > 0
          ? `${currentStock} Units Available`
          : "Awaiting Harvest"}
        </span>
       </div>
      </div>
     </div>
    </div>

    {/* LOWER MATRIX: Interactive Tabbed Interface */}
    <div className="stagger-reveal">
     {/* Tab Navigation Menu */}
     <div className="flex flex-wrap gap-8 border-b border-[#1C1A16]">
      {["narrative", "ingredients", "reviews"].map((tab) => (
       <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`pb-4 text-[10px] uppercase tracking-[0.2em] font-ui transition-colors relative ${
         activeTab === tab
          ? "text-[#C9A84C]"
          : "text-[#4A4640] hover:text-[#9A9485]"
        }`}
       >
        {tab === "narrative"
         ? "The Narrative"
         : tab === "ingredients"
           ? "Composition & Sourcing"
           : "Patron Registry"}

        {/* Animated Active Indicator Line */}
        {activeTab === tab && (
         <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-[#C9A84C] shadow-[0_0_10px_rgba(201,168,76,0.5)]"></span>
        )}
       </button>
      ))}
     </div>

     {/* Tab Content Display Area */}
     <div className="pt-12 min-h-[300px]">
      {/* 1. Narrative Tab */}
      {activeTab === "narrative" && (
       <div className="animate-in fade-in duration-500">
        <p className="text-[#9A9485] text-[15px] leading-[1.85] font-ui font-light max-w-4xl whitespace-pre-wrap">
         {product.description ||
          "The master blenders are currently updating the narrative for this item."}
        </p>
       </div>
      )}

      {/* 2. Ingredients Tab (Now dynamically renders a table if data is an array) */}
      {activeTab === "ingredients" && (
       <div className="animate-in fade-in duration-500">
        {Array.isArray(product.ingredients) ? (
         <div className="border border-[#1C1A16] rounded-sm overflow-hidden max-w-4xl">
          <table className="w-full text-left border-collapse">
           <thead>
            <tr className="bg-[#111111] border-b border-[#1C1A16]">
             <th className="font-ui text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] font-medium p-6 w-1/3 border-r border-[#1C1A16]">
              Component
             </th>
             <th className="font-ui text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
              Sourcing & Details
             </th>
            </tr>
           </thead>
           <tbody className="divide-y divide-[#1C1A16]">
            {product.ingredients.map((ing, idx) => (
             <tr key={idx} className="hover:bg-[#111111]/50 transition-colors">
              <td className="p-6 font-display italic text-[#F5EDD6] text-[15px] border-r border-[#1C1A16] align-top">
               {ing.component}
              </td>
              <td className="p-6 text-[#9A9485] font-ui text-[14px] font-light leading-relaxed align-top">
               {ing.sourcing}
              </td>
             </tr>
            ))}
           </tbody>
          </table>
         </div>
        ) : (
         <p className="text-[#9A9485] text-[15px] leading-[1.85] font-ui font-light max-w-4xl whitespace-pre-wrap">
          {product.ingredients ||
           "Composition data is securely stored. Consult our concierges for exact sourcing details."}
         </p>
        )}
       </div>
      )}

      {activeTab === "reviews" && (
       <div className="animate-in fade-in duration-500 grid md:grid-cols-[1fr_2fr] gap-12 pt-8">
        {/* LEFT COLUMN: Rating Chart */}
        <div className="space-y-6">
         <h3 className="text-[#C9A84C] text-[10px] uppercase tracking-[0.2em] font-medium">
          Rating Breakdown
         </h3>
         <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
           const count = ratingCounts[star] || 0;
           const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;
           return (
            <div
             key={star}
             className="flex items-center gap-3 text-[11px] uppercase tracking-widest"
            >
             <span className="w-10 text-[#F5EDD6]">{star} Star</span>
             <div className="flex-1 h-1.5 bg-[#1C1A16] rounded-full overflow-hidden">
              <div
               className="h-full bg-[#C9A84C]"
               style={{ width: `${percentage}%` }}
              ></div>
             </div>
             <span className="w-8 text-[#9A9485] text-right">{count}</span>
            </div>
           );
          })}
         </div>
         <div className="pt-8">
          <ReviewForm productId={product.id || product._id} />
         </div>
        </div>

        {/* RIGHT COLUMN: Top 6 Reviews */}
        <div className="space-y-8">
         {product.reviews && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {product.reviews.slice(0, 6).map((review, idx) => (
            <div
             key={review.id || idx}
             className="bg-[#111111]/40 border border-[#1C1A16] p-6 rounded-sm space-y-3"
            >
             <div className="flex justify-between items-center">
              <span className="font-display italic text-[#F5EDD6] text-md">
               {review.name}
              </span>
              <div className="flex gap-0.5 text-[9px]">
               {renderStars(review.rating)}
              </div>
             </div>
             <p className="text-[#9A9485] font-ui text-sm font-light leading-relaxed italic">
              "{review.comment}"
             </p>
            </div>
           ))}
          </div>
         ) : (
          <p className="text-[#4A4640] font-ui text-xs uppercase tracking-widest">
           No reviews yet.
          </p>
         )}
        </div>
       </div>
      )}
     </div>
    </div>
   </div>
  </main>
 );
}
