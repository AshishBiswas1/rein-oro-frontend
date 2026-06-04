import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
 try {
  const body = await req.json();
  const { cart } = body;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
   return NextResponse.json({ error: "Invalid cart data" }, { status: 400 });
  }

  // Initialize a Firestore Batch
  // A batch ensures that EITHER all products update successfully, OR none of them do.
  const batch = db.batch();

  for (const item of cart) {
   // Make sure we have a valid product ID
   const productId = item._id || item.id;
   if (!productId) continue;

   const productRef = db.collection("products").doc(productId);

   // We use FieldValue.increment with a negative number.
   // This atomic operation guarantees we never face race conditions.
   batch.update(productRef, {
    stock: FieldValue.increment(-item.quantity),
   });
  }

  // Commit the batch to the database
  await batch.commit();

  return NextResponse.json({
   success: true,
   message: "Inventory updated successfully",
  });
 } catch (error) {
  console.error("Failed to decrement inventory:", error);
  return NextResponse.json(
   { error: "Internal server error during inventory update" },
   { status: 500 },
  );
 }
}
