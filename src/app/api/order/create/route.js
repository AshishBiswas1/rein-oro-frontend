import { db } from "@/lib/firebase-admin";

export async function POST(req) {
 const data = await req.json();
 const { userId, items, total, address, paymentId } = data;

 try {
  await db.runTransaction(async (transaction) => {
   // 1. Check and Update Stock for all items
   for (const item of items) {
    const prodRef = db.collection("products").doc(item.productId);
    const prodDoc = await transaction.get(prodRef);
    if (prodDoc.data().stock < item.qty)
     throw new Error(`Out of stock: ${item.name}`);

    transaction.update(prodRef, { stock: prodDoc.data().stock - item.qty });
   }

   // 2. Create the Order
   const orderRef = db.collection("orders").doc();
   transaction.set(orderRef, {
    ...data,
    orderNumber: "RO-" + Date.now().toString().slice(-6),
    paymentStatus: "paid",
    orderStatus: "new",
    createdAt: new Date(),
   });
  });

  return Response.json({ success: true });
 } catch (error) {
  return Response.json(
   { success: false, message: error.message },
   { status: 400 },
  );
 }
}
