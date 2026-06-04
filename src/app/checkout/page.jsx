"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CaretRight, LockKey } from "phosphor-react";
import { useCartStore } from "@/store/useCartStore";

// <-- Firebase Imports -->
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Utility to inject the Razorpay SDK seamlessly into the browser
const loadRazorpayScript = () => {
 return new Promise((resolve) => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
 });
};

export default function CheckoutPage() {
 const router = useRouter();
 const [isMounted, setIsMounted] = useState(false);
 const [loadingAuth, setLoadingAuth] = useState(true);

 const [step, setStep] = useState(1); // 1: Delivery, 2: Payment, 3: Confirmation
 const [isProcessing, setIsProcessing] = useState(false);
 const [orderId, setOrderId] = useState("");

 // Cart State
 const cart = useCartStore((state) => state.cart);
 const getCartSubtotal = useCartStore((state) => state.getCartSubtotal);

 // Safely extract the primitive function pointer
 const storeClearCart = useCartStore((state) => state.clearCart);

 // Wrap it in a safe operational handler
 const clearCart = () => {
  if (storeClearCart) {
   storeClearCart();
  } else {
   console.warn("clearCart action is not implemented in useCartStore yet.");
  }
 };

 // Form State
 const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  pincode: "",
  city: "",
  state: "",
 });

 // GSAP Refs
 const checkmarkRef = useRef(null);
 const confirmationRef = useRef(null);

 // <-- COMBINED AUTH & MOUNT EFFECT -->
 useEffect(() => {
  setIsMounted(true);

  const unsubscribe = auth.onAuthStateChanged(async (user) => {
   if (!user) {
    // KICK UNLOGGED USERS OUT IMMEDIATELY
    router.push("/account");
    return;
   }

   // If logged in, fetch data to auto-fill the form
   try {
    const docRef = doc(db, "customers", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
     const profile = docSnap.data();
     const defaultAddress =
      profile.addresses?.find((a) => a.isDefault) ||
      profile.addresses?.[0] ||
      {};

     setFormData((prev) => ({
      ...prev,
      firstName: profile.name?.split(" ")[0] || "",
      lastName: profile.name?.split(" ").slice(1).join(" ") || "",
      email: profile.email || user.email,
      phone: profile.phone || "",
      address1: defaultAddress.line1 || "",
      address2: defaultAddress.line2 || "",
      city: defaultAddress.city || "",
      state: defaultAddress.state || "",
      pincode: defaultAddress.pincode || "",
     }));
    }
   } catch (error) {
    console.error("Error fetching customer data:", error);
   } finally {
    setLoadingAuth(false);
   }
  });

  return () => unsubscribe();
 }, [router]);

 // <-- EMPTY CART REDIRECT CHECK -->
 useEffect(() => {
  if (!loadingAuth && isMounted && cart.length === 0 && step !== 3) {
   router.push("/shop");
  }
 }, [cart, loadingAuth, isMounted, router, step]);

 // Safe Math
 const subtotal = isMounted ? getCartSubtotal() : 0;
 const shipping = subtotal >= 599 || subtotal === 0 ? 0 : 99;
 const total = subtotal + shipping;

 // Final Step GSAP Animation
 useGSAP(() => {
  if (step === 3 && checkmarkRef.current) {
   const path = checkmarkRef.current.querySelector("path");
   const length = path.getTotalLength();

   gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

   const tl = gsap.timeline();
   tl
    .fromTo(
     confirmationRef.current,
     { opacity: 0, y: 30 },
     { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
    )
    .to(path, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" });
  }
 }, [step]);

 // Handlers
 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  // Simulated Pincode API Auto-fill
  if (name === "pincode" && value.length === 6) {
   // Replace with actual India Post API fetch
   setTimeout(() => {
    setFormData((prev) => ({
     ...prev,
     city: "Haridwar",
     state: "Uttarakhand",
    }));
   }, 500);
  }
 };

 const handleProceedToPayment = (e) => {
  e.preventDefault();
  setStep(2);
  window.scrollTo({ top: 0, behavior: "smooth" });
 };

 const handleRazorpayPayment = async () => {
  setIsProcessing(true);

  // 1. Load the SDK securely
  const res = await loadRazorpayScript();
  if (!res) {
   alert("Payment gateway failed to load. Please check your connection.");
   setIsProcessing(false);
   return;
  }

  try {
   // 2. Request a secure Order ID from your Next.js backend
   const orderResponse = await fetch("/api/razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: total }),
   });

   const orderData = await orderResponse.json();
   if (!orderData.success) {
    console.error("Razorpay API Server Error:", orderData.error);
    throw new Error(orderData.error || "Failed to initialize order.");
   }

   // 3. Configure the Premium Overlay
   const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.order.amount,
    currency: "INR",
    name: "REIN ORO",
    description: "Luxury Signature Blends",
    image: "/logo.png",
    order_id: orderData.order.id,
    prefill: {
     name: `${formData.firstName} ${formData.lastName}`,
     email: formData.email,
     contact: formData.phone,
    },
    theme: {
     color: "#C9A84C",
    },
    handler: async function (response) {
     try {
      // Securely pull the current logged-in user's UID
      const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

      if (!currentUserId) {
       throw new Error("User session expired during checkout.");
      }

      // Call our new verification API
      const result = await fetch("/api/order/verify", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        userId: currentUserId,
        cart: cart,
        formData: formData,
        total: total,
        // --- ADDED THESE TWO LINES TO ENSURE DB GETS THE STATUS ---
        orderStatus: "processing",
        paymentStatus: "paid",
       }),
      });

      if (result.ok) {
       setOrderId(response.razorpay_payment_id);
       setStep(3); // Move to confirmation
       clearCart();
       window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
       throw new Error("Order verification failed");
      }
     } catch (err) {
      console.error("Order Commit Failed", err);
      alert(
       "Payment successful but order saving failed. Please contact support.",
      );
     } finally {
      setIsProcessing(false);
     }
    },
    modal: {
     ondismiss: function () {
      // User closed the overlay without paying
      setIsProcessing(false);
     },
    },
   };

   const paymentObject = new window.Razorpay(options);
   paymentObject.open();
  } catch (error) {
   console.error(error);
   alert("An error occurred while opening the payment gateway.");
   setIsProcessing(false);
  }
 };

 // <-- ADDED AUTH BLOCKING UI -->
 if (!isMounted || loadingAuth) {
  return (
   <main className="bg-[#0A0A0A] min-h-screen flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse">
     Authenticating Vault Access...
    </div>
   </main>
  );
 }

 return (
  <main
   className="bg-[#0A0A0A] min-h-screen text-[#F5EDD6] pt-32 pb-24"
   suppressHydrationWarning
  >
   {/* Dynamic Progress Header */}
   <header className="max-w-3xl mx-auto px-6 mb-16" suppressHydrationWarning>
    <div className="flex items-center justify-center gap-4 font-ui text-[11px] tracking-[0.2em] uppercase font-medium">
     <span
      className={`${step >= 1 ? "text-[#C9A84C]" : "text-[#4A4640]"} transition-colors`}
     >
      Delivery
     </span>
     <div
      className={`w-8 h-[1px] ${step >= 2 ? "bg-[#C9A84C]" : "bg-[#4A4640]"} transition-colors`}
     />
     <span
      className={`${step >= 2 ? "text-[#C9A84C]" : "text-[#4A4640]"} transition-colors`}
     >
      Payment
     </span>
     <div
      className={`w-8 h-[1px] ${step === 3 ? "bg-[#C9A84C]" : "bg-[#4A4640]"} transition-colors`}
     />
     <span
      className={`${step === 3 ? "text-[#C9A84C]" : "text-[#4A4640]"} transition-colors`}
     >
      Confirmation
     </span>
    </div>
   </header>

   {/* Main Layout Grid */}
   <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-[1fr_400px] gap-16 items-start">
    {/* LEFT COLUMN: Dynamic Steps */}
    <div className="w-full">
     {/* STEP 1: DELIVERY */}
     {step === 1 && (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <h2 className="font-display text-3xl text-[#F5EDD6] mb-8 italic">
        Delivery Details
       </h2>
       <form onSubmit={handleProceedToPayment} className="space-y-8">
        {/* Floating Label Grid */}
        <div className="grid grid-cols-2 gap-8">
         <FloatingInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          required
         />
         <FloatingInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          required
         />
        </div>

        <div className="grid grid-cols-2 gap-8">
         <FloatingInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
         />
         <FloatingInput
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
         />
        </div>

        <FloatingInput
         label="Address Line 1"
         name="address1"
         value={formData.address1}
         onChange={handleInputChange}
         required
        />
        <FloatingInput
         label="Address Line 2 (Optional)"
         name="address2"
         value={formData.address2}
         onChange={handleInputChange}
        />

        <div className="grid grid-cols-3 gap-8">
         <FloatingInput
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleInputChange}
          required
          maxLength={6}
         />
         <FloatingInput
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
         />
         <FloatingInput
          label="State"
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          required
         />
        </div>

        <button
         type="submit"
         className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-ui font-semibold text-[13px] tracking-[0.2em] uppercase py-5 rounded-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all mt-8"
         suppressHydrationWarning
        >
         Continue to Payment
        </button>
       </form>
      </div>
     )}

     {/* STEP 2: PAYMENT */}
     {step === 2 && (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex items-center gap-3 mb-8">
        <button
         onClick={() => setStep(1)}
         className="text-[#9A9485] hover:text-[#C9A84C] transition-colors"
         suppressHydrationWarning
        >
         <CaretRight size={20} className="rotate-180" />
        </button>
        <h2 className="font-display text-3xl text-[#F5EDD6] italic">
         Secure Payment
        </h2>
       </div>

       <div className="bg-[#141414] border border-[#C9A84C]/20 p-8 rounded-sm mb-8">
        <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-2 text-[#F5EDD6]">
          <LockKey size={20} className="text-[#C9A84C]" />
          <span className="font-ui text-sm uppercase tracking-widest font-medium">
           Razorpay Secure Checkout
          </span>
         </div>
         <div className="flex gap-2 opacity-60">
          <div className="w-8 h-5 bg-[#C9A84C] rounded-sm" />
          <div className="w-8 h-5 bg-[#F5EDD6] rounded-sm" />
         </div>
        </div>
        <p className="font-ui text-[13px] text-[#9A9485] leading-relaxed mb-8">
         After clicking "Pay Now", you will be redirected to Razorpay to
         complete your purchase securely. We accept all major Credit Cards, UPI,
         and NetBanking.
        </p>

        <button
         onClick={handleRazorpayPayment}
         disabled={isProcessing}
         className="w-full bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-ui font-semibold text-[13px] tracking-[0.2em] uppercase py-5 rounded-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
         suppressHydrationWarning
        >
         {isProcessing ? "Initializing Secure Gateway..." : `Pay ₹${total}`}
        </button>
       </div>

       {/* Delivery Summary Block */}
       <div className="border border-[#4A4640] p-6 rounded-sm">
        <h3 className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#9A9485] mb-4">
         Delivery To
        </h3>
        <p className="font-ui text-sm text-[#F5EDD6] leading-relaxed">
         {formData.firstName} {formData.lastName}
         <br />
         {formData.address1}, {formData.address2 && `${formData.address2}, `}
         {formData.city}, {formData.state} {formData.pincode}
         <br />
         {formData.phone}
        </p>
       </div>
      </div>
     )}

     {/* STEP 3: CONFIRMATION */}
     {step === 3 && (
      <div
       ref={confirmationRef}
       className="flex flex-col items-center justify-center text-center py-12"
      >
       <svg
        ref={checkmarkRef}
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="mb-8"
       >
        <circle
         cx="60"
         cy="60"
         r="50"
         fill="none"
         stroke="#C9A84C"
         strokeWidth="2"
         strokeDasharray="314"
         strokeDashoffset="0"
         className="opacity-20"
        />
        <path
         d="M40 60 L55 75 L80 45"
         fill="none"
         stroke="#C9A84C"
         strokeWidth="4"
         strokeLinecap="round"
         strokeLinejoin="round"
        />
       </svg>

       <span className="font-ui text-[11px] tracking-[0.4em] uppercase text-[#C9A84C] mb-4 block">
        Order Successful
       </span>
       <h2 className="font-display text-4xl md:text-5xl text-[#F5EDD6] mb-4 italic">
        Thank You for Your Order.
       </h2>
       <p className="font-ui text-[16px] text-[#9A9485] mb-8">
        Your luxury blend is being prepared. A confirmation email has been sent
        to <span className="text-[#F5EDD6]">{formData.email}</span>.
       </p>

       <div className="font-ui border-y border-[#C9A84C]/20 py-6 mb-12 w-full max-w-md">
        <span className="text-[#9A9485] text-xs uppercase tracking-widest block mb-2">
         Order Number
        </span>
        <span className="font-accent text-3xl text-[#C9A84C] tracking-wider">
         {orderId}
        </span>
       </div>

       <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button
         className="flex-1 bg-[#1C1A16] border border-[#C9A84C]/30 text-[#F5EDD6] font-ui text-xs uppercase tracking-[0.2em] font-semibold py-4 hover:border-[#C9A84C] transition-colors rounded-sm"
         suppressHydrationWarning
        >
         Download Invoice
        </button>
        <Link
         href="/shop"
         className="flex-1 bg-[#C9A84C] text-[#0A0A0A] font-ui text-xs uppercase tracking-[0.2em] font-semibold py-4 flex items-center justify-center hover:bg-[#E8C97A] transition-colors rounded-sm"
         suppressHydrationWarning
        >
         Continue Shopping
        </Link>
       </div>
      </div>
     )}
    </div>

    {/* RIGHT COLUMN: Order Summary (Hidden on Confirmation Step) */}
    {step !== 3 && (
     <div className="bg-[#111] border border-[#C9A84C]/10 p-8 rounded-sm sticky top-32">
      <h2 className="font-display text-2xl text-[#F5EDD6] italic mb-6">
       Order Summary
      </h2>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto scrollbar-thin pr-2">
       {cart.map((item) => (
        <div key={`${item._id}-${item.selectedWeight}`} className="flex gap-4">
         <div className="w-16 h-16 bg-[#1C1A16] rounded-sm relative overflow-hidden shrink-0 border border-[#C9A84C]/10">
          <Image
           src={item.image}
           alt={item.name}
           fill
           className="object-contain"
          />
         </div>
         <div className="flex-1 flex flex-col justify-center">
          <h3 className="font-display italic text-lg text-[#F5EDD6] leading-tight line-clamp-1">
           {item.name}
          </h3>
          <p className="font-ui text-[11px] text-[#9A9485] uppercase tracking-wider">
           {item.selectedWeight} × {item.quantity}
          </p>
         </div>
         <div className="flex flex-col justify-center text-right">
          <span className="font-accent text-[#C9A84C] font-semibold">
           ₹{item.price * item.quantity}
          </span>
         </div>
        </div>
       ))}
      </div>

      <div className="border-t border-[#4A4640] pt-6 space-y-3 font-ui text-sm text-[#9A9485]">
       <div className="flex justify-between">
        <span>Subtotal</span>
        <span className="text-[#F5EDD6]">₹{subtotal}</span>
       </div>
       <div className="flex justify-between">
        <span>Vault Shipping</span>
        <span className="text-[#F5EDD6]">
         {shipping === 0 ? "Complimentary" : `₹${shipping}`}
        </span>
       </div>
       <div className="flex justify-between items-end pt-4 border-t border-[#4A4640]">
        <span className="text-base text-[#F5EDD6]">Total</span>
        <span className="font-accent text-2xl text-[#C9A84C] font-bold">
         ₹{total}
        </span>
       </div>
      </div>
     </div>
    )}
   </div>
  </main>
 );
}

// Reusable Floating Label Input Component
function FloatingInput({
 label,
 name,
 type = "text",
 value,
 onChange,
 required,
 maxLength,
}) {
 const [mounted, setMounted] = useState(false);
 useEffect(() => setMounted(true), []);

 return (
  <div className="relative">
   <input
    id={name}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    required={required}
    maxLength={maxLength}
    placeholder=" "
    className="peer w-full bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui pt-5 pb-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-transparent"
    suppressHydrationWarning
   />
   <label
    htmlFor={name}
    className="absolute left-0 text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em] transition-all duration-300 pointer-events-none
                   top-0 peer-placeholder-shown:top-5 peer-placeholder-shown:text-[13px] peer-placeholder-shown:tracking-wider
                   peer-focus:top-0 peer-focus:text-[10px] peer-focus:tracking-[0.2em] peer-focus:text-[#C9A84C]"
    suppressHydrationWarning
   >
    {label} {required && "*"}
   </label>
  </div>
 );
}
