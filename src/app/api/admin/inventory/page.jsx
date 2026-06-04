"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";

export default function InventoryManagement() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [updatingId, setUpdatingId] = useState(null);

 // Fetch all products on load
 useEffect(() => {
  fetchProducts();
 }, []);

 const fetchProducts = async () => {
  try {
   const querySnapshot = await getDocs(collection(db, "products"));
   const items = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    // Local state for the input field to prevent immediate database writes on every keystroke
    draftStock: doc.data().stock || 0,
   }));
   setProducts(items);
  } catch (error) {
   console.error("Error fetching inventory:", error);
  } finally {
   setLoading(false);
  }
 };

 const handleStockChange = (id, newStock) => {
  setProducts((prev) =>
   prev.map((product) =>
    product.id === id
     ? { ...product, draftStock: parseInt(newStock) || 0 }
     : product,
   ),
  );
 };

 const saveInventory = async (id, newStock) => {
  setUpdatingId(id);
  try {
   const productRef = doc(db, "products", id);
   await updateDoc(productRef, {
    stock: newStock,
   });

   // Update the actual stock in our local state to match the database
   setProducts((prev) =>
    prev.map((product) =>
     product.id === id ? { ...product, stock: newStock } : product,
    ),
   );
  } catch (error) {
   console.error("Failed to update stock:", error);
   alert("Error updating inventory.");
  } finally {
   setUpdatingId(null);
  }
 };

 if (loading) {
  return (
   <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#C9A84C] font-ui tracking-widest text-[11px] uppercase">
    Loading Vault Inventory...
   </div>
  );
 }

 return (
  <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] py-20 px-6">
   <div className="max-w-5xl mx-auto">
    {/* Header */}
    <header className="mb-12 flex justify-between items-end border-b border-[#1C1A16] pb-6">
     <div>
      <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[11px] mb-2 block font-medium">
       Admin Portal
      </span>
      <h1 className="font-display text-4xl italic">Inventory Management</h1>
     </div>
     <Link
      href="/admin"
      className="text-[#9A9485] font-ui text-[11px] uppercase tracking-widest hover:text-[#C9A84C] transition-colors"
     >
      Back to Dashboard
     </Link>
    </header>

    {/* Inventory Table */}
    <div className="bg-[#111111] border border-[#1C1A16] rounded-sm overflow-hidden">
     {/* Table Headers */}
     <div className="grid grid-cols-12 gap-4 p-6 border-b border-[#1C1A16] bg-[#0E0E0E] text-[#9A9485] font-ui text-[10px] uppercase tracking-widest">
      <div className="col-span-6">Product</div>
      <div className="col-span-3 text-center">Status</div>
      <div className="col-span-3 text-right">Available Stock</div>
     </div>

     {/* Product Rows */}
     <div className="divide-y divide-[#1C1A16]">
      {products.map((product) => (
       <div
        key={product.id}
        className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-[#141414] transition-colors"
       >
        {/* Product Info */}
        <div className="col-span-6 flex items-center gap-4">
         <div className="w-12 h-12 bg-[#1C1A16] border border-[#4A4640] shrink-0 relative overflow-hidden">
          {product.images && product.images[0] ? (
           <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
           />
          ) : (
           <div className="w-full h-full bg-[#1C1A16]" />
          )}
         </div>
         <div>
          <h3 className="font-display text-lg text-[#F5EDD6] leading-none mb-1">
           {product.name}
          </h3>
          <p className="font-ui text-[11px] text-[#9A9485] tracking-wider uppercase">
           ₹{product.price} • {product.category || "Signature"}
          </p>
         </div>
        </div>

        {/* Status Indicator */}
        <div className="col-span-3 flex justify-center">
         {product.stock <= 0 ? (
          <span className="px-3 py-1 bg-red-900/20 text-red-500 border border-red-900/50 text-[9px] uppercase tracking-widest rounded-sm">
           Out of Stock
          </span>
         ) : product.stock < 10 ? (
          <span className="px-3 py-1 bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 text-[9px] uppercase tracking-widest rounded-sm">
           Low Stock
          </span>
         ) : (
          <span className="px-3 py-1 bg-green-900/20 text-green-500 border border-green-900/50 text-[9px] uppercase tracking-widest rounded-sm">
           In Stock
          </span>
         )}
        </div>

        {/* Stock Input & Save */}
        <div className="col-span-3 flex items-center justify-end gap-3">
         <input
          type="number"
          min="0"
          value={product.draftStock}
          onChange={(e) => handleStockChange(product.id, e.target.value)}
          className="w-20 bg-transparent border-b border-[#4A4640] text-[#F5EDD6] font-ui text-center py-1 focus:outline-none focus:border-[#C9A84C] transition-colors"
         />
         <button
          onClick={() => saveInventory(product.id, product.draftStock)}
          disabled={
           updatingId === product.id || product.draftStock === product.stock
          }
          className="text-[10px] uppercase tracking-widest font-semibold px-4 py-2 rounded-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed
                      bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#E8C97A]"
         >
          {updatingId === product.id ? "..." : "Save"}
         </button>
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>
  </main>
 );
}
