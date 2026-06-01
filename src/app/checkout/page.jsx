"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/useCartStore";
import { CaretLeft, LockKey, CheckCircle } from "phosphor-react";
import gsap from "gsap";

export default function CheckoutPage() {
 const { cart, getCartSubtotal, clearCart } = useCartStore();
 const [step, setStep] = useState(1);
 const [isProcessing, setIsProcessing] = useState(false);
 const [mounted, setMounted] = useState(false);

 const [customer, setCustomer] = useState({
  firstName: "",
  lastName: "",
  email: "",
  contact: "9999999999",
 });

 const subtotal = getCartSubtotal();
 const shippingFee = subtotal >= 599 || subtotal === 0 ? 0 : 50;
 const total = subtotal + shippingFee;

 useEffect(() => {
  setMounted(true);

  // Check if we just returned from a successful Stripe checkout
  const query = new URLSearchParams(window.location.search);
  if (query.get("success")) {
   setStep(3); // Jump straight to confirmation
   clearCart();
  }
  if (query.get("canceled")) {
   alert("Payment was canceled. You can try again.");
   setStep(2); // Keep them on the payment step
  }
 }, [clearCart]);

 useEffect(() => {
  if (step === 3) {
   gsap.fromTo(
    ".success-check",
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
   );
  }
 }, [step]);

 const handleDeliverySubmit = (e) => {
  e.preventDefault();
  setStep(2);
 };

 const handlePayment = async () => {
  setIsProcessing(true);

  try {
   // 1. Call Node.js to create a Stripe Checkout Session
   const response = await fetch(
    "http://localhost:5000/api/checkout/create-order",
    {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ amount: total }),
    },
   );

   const session = await response.json();

   if (!response.ok) {
    throw new Error(session.error || "Failed to create checkout session");
   }

   // 2. Redirect the browser directly to the secure Stripe URL
   if (session.url) {
    window.location.href = session.url;
   } else {
    throw new Error("No checkout URL returned from Stripe");
   }
  } catch (error) {
   console.error("Checkout Error:", error);
   alert("Something went wrong connecting to Stripe.");
   setIsProcessing(false); // Only reset if it fails, otherwise let it redirect
  }
 };

 if (!mounted) return null;

 return (
  <div className="min-h-screen bg-rein-black flex flex-col font-ui text-rein-cream relative z-10">
   <header className="py-8 border-b border-rein-gold-dim/20 flex justify-center bg-rein-charcoal">
    <Link
     href="/"
     className="font-display text-3xl font-bold tracking-widest uppercase"
    >
     REIN <span className="text-rein-gold-primary font-light">ORO</span>
    </Link>
   </header>

   <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12">
    {/* Progress Bar */}
    <div className="flex items-center justify-center space-x-4 mb-16">
     <div
      className={`text-sm tracking-widest uppercase ${step >= 1 ? "text-rein-gold-primary" : "text-rein-gray-mid"}`}
     >
      1. Delivery
     </div>
     <div
      className={`w-12 h-[1px] ${step >= 2 ? "bg-rein-gold-primary" : "bg-rein-gray-mid"}`}
     />
     <div
      className={`text-sm tracking-widest uppercase ${step >= 2 ? "text-rein-gold-primary" : "text-rein-gray-mid"}`}
     >
      2. Payment
     </div>
     <div
      className={`w-12 h-[1px] ${step >= 3 ? "bg-rein-gold-primary" : "bg-rein-gray-mid"}`}
     />
     <div
      className={`text-sm tracking-widest uppercase ${step === 3 ? "text-rein-gold-primary" : "text-rein-gray-mid"}`}
     >
      3. Confirmation
     </div>
    </div>

    <div
     className={`grid grid-cols-1 ${step !== 3 ? "lg:grid-cols-[1fr_400px]" : ""} gap-16`}
    >
     <div className={step === 3 ? "max-w-2xl mx-auto w-full text-center" : ""}>
      {/* STEP 1: DELIVERY FORM */}
      {step === 1 && (
       <form onSubmit={handleDeliverySubmit} className="space-y-6">
        <h2 className="font-display text-3xl mb-8">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-6">
         <input
          required
          type="text"
          placeholder="First Name"
          value={customer.firstName}
          onChange={(e) =>
           setCustomer({ ...customer, firstName: e.target.value })
          }
          className="col-span-1 bg-rein-surface border border-rein-gold-dim/30 px-5 py-4 focus:outline-none focus:border-rein-gold-primary transition-colors"
         />
         <input
          required
          type="text"
          placeholder="Last Name"
          value={customer.lastName}
          onChange={(e) =>
           setCustomer({ ...customer, lastName: e.target.value })
          }
          className="col-span-1 bg-rein-surface border border-rein-gold-dim/30 px-5 py-4 focus:outline-none focus:border-rein-gold-primary transition-colors"
         />
         <input
          required
          type="email"
          placeholder="Email Address"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          className="col-span-2 bg-rein-surface border border-rein-gold-dim/30 px-5 py-4 focus:outline-none focus:border-rein-gold-primary transition-colors"
         />
         <input
          required
          type="text"
          placeholder="Address Line 1"
          className="col-span-2 bg-rein-surface border border-rein-gold-dim/30 px-5 py-4 focus:outline-none focus:border-rein-gold-primary transition-colors"
         />
         <input
          required
          type="text"
          placeholder="City"
          className="col-span-1 bg-rein-surface border border-rein-gold-dim/30 px-5 py-4 focus:outline-none focus:border-rein-gold-primary transition-colors"
         />
         <input
          required
          type="text"
          placeholder="Pincode"
          className="col-span-1 bg-rein-surface border border-rein-gold-dim/30 px-5 py-4 focus:outline-none focus:border-rein-gold-primary transition-colors"
         />
        </div>
        <div className="pt-6 flex items-center justify-between">
         <Link
          href="/"
          className="flex items-center text-rein-gray-light hover:text-rein-gold-primary transition-colors"
         >
          <CaretLeft size={16} className="mr-2" /> Return to Store
         </Link>
         <button
          type="submit"
          className="bg-rein-gold-primary text-rein-black font-semibold uppercase tracking-widest px-10 py-4 hover:bg-rein-gold-light transition-colors"
         >
          Continue to Payment
         </button>
        </div>
       </form>
      )}

      {/* STEP 2: STRIPE PAYMENT */}
      {step === 2 && (
       <div className="space-y-8">
        <h2 className="font-display text-3xl mb-8">Secure Payment</h2>
        <div className="bg-rein-surface border border-rein-gold-primary/30 p-8 text-center flex flex-col items-center">
         <LockKey
          size={48}
          weight="light"
          className="text-rein-gold-primary mb-4"
         />
         <h3 className="text-xl mb-2">Stripe Secure Checkout</h3>
         <p className="text-rein-gray-light text-sm mb-8">
          You will be redirected to Stripe to complete your purchase securely.
         </p>
         <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-rein-gold-primary text-rein-black font-semibold uppercase tracking-widest py-4 hover:bg-rein-gold-light transition-colors disabled:opacity-50"
         >
          {isProcessing ? "Connecting to Stripe..." : `Pay ₹${total}`}
         </button>
        </div>
        <button
         onClick={() => setStep(1)}
         className="flex items-center text-rein-gray-light hover:text-rein-gold-primary transition-colors"
        >
         <CaretLeft size={16} className="mr-2" /> Back to Shipping
        </button>
       </div>
      )}

      {/* STEP 3: CONFIRMATION */}
      {step === 3 && (
       <div className="flex flex-col items-center py-16">
        <div className="success-check bg-rein-gold-primary/10 rounded-full p-6 mb-8">
         <CheckCircle
          size={80}
          weight="fill"
          className="text-rein-gold-primary"
         />
        </div>
        <h2 className="font-display text-4xl mb-4">Order Confirmed</h2>
        <p className="text-rein-gray-light mb-8">
         Your luxury snack experience is being prepared. We have emailed you the
         receipt.
        </p>
        <Link
         href="/"
         className="bg-rein-surface border border-rein-gold-primary text-rein-gold-primary uppercase tracking-widest px-10 py-4 hover:bg-rein-gold-primary hover:text-rein-black transition-colors"
        >
         Continue Shopping
        </Link>
       </div>
      )}
     </div>

     {/* RIGHT COLUMN: Order Summary */}
     {step !== 3 && (
      <div className="bg-rein-charcoal border border-rein-gold-dim/20 p-8 h-fit sticky top-8">
       <h3 className="font-display text-2xl mb-6">Order Summary</h3>
       <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
        {cart.length === 0 ? (
         <p className="text-rein-gray-light">Your cart is empty.</p>
        ) : (
         cart.map((item) => (
          <div
           key={`${item.id}-${item.selectedWeight}`}
           className="flex justify-between items-center"
          >
           <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-rein-surface border border-rein-gold-dim/20 flex items-center justify-center text-[10px] text-rein-gray-mid">
             Img
            </div>
            <div>
             <p className="font-display italic text-lg">{item.name}</p>
             <p className="text-rein-gray-light text-xs">
              {item.selectedWeight} x {item.quantity}
             </p>
            </div>
           </div>
           <p className="font-accent text-rein-gold-primary">
            ₹{item.price * item.quantity}
           </p>
          </div>
         ))
        )}
       </div>
       <div className="border-t border-rein-gold-dim/20 pt-6 space-y-4 text-sm text-rein-gray-light">
        <div className="flex justify-between">
         <span>Subtotal</span>
         <span className="font-accent text-rein-cream">₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
         <span>Shipping</span>
         <span className="font-accent text-rein-cream">
          {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
         </span>
        </div>
        <div className="border-t border-rein-gold-dim/20 pt-4 flex justify-between items-end">
         <span className="text-rein-cream uppercase tracking-widest">
          Total
         </span>
         <span className="font-accent text-3xl text-rein-gold-primary">
          ₹{total}
         </span>
        </div>
       </div>
      </div>
     )}
    </div>
   </main>
  </div>
 );
}
