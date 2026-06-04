import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

// ONLY RUN THIS ONCE to populate your database!
export async function GET() {
 try {
  const products = [
   {
    name: "Himalayan Pink Salt Makhana",
    slug: "himalayan-pink-salt",
    description:
     "Delicately roasted lotus seeds dusted with pristine Himalayan pink salt and a touch of cold-pressed olive oil.",
    shortDescription:
     "The classic, elevated. Perfect balance of salt and crunch.",
    price: 35000, // ₹350.00 (Stored in paise)
    category: "Signature",
    weight: ["100g", "250g"],
    stock: 50,
    isActive: true,
    images: ["/images/products/pink-salt.jpg"], // Replace with your actual image paths
    createdAt: FieldValue.serverTimestamp(),
   },
   {
    name: "Truffle & Aged Parmesan",
    slug: "truffle-parmesan",
    description:
     "An opulent blend of earthy black truffle and mature parmesan cheese, creating a rich, umami-forward snacking experience.",
    shortDescription: "Earthy black truffle meets sharp aged parmesan.",
    price: 49900, // ₹499.00
    category: "Premium",
    weight: ["100g", "250g"],
    stock: 30,
    isActive: true,
    images: ["/images/products/truffle.jpg"],
    createdAt: FieldValue.serverTimestamp(),
   },
   {
    name: "Saffron & Royal Honey",
    slug: "saffron-honey",
    description:
     "Slow-roasted makhana glazed with pure organic honey and infused with Kashmiri saffron threads.",
    shortDescription: "A sweet, floral delicacy fit for royalty.",
    price: 45000, // ₹450.00
    category: "Sweet",
    weight: ["100g", "250g"],
    stock: 40,
    isActive: true,
    images: ["/images/products/saffron.jpg"],
    createdAt: FieldValue.serverTimestamp(),
   },
  ];

  const batch = db.batch();

  products.forEach((product) => {
   // Create a new document reference with an auto-generated ID
   const docRef = db.collection("products").doc();
   batch.set(docRef, product);
  });

  // Commit the batch to Firestore
  await batch.commit();

  return NextResponse.json({
   success: true,
   message: "Successfully seeded 3 luxury products to Firestore!",
  });
 } catch (error) {
  console.error("Seeding failed:", error);
  return NextResponse.json(
   { error: "Failed to seed database" },
   { status: 500 },
  );
 }
}
