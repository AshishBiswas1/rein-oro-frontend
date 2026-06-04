"use client";
import Link from "next/link";
import { CheckCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import { useCartStore } from "../../store/useCartStore";

export default function SuccessPage() {
 const { clearCart } = useCartStore();
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
  setMounted(true);
  // Extra safety measure: Ensure the cart is emptied when they hit this page
  clearCart();
 }, [clearCart]);

 if (!mounted) return null;

 return (
  <div className="min-h-screen bg-rein-black flex items-center justify-center px-6">
   <div className="max-w-2xl w-full bg-rein-charcoal border border-rein-gold-dim/20 p-12 text-center shadow-2xl relative overflow-hidden">
    {/* Decorative Background Elements */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rein-gold-primary to-transparent opacity-50" />

    <div className="flex justify-center mb-8">
     <div className="relative">
      <div className="absolute inset-0 bg-rein-gold-primary blur-xl opacity-20 rounded-full" />
      <CheckCircle
       size={80}
       weight="light"
       className="text-rein-gold-primary relative z-10"
      />
     </div>
    </div>

    <h1 className="font-display text-4xl md:text-5xl text-rein-cream mb-4">
     Payment Successful
    </h1>

    <p className="font-ui text-rein-gray-light text-lg mb-8 tracking-wide">
     Welcome to the world of Rein Oro. Your luxury order has been received and
     is being prepared with the utmost care.
    </p>

    <div className="inline-block border-t border-b border-rein-gold-dim/20 py-4 mb-10">
     <p className="font-ui text-sm text-rein-gray-mid uppercase tracking-[0.2em]">
      A confirmation email will be sent shortly.
     </p>
    </div>

    <div>
     <Link
      href="/"
      className="inline-block border border-rein-gold-primary text-rein-gold-primary font-ui font-semibold tracking-[0.2em] uppercase px-12 py-4 hover:bg-rein-gold-primary hover:text-rein-black transition-colors"
     >
      Return to Boutique
     </Link>
    </div>
   </div>
  </div>
 );
}
