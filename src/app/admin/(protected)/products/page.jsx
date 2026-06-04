"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Plus, PencilSimple, Trash, Package } from "phosphor-react";

export default function ProductsPage() {
 const [products, setProducts] = useState([]);
 const [loading, setLoading] = useState(true);

 // Fetch Inventory
 const fetchProducts = async () => {
  try {
   const querySnapshot = await getDocs(collection(db, "products"));
   const productList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
   }));
   setProducts(productList);
  } catch (error) {
   console.error("Failed to fetch product registry:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchProducts();
 }, []);

 // Handle Secure Deletion
 const handleDelete = async (productId, productName) => {
  if (
   window.confirm(
    `Are you sure you want to permanently delete "${productName}" from the vault?`,
   )
  ) {
   try {
    await deleteDoc(doc(db, "products", productId));
    // Remove from local state immediately for snappy UI
    setProducts(products.filter((p) => p.id !== productId));
   } catch (error) {
    console.error("Error deleting product:", error);
    alert("Failed to delete product. Check console for details.");
   }
  }
 };

 if (loading) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse">
     Accessing Inventory Vault...
    </div>
   </div>
  );
 }

 return (
  <div className="space-y-8">
   {/* Header Section */}
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-[#1C1A16]">
    <div>
     <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-2 block font-medium">
      Registry
     </span>
     <h1 className="text-3xl text-[#F5EDD6] font-display italic">
      Product Management
     </h1>
    </div>
    <Link
     href="/admin/products/new"
     className="bg-gradient-to-br from-[#C9A84C] to-[#E8C97A] text-[#0A0A0A] font-ui font-semibold text-[11px] tracking-[0.2em] uppercase px-6 py-3 rounded-sm hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all flex items-center gap-2 shrink-0"
    >
     <Plus size={14} weight="bold" />
     Add New Blend
    </Link>
   </div>

   {/* Product Data Table */}
   <div className="bg-[#111111] border border-[#1C1A16] rounded-sm overflow-hidden">
    <div className="overflow-x-auto">
     <table className="w-full text-left border-collapse">
      <thead>
       <tr className="bg-[#0A0A0A] border-b border-[#1C1A16]">
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Product
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Base Price
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Stock Allocation
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6 text-right">
         Actions
        </th>
       </tr>
      </thead>
      <tbody className="divide-y divide-[#1C1A16]">
       {products.length === 0 ? (
        <tr>
         <td colSpan="4" className="p-12 text-center">
          <Package size={32} className="text-[#4A4640] mx-auto mb-4" />
          <p className="text-[#9A9485] font-ui text-sm uppercase tracking-widest">
           No products in vault.
          </p>
         </td>
        </tr>
       ) : (
        products.map((product) => {
         // 1. Safely extract base price from variants (or fallback)
         const basePrice =
          product.variants && product.variants.length > 0
           ? product.variants[0].price || 0
           : product.price || 0;

         // 2. Safely extract image from new images array (or fallback)
         const productImage = product.images?.[0] || product.image;

         return (
          <tr
           key={product.id}
           className="hover:bg-[#141414] transition-colors group"
          >
           <td className="p-6">
            <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#0A0A0A] border border-[#1C1A16] rounded-sm relative overflow-hidden shrink-0 flex items-center justify-center">
              {productImage ? (
               <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="48px"
               />
              ) : (
               <Package size={20} className="text-[#4A4640]" />
              )}
             </div>
             <div>
              <p className="text-[#F5EDD6] font-display italic text-lg line-clamp-1">
               {product.name}
              </p>
              <p className="text-[#9A9485] font-ui text-[10px] uppercase tracking-widest mt-1">
               ID: {product.id.slice(0, 8)}...
              </p>
             </div>
            </div>
           </td>
           <td className="p-6 font-ui text-[#F5EDD6]">
            {/* 3. Apply the calculated basePrice */}₹
            {Number(basePrice).toLocaleString("en-IN", {
             minimumFractionDigits: 2,
            })}
           </td>

           {/* 4. Dynamic Variant Stock Column */}
           <td className="p-6">
            {product.variants &&
            product.variants.some((v) => v.stock !== undefined) ? (
             <div className="flex flex-col gap-2">
              {product.variants.map((v, idx) => (
               <div
                key={idx}
                className="flex items-center justify-between max-w-[140px] gap-4"
               >
                <span className="text-[#9A9485] text-[10px] uppercase tracking-widest font-medium">
                 {v.weight}
                </span>
                <span
                 className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-widest border rounded-sm ${
                  v.stock > 10
                   ? "bg-green-500/10 text-green-400 border-green-500/20"
                   : v.stock > 0
                     ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                     : "bg-red-500/10 text-red-400 border-red-500/20"
                 }`}
                >
                 {v.stock > 0 ? `${v.stock} Units` : "Out"}
                </span>
               </div>
              ))}
             </div>
            ) : (
             /* Fallback for legacy items without variant stock */
             <span
              className={`inline-block px-2 py-1 text-[10px] uppercase tracking-widest border rounded-sm ${
               product.stock > 10
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : product.stock > 0
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
             >
              {product.stock > 0 ? `${product.stock} Units` : "Out of Stock"}
             </span>
            )}
           </td>

           <td className="p-6 text-right align-top pt-8">
            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
             <Link
              href={`/admin/products/${product.id}`}
              className="p-2 text-[#9A9485] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-sm transition-all"
              title="Edit Product"
             >
              <PencilSimple size={18} />
             </Link>
             <button
              onClick={() => handleDelete(product.id, product.name)}
              className="p-2 text-[#9A9485] hover:text-red-500 hover:bg-red-500/10 rounded-sm transition-all"
              title="Delete Product"
             >
              <Trash size={18} />
             </button>
            </div>
           </td>
          </tr>
         );
        })
       )}
      </tbody>
     </table>
    </div>
   </div>
  </div>
 );
}
