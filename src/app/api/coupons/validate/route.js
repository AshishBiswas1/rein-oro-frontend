import { db } from "@/lib/firebase-admin";

export async function POST(req) {
 const { code, subtotal } = await req.json();

 const couponRef = db.collection("coupons").doc(code);
 const doc = await couponRef.get();

 if (!doc.exists || !doc.data().isActive) {
  return Response.json(
   { valid: false, message: "Invalid coupon" },
   { status: 400 },
  );
 }

 const data = doc.data();
 if (subtotal < data.minOrderValue) {
  return Response.json(
   { valid: false, message: `Minimum order value ₹${data.minOrderValue}` },
   { status: 400 },
  );
 }

 return Response.json({ valid: true, type: data.type, value: data.value });
}
