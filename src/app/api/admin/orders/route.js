import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

// GET: Fetch all orders
export async function GET() {
 try {
  const snapshot = await db
   .collection("orders")
   .orderBy("createdAt", "desc")
   .get();

  const orders = snapshot.docs.map((doc) => {
   const data = doc.data();
   return {
    id: doc.id,
    ...data,
    // Convert Firebase Timestamp to a readable string for the frontend
    createdAt: data.createdAt
     ? data.createdAt.toDate().toISOString()
     : new Date().toISOString(),
   };
  });

  return NextResponse.json(orders);
 } catch (error) {
  console.error("Failed to fetch orders:", error);
  return NextResponse.json(
   { error: "Failed to fetch orders" },
   { status: 500 },
  );
 }
}

// PATCH: Update Order Status
export async function PATCH(req) {
 try {
  const { orderId, status } = await req.json();

  await db.collection("orders").doc(orderId).update({
   orderStatus: status,
   updatedAt: new Date(),
  });

  return NextResponse.json({ success: true });
 } catch (error) {
  return NextResponse.json(
   { error: "Failed to update status" },
   { status: 500 },
  );
 }
}
