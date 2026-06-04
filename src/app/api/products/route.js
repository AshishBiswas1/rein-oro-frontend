import { db } from "@/lib/firebase-admin";

export async function GET() {
 try {
  const productsSnapshot = await db
   .collection("products")
   .where("isActive", "==", true)
   .get();

  const products = productsSnapshot.docs.map((doc) => ({
   id: doc.id,
   ...doc.data(),
  }));

  return Response.json(products);
 } catch (error) {
  return Response.json({ error: "Failed to fetch products" }, { status: 500 });
 }
}
