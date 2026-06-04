// frontend/src/lib/payment.js
export const loadRazorpay = async (amount, onSuccess) => {
 // 1. Check if already loaded
 if (window.Razorpay) {
  proceedToPayment(amount, onSuccess);
  return;
 }

 // 2. Dynamically load the script
 const script = document.createElement("script");
 script.src = "https://checkout.razorpay.com/v1/checkout.js";
 script.onload = () => proceedToPayment(amount, onSuccess);
 script.onerror = () =>
  alert("Razorpay SDK failed to load. Check your internet.");
 document.body.appendChild(script);
};

const proceedToPayment = (amount, onSuccess) => {
 const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: amount * 100,
  currency: "INR",
  name: "Rein Oro",
  description: "Premium Dry Fruits & Makhana",
  handler: (response) => {
   onSuccess(response.razorpay_payment_id);
  },
  prefill: {
   name: "Valued Customer",
   email: "customer@example.com",
  },
  theme: {
   color: "#C9A84C",
  },
 };

 const paymentObject = new window.Razorpay(options);
 paymentObject.open();
};
