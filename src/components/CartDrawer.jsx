"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Trash, Plus, Minus } from "phosphor-react";
import { useCartStore } from "../store/useCartStore";
import gsap from "gsap";

export default function CartDrawer() {
 const [isMounted, setIsMounted] = useState(false); // Hydration safeguard

 const {
  cart,
  isDrawerOpen,
  closeDrawer,
  updateQuantity,
  removeItem,
  getCartSubtotal,
 } = useCartStore();

 const drawerRef = useRef(null);
 const overlayRef = useRef(null);

 // Tells React it is safe to read localStorage
 useEffect(() => {
  setIsMounted(true);
 }, []);

 const subtotal = isMounted ? getCartSubtotal() : 0;
 const shippingThreshold = 599;
 const progress = Math.min((subtotal / shippingThreshold) * 100, 100);
 const remainingForFreeShipping = shippingThreshold - subtotal;

 useEffect(() => {
  if (!isMounted) return;

  if (isDrawerOpen) {
   gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: "block" });
   gsap.to(drawerRef.current, {
    x: 0,
    duration: 0.45,
    ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
   });
  } else {
   gsap.to(drawerRef.current, { x: "100%", duration: 0.4, ease: "power2.in" });
   gsap.to(overlayRef.current, {
    opacity: 0,
    duration: 0.3,
    display: "none",
    delay: 0.1,
   });
  }
 }, [isDrawerOpen, isMounted]);

 // Prevents server-side rendering crash
 if (!isMounted) return null;

 return (
  <>
   {/* Background Overlay */}
   <div
    ref={overlayRef}
    onClick={closeDrawer}
    className="fixed inset-0 bg-rein-overlay z-[60] hidden backdrop-blur-sm"
   />

   {/* Slide-in Drawer Container */}
   <div
    ref={drawerRef}
    className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-rein-charcoal z-[70] translate-x-full border-l border-rein-gold-dim/20 flex flex-col shadow-2xl"
   >
    <div className="flex items-center justify-between p-6 border-b border-rein-gold-dim/10 bg-rein-black">
     <h2 className="font-display text-2xl text-rein-cream">Your Cart</h2>
     <button
      onClick={closeDrawer}
      className="text-rein-gray-light hover:text-rein-gold-primary transition-colors"
     >
      <X size={24} />
     </button>
    </div>

    <div className="p-6 bg-rein-surface border-b border-rein-gold-dim/10">
     <div className="flex justify-between font-ui text-[13px] mb-2">
      <span className="text-rein-gray-light">
       {remainingForFreeShipping > 0 ? (
        `Add ₹${remainingForFreeShipping} more for FREE shipping`
       ) : (
        <span className="text-rein-gold-primary">
         You unlocked FREE shipping!
        </span>
       )}
      </span>
     </div>
     <div className="w-full h-[3px] bg-rein-black rounded-full overflow-hidden">
      <div
       className="h-full bg-gradient-to-r from-rein-gold-dim to-rein-gold-light transition-all duration-500"
       style={{ width: `${progress}%` }}
      />
     </div>
    </div>

    <div className="flex-1 overflow-y-auto p-6 space-y-6">
     {cart.length === 0 ? (
      <div className="h-full flex flex-col items-center justify-center text-rein-gray-light">
       <p className="font-ui text-lg mb-4">Your cart is empty.</p>
       <button
        onClick={closeDrawer}
        className="text-rein-gold-primary uppercase tracking-[0.2em] text-sm border-b border-rein-gold-primary pb-1"
       >
        Continue Shopping
       </button>
      </div>
     ) : (
      cart.map((item) => (
       <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-4">
        <div className="w-20 h-20 bg-rein-black rounded-sm border border-rein-gold-dim/10 flex items-center justify-center text-[10px] text-rein-gray-mid">
         Image
        </div>
        <div className="flex-1 flex flex-col justify-between">
         <div>
          <div className="flex justify-between items-start">
           <h3 className="font-display italic text-lg text-rein-cream">
            {item.name}
           </h3>
           <button
            onClick={() => removeItem(item.id, item.selectedWeight)}
            className="text-rein-gray-mid hover:text-rein-gold-primary"
           >
            <Trash size={18} />
           </button>
          </div>
          <p className="font-ui text-xs text-rein-gray-light">
           {item.selectedWeight}
          </p>
         </div>
         <div className="flex justify-between items-end mt-2">
          <div className="flex items-center border border-rein-gold-dim/30 rounded-sm">
           <button
            onClick={() => updateQuantity(item.id, item.selectedWeight, -1)}
            className="px-2 py-1 text-rein-cream hover:text-rein-gold-primary"
           >
            <Minus size={12} />
           </button>
           <span className="font-ui text-sm px-2 text-rein-cream">
            {item.quantity}
           </span>
           <button
            onClick={() => updateQuantity(item.id, item.selectedWeight, 1)}
            className="px-2 py-1 text-rein-cream hover:text-rein-gold-primary"
           >
            <Plus size={12} />
           </button>
          </div>
          <span className="font-accent text-lg text-rein-gold-primary">
           ₹{item.price * item.quantity}
          </span>
         </div>
        </div>
       </div>
      ))
     )}
    </div>

    {cart.length > 0 && (
     <div className="p-6 bg-rein-black border-t border-rein-gold-dim/20">
      <div className="flex justify-between font-ui text-lg text-rein-cream mb-6">
       <span>Subtotal</span>
       <span className="font-accent text-rein-gold-primary text-xl">
        ₹{subtotal}
       </span>
      </div>
      <Link
       href="/checkout"
       onClick={closeDrawer}
       className="w-full flex items-center justify-center bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black font-ui font-semibold tracking-[0.2em] uppercase py-4 rounded-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-shadow"
      >
       Proceed to Checkout
      </Link>
     </div>
    )}
   </div>
  </>
 );
}
