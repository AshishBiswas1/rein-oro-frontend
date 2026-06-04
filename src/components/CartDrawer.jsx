"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { Plus, Minus, Trash, X } from "phosphor-react";
import { useCartStore } from "@/store/useCartStore";

export default function CartDrawer() {
 const [isMounted, setIsMounted] = useState(false);

 // Animation Element Tracking Hub Hooks
 const overlayRef = useRef(null);
 const drawerRef = useRef(null);

 // Zustand Global State Sync Selectors
 const isDrawerOpen = useCartStore((state) => state.isDrawerOpen);
 const cart = useCartStore((state) => state.cart);
 const getCartSubtotal = useCartStore((state) => state.getCartSubtotal);
 const toggleDrawer = useCartStore((state) => state.toggleDrawer);

 // CRITICAL FIX: Safe, clean, primitive function state pointers
 const storeRemoveItem = useCartStore((state) => state.removeItem);
 const storeUpdateQuantity = useCartStore((state) => state.updateQuantity);

 // Operational wrapper handlers to protect from infinite render loops
 const removeItem = (id, weight) => {
  if (storeRemoveItem) {
   storeRemoveItem(id, weight);
  } else {
   console.warn("removeItem action is not implemented in useCartStore yet.", {
    id,
    weight,
   });
  }
 };

 const updateQuantity = (id, weight, delta) => {
  if (storeUpdateQuantity) {
   storeUpdateQuantity(id, weight, delta);
  } else {
   console.warn(
    "updateQuantity action is not implemented in useCartStore yet.",
    { id, weight, delta },
   );
  }
 };

 // Proxy wrapper function to mirror toggle interactions cleanly
 const closeDrawer = () => toggleDrawer();

 useEffect(() => {
  setIsMounted(true);
 }, []);

 // Lifecycle Hook 1: Core System View Level Document Scroll Locking
 useEffect(() => {
  if (isMounted && isDrawerOpen) {
   document.body.style.overflow = "hidden";
  } else {
   document.body.style.overflow = "unset";
  }
  return () => {
   document.body.style.overflow = "unset";
  };
 }, [isDrawerOpen, isMounted]);

 // Lifecycle Hook 2: GSAP Cinematic Fluid Overlay & Sliding Drawer Core Timeline
 useEffect(() => {
  if (!isMounted) return;

  if (isDrawerOpen) {
   // Reveal dark overlay masking background layer
   gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: "block" });
   // Slide open the cart view panel
   gsap.to(drawerRef.current, {
    x: 0,
    duration: 0.45,
    ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
   });
  } else {
   // Retract the cart view panel out of view bounds
   gsap.to(drawerRef.current, { x: "100%", duration: 0.4, ease: "power2.in" });
   // Terminate overlay layers on dismissal loop close
   gsap.to(overlayRef.current, {
    opacity: 0,
    duration: 0.3,
    display: "none",
    delay: 0.1,
   });
  }
 }, [isDrawerOpen, isMounted]);

 // Derived calculations safe for execution pipelines
 const subtotal = isMounted ? getCartSubtotal() : 0;
 const shippingThreshold = 599;
 const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
 const remainingForFreeShipping = shippingThreshold - subtotal;

 // CRITICAL FLUID RULES PROTECTOR: Single consolidated early return placed dead-last among hooks
 if (!isMounted) return null;

 return (
  <>
   {/* Background Overlay Backdrop */}
   <div
    ref={overlayRef}
    onClick={closeDrawer}
    className="fixed inset-0 bg-rein-black/70 z-[60] hidden backdrop-blur-sm"
   />

   {/* Slide-in Drawer Main View Container Shell */}
   <div
    ref={drawerRef}
    className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-rein-charcoal z-[70] translate-x-full border-l border-rein-gold-primary/10 flex flex-col shadow-2xl"
    suppressHydrationWarning
   >
    {/* Header Drawer Section Grid */}
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-rein-gold-primary/10 bg-rein-black">
     <h2 className="font-display text-xl sm:text-2xl text-rein-cream">
      Your Cart
     </h2>
     <button
      onClick={closeDrawer}
      className="text-rein-gray-light hover:text-rein-gold-primary transition-colors p-1"
     >
      <X size={22} weight="light" />
     </button>
    </div>

    {/* Free Shipping Dynamic Progression Progress Indicator Bar */}
    <div className="p-4 sm:p-6 bg-rein-surface border-b border-rein-gold-primary/10">
     <div className="flex justify-between font-ui text-[13px] mb-2">
      <span className="text-rein-gray-light">
       {remainingForFreeShipping > 0 ? (
        `Add ₹${remainingForFreeShipping} more for FREE shipping`
       ) : (
        <span className="text-rein-gold-primary font-medium tracking-wide">
         You unlocked FREE premium shipping!
        </span>
       )}
      </span>
     </div>
     <div className="w-full h-[3px] bg-rein-black rounded-full overflow-hidden">
      <div
       className="h-full bg-gradient-to-r from-rein-gold-dim to-rein-gold-primary transition-all duration-500"
       style={{ width: `${progress}%` }}
      />
     </div>
    </div>

    {/* Middle Interactive Item Cards List Segment Section */}
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 scrollbar-thin">
     {cart.length === 0 ? (
      <div className="h-full flex flex-col items-center justify-center text-rein-gray-light space-y-4">
       <p className="font-ui text-md">Your signature vault is empty.</p>
       <button
        onClick={closeDrawer}
        className="text-rein-gold-primary uppercase tracking-[0.2em] text-xs border-b border-rein-gold-primary pb-1 font-medium transition-opacity hover:opacity-80"
       >
        Continue Curation
       </button>
      </div>
     ) : (
      cart.map((item) => (
       <div
        key={`${item._id || item.id}-${item.selectedWeight}`}
        className="flex gap-3 sm:gap-4 border-b border-rein-gold-primary/5 pb-5 sm:pb-6 last:border-0 last:pb-0"
       >
        {/* Fixed Dynamic Next.js Image Component Wrapper */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rein-black rounded-sm border border-rein-gold-primary/10 flex items-center justify-center relative overflow-hidden shrink-0">
         <Image
          src={item.image || "/placeholder.jpg"}
          alt={item.name}
          fill
          sizes="80px"
          className="object-cover"
         />
        </div>

        <div className="flex-1 flex flex-col justify-between">
         <div>
          <div className="flex justify-between items-start gap-2">
           <h3 className="font-display italic text-base sm:text-[17px] text-rein-cream leading-tight line-clamp-2">
            {item.name}
           </h3>
           <button
            onClick={() => removeItem(item._id || item.id, item.selectedWeight)}
            className="text-rein-gray-light hover:text-red-400 transition-colors p-1"
            aria-label="Purge Item From Order"
           >
            <Trash size={16} weight="light" />
           </button>
          </div>
          <p className="font-ui text-[11px] sm:text-xs text-rein-gray-light mt-1">
           {item.selectedWeight}
          </p>
         </div>

         <div className="flex justify-between items-end mt-2">
          {/* Active Fluid Quantity Modification Counter Selector */}
          <div className="flex items-center border border-rein-gold-primary/30 rounded-sm bg-rein-black">
           <button
            onClick={() =>
             updateQuantity(item._id || item.id, item.selectedWeight, -1)
            }
            className="px-2.5 py-1 text-rein-cream hover:text-rein-gold-primary transition-colors"
           >
            <Minus size={11} />
           </button>
           <span className="font-ui text-xs px-1 text-rein-cream font-medium min-w-[16px] text-center">
            {item.quantity}
           </span>
           <button
            onClick={() =>
             updateQuantity(item._id || item.id, item.selectedWeight, 1)
            }
            className="px-2.5 py-1 text-rein-cream hover:text-rein-gold-primary transition-colors"
           >
            <Plus size={11} />
           </button>
          </div>
          <span className="font-accent text-sm sm:text-md text-rein-gold-light font-medium">
           ₹{item.price * item.quantity}
          </span>
         </div>
        </div>
       </div>
      ))
     )}
    </div>

    {/* Bottom Total Summary Panel Checkouts Gate Block Banner */}
    {cart.length > 0 && (
     <div className="p-4 sm:p-6 bg-rein-black border-t border-rein-gold-primary/20">
      <div className="flex justify-between font-ui text-sm sm:text-base text-rein-cream mb-4 sm:mb-6">
       <span>Subtotal</span>
       <span className="font-accent text-rein-gold-primary text-lg font-semibold">
        ₹{subtotal}
       </span>
      </div>
      <Link
       href="/checkout"
       onClick={closeDrawer}
       className="w-full flex items-center justify-center bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black font-ui font-semibold tracking-[0.2em] uppercase py-4 rounded-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all text-xs"
      >
       Proceed to Checkout
      </Link>
     </div>
    )}
   </div>
  </>
 );
}
