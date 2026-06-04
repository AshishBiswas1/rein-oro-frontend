import { db } from "@/lib/firebase-admin";
import crypto from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { transporter } from "@/lib/email";

export async function POST(req) {
 const {
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  userId,
  cart,
  formData,
  total,
  orderStatus, // <-- Extracted from the frontend payload
  paymentStatus, // <-- Extracted from the frontend payload
 } = await req.json();

 // 1. Signature Verification (Prevents Payment Fraud)
 const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
 shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
 const digest = shasum.digest("hex");

 if (digest !== razorpay_signature) {
  return NextResponse.json({ message: "Transaction Invalid" }, { status: 400 });
 }

 // 2. Pre-generate Variables for Global Scope
 const orderRef = db.collection("orders").doc();
 const orderNumber = `RO-${Date.now().toString().slice(-6)}`;

 // 3. Atomic Firestore Transaction & Email
 try {
  await db.runTransaction(async (t) => {
   // A. Create Order Document
   t.set(orderRef, {
    orderNumber: orderNumber,
    userId: userId,
    items: cart,
    total,
    address: formData,
    paymentId: razorpay_payment_id,
    paymentStatus: paymentStatus || "paid",
    orderStatus: orderStatus || "processing", // <-- INJECTED INTO FIRESTORE HERE
    createdAt: FieldValue.serverTimestamp(),
   });

   // B. Update Stock
   // Note: This updates the global aggregate stock on the document.
   for (const item of cart) {
    const productId = item._id || item.id;
    if (productId) {
     const prodRef = db.collection("products").doc(productId);
     t.update(prodRef, { stock: FieldValue.increment(-item.quantity) });
    }
   }
  });

  // 4. Send Luxury Confirmation Email
  await transporter.sendMail({
   from: '"Rein Oro Vault" <support@reinoro.com>',
   to: formData.email,
   subject: `Order Confirmed: #${orderNumber}`,
   html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #0A0A0A; border: 1px solid #1C1A16; color: #F5EDD6;">
      <h1 style="color: #C9A84C; font-style: italic; font-size: 32px; margin-bottom: 5px;">Rein Oro</h1>
      <p style="color: #C9A84C; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; margin-top: 0;">Order Confirmation</p>
      
      <h2 style="font-weight: normal; margin-top: 40px;">Thank you for your order.</h2>
      <p style="color: #9A9485; line-height: 1.6;">Hello ${formData.firstName}, your luxury harvest is currently being prepared for delivery.</p>
      
      <div style="background-color: #111111; padding: 25px; margin: 30px 0; border: 1px solid #1C1A16;">
        <p style="margin: 0 0 10px 0;"><span style="color: #9A9485; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Order Number:</span> <br/><span style="color: #C9A84C; font-size: 18px;">${orderNumber}</span></p>
        <p style="margin: 0;"><span style="color: #9A9485; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Total Settled:</span> <br/><span style="color: #F5EDD6; font-size: 16px;">₹${total}</span></p>
      </div>
      
      <br/>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/account/profile" style="background: #C9A84C; color: #0A0A0A; padding: 15px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 0.2em; font-weight: bold; font-size: 11px; display: inline-block;">View Client Portal</a>
    </div>
   `,
  });

  return NextResponse.json({ success: true });
 } catch (error) {
  console.error("Transaction or Email Failed:", error);
  return NextResponse.json(
   { message: "Order processing failed" },
   { status: 500 },
  );
 }
}
