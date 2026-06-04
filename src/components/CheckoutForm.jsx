"use client";
import { useState } from "react";
import {
 PaymentElement,
 useStripe,
 useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "../store/useCartStore";

export default function CheckoutForm({ amount }) {
 const stripe = useStripe();
 const elements = useElements();
 const [isLoading, setIsLoading] = useState(false);
 const [message, setMessage] = useState(null);
 const { clearCart } = useCartStore();

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!stripe || !elements) return;
  setIsLoading(true);

  const { error } = await stripe.confirmPayment({
   elements,
   confirmParams: { return_url: `${window.location.origin}/success` },
  });

  if (error) setMessage(error.message);
  else clearCart();

  setIsLoading(false);
 };

 return (
  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
   <PaymentElement options={{ layout: "tabs" }} />
   {message && <div className="text-red-500 text-sm font-ui">{message}</div>}
   <button
    disabled={isLoading || !stripe || !elements}
    className="w-full bg-gradient-to-br from-rein-gold-primary to-rein-gold-light text-rein-black font-ui font-semibold tracking-[0.2em] uppercase py-4 rounded-sm hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-shadow disabled:opacity-50"
   >
    {isLoading ? "Processing..." : `Pay ₹${amount}`}
   </button>
  </form>
 );
}
