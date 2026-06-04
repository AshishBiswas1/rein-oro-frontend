import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
 try {
  // Debug: Ensure keys are loaded
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
   throw new Error("Razorpay API Keys are missing in environment variables.");
  }

  const { amount } = await req.json();

  const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
   amount: Math.round(amount * 100),
   currency: "INR",
   receipt: "ro_receipt_" + Math.random().toString(36).substring(7),
  };

  const order = await razorpay.orders.create(options);
  return NextResponse.json({ success: true, order });
 } catch (error) {
  console.error("Razorpay API Error:", error.message);
  return NextResponse.json(
   { success: false, error: error.message },
   { status: 500 },
  );
 }
}
