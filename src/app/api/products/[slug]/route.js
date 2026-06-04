import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(req, context) {
 try {
  // 1. Failsafe: Get the params (awaiting it for Next.js 15+ compatibility)
  const resolvedParams = await context.params;

  // 2. Double-Failsafe: If params.slug is somehow missing, pull it straight from the URL
  const slug = resolvedParams?.slug || req.nextUrl.pathname.split("/").pop();

  if (!slug) {
   return NextResponse.json(
    { error: "Slug is missing from URL" },
    { status: 400 },
   );
  }

  // 3. Query Firestore
  const snapshot = await db
   .collection("products")
   .where("slug", "==", slug)
   .where("isActive", "==", true)
   .limit(1)
   .get();

  if (snapshot.empty) {
   return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const doc = snapshot.docs[0];
  const product = { id: doc.id, ...doc.data() };

  // 4. Safely clean up Firestore Timestamps
  if (product.createdAt && typeof product.createdAt.toDate === "function") {
   product.createdAt = product.createdAt.toDate().toISOString();
  }
  if (product.updatedAt && typeof product.updatedAt.toDate === "function") {
   product.updatedAt = product.updatedAt.toDate().toISOString(); // <-- Added .toDate()
  }

  return NextResponse.json(product);
 } catch (error) {
  console.error("Error fetching product by slug:", error);
  return NextResponse.json(
   { error: "Failed to fetch product" },
   { status: 500 },
  );
 }
}
