"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
 ArrowLeft,
 Package,
 User,
 MapPinLine,
 CreditCard,
 CircleNotch,
 CheckCircle,
} from "phosphor-react";

export default function OrderDetailPage() {
 const { id } = useParams();
 const [order, setOrder] = useState(null);
 const [loading, setLoading] = useState(true);
 const [updating, setUpdating] = useState(false);

 useEffect(() => {
  const fetchOrder = async () => {
   try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
     setOrder({ id: docSnap.id, ...docSnap.data() });
    } else {
     console.error("Order not found");
    }
   } catch (error) {
    console.error("Failed to load order:", error);
   } finally {
    setLoading(false);
   }
  };

  if (id) fetchOrder();
 }, [id]);

 const handleStatusChange = async (newStatus) => {
  setUpdating(true);
  try {
   const orderRef = doc(db, "orders", id);
   await updateDoc(orderRef, {
    orderStatus: newStatus,
   });
   setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
  } catch (error) {
   console.error("Error updating status:", error);
   alert("Failed to update status.");
  } finally {
   setUpdating(false);
  }
 };

 const formatDate = (timestamp) => {
  if (!timestamp) return "Date Unknown";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("en-IN", {
   day: "numeric",
   month: "short",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit",
  }).format(date);
 };

 if (loading) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse font-ui">
     Retrieving Receipt...
    </div>
   </div>
  );
 }

 if (!order) {
  return (
   <div className="w-full h-[60vh] flex flex-col items-center justify-center text-[#F5EDD6] space-y-4">
    <h1 className="font-display text-2xl italic text-[#9A9485]">
     Order Not Found
    </h1>
    <Link
     href="/admin/orders"
     className="text-[#C9A84C] font-ui text-[10px] uppercase tracking-widest hover:underline"
    >
     Return to Ledger
    </Link>
   </div>
  );
 }

 return (
  <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
   {/* Header Controls */}
   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#1C1A16] gap-4">
    <div className="flex items-center gap-4">
     <Link
      href="/admin/orders"
      className="w-10 h-10 flex items-center justify-center bg-[#111111] border border-[#1C1A16] rounded-sm text-[#9A9485] hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-all"
     >
      <ArrowLeft size={18} />
     </Link>
     <div>
      <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-1 block font-medium">
       {formatDate(order.createdAt)}
      </span>
      <h1 className="text-2xl text-[#F5EDD6] font-display italic tracking-wide uppercase">
       {order.orderNumber || `#${order.id.slice(-6)}`}
      </h1>
     </div>
    </div>
   </div>

   {/* Main Dashboard Grid */}
   <div className="grid lg:grid-cols-[2fr_1fr] gap-8 items-start">
    {/* LEFT COLUMN: Items & Summary */}
    <div className="space-y-8">
     <div className="bg-[#111111] border border-[#1C1A16] rounded-sm p-8">
      <h2 className="font-ui text-[#9A9485] text-[11px] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
       <Package size={16} /> Harvested Items ({order.items?.length || 0})
      </h2>

      <div className="space-y-6">
       {order.items?.map((item, idx) => (
        <div
         key={idx}
         className="flex gap-6 items-center border-b border-[#1C1A16] pb-6 last:border-0 last:pb-0"
        >
         <div className="w-20 h-20 bg-[#0A0A0A] border border-[#1C1A16] rounded-sm relative overflow-hidden shrink-0">
          <Image
           src={item.image || "/placeholder.jpg"}
           alt={item.name}
           fill
           className="object-cover"
          />
         </div>
         <div className="flex-1">
          <h3 className="text-[#F5EDD6] font-display italic text-lg">
           {item.name}
          </h3>
          <p className="text-[#9A9485] font-ui text-[10px] uppercase tracking-widest mt-1">
           Tier: <span className="text-[#C9A84C]">{item.selectedWeight}</span>
          </p>
         </div>
         <div className="text-right font-ui">
          <p className="text-[#F5EDD6] text-sm">
           ₹
           {Number(item.price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
           })}
          </p>
          <p className="text-[#4A4640] text-[10px] uppercase tracking-widest mt-1">
           Qty: {item.quantity}
          </p>
         </div>
         <div className="text-right font-ui min-w-[80px]">
          <p className="text-[#E8C97A] font-medium">
           ₹
           {(item.price * item.quantity).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
           })}
          </p>
         </div>
        </div>
       ))}
      </div>
     </div>

     {/* Fulfillment Action Panel */}
     <div className="bg-[#0A0A0A] border border-[#1C1A16] rounded-sm p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div>
       <h3 className="font-ui text-[#F5EDD6] text-[11px] uppercase tracking-[0.2em] mb-1">
        Update Fulfillment
       </h3>
       <p className="text-[#4A4640] font-ui text-xs">
        Notify the patron of their harvest journey.
       </p>
      </div>
      <div className="flex items-center gap-3">
       {updating && (
        <CircleNotch size={16} className="text-[#C9A84C] animate-spin" />
       )}
       <div className="flex bg-[#111111] rounded-sm overflow-hidden border border-[#1C1A16]">
        {["pending", "processing", "shipped", "delivered"].map((status) => (
         <button
          key={status}
          onClick={() => handleStatusChange(status)}
          disabled={updating}
          className={`px-4 py-2 font-ui text-[9px] uppercase tracking-widest transition-all ${
           order.orderStatus === status
            ? "bg-[#C9A84C] text-[#0A0A0A] font-bold"
            : "text-[#9A9485] hover:bg-[#1C1A16] hover:text-[#F5EDD6]"
          }`}
         >
          {status}
         </button>
        ))}
       </div>
      </div>
     </div>
    </div>

    {/* RIGHT COLUMN: Customer, Shipping, & Payment */}
    <div className="space-y-8">
     {/* Customer Card */}
     <div className="bg-[#111111] border border-[#1C1A16] rounded-sm p-6">
      <h2 className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-[#1C1A16] pb-4">
       <User size={16} /> Patron Details
      </h2>
      <div className="space-y-1 font-ui text-sm">
       <p className="text-[#F5EDD6] font-medium">
        {order.address?.firstName} {order.address?.lastName}
       </p>
       <p className="text-[#9A9485] hover:text-[#C9A84C] transition-colors">
        <a href={`mailto:${order.address?.email}`}>{order.address?.email}</a>
       </p>
       <p className="text-[#9A9485] hover:text-[#C9A84C] transition-colors">
        <a href={`tel:${order.address?.phone}`}>{order.address?.phone}</a>
       </p>
      </div>
     </div>

     {/* Shipping Card */}
     <div className="bg-[#111111] border border-[#1C1A16] rounded-sm p-6">
      <h2 className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-[#1C1A16] pb-4">
       <MapPinLine size={16} /> Shipping Destination
      </h2>
      <div className="font-ui text-sm text-[#F5EDD6] leading-relaxed">
       <p>
        {order.address?.firstName} {order.address?.lastName}
       </p>
       <p className="text-[#9A9485] mt-2">
        {order.address?.address1}
        {order.address?.address2 && (
         <>
          <br />
          {order.address.address2}
         </>
        )}
        <br />
        {order.address?.city}, {order.address?.state} {order.address?.pincode}
       </p>
      </div>
     </div>

     {/* Payment Card */}
     <div className="bg-[#111111] border border-[#1C1A16] rounded-sm p-6">
      <h2 className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-[#1C1A16] pb-4">
       <CreditCard size={16} /> Financial Settlement
      </h2>

      <div className="space-y-3 font-ui text-sm mb-6">
       <div className="flex justify-between text-[#9A9485]">
        <span>Gross Subtotal</span>
        <span>
         ₹
         {Number(order.total).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
         })}
        </span>
       </div>
       <div className="flex justify-between text-[#9A9485]">
        <span>Vault Shipping</span>
        <span>Complimentary</span>
       </div>
       <div className="flex justify-between text-[#F5EDD6] font-medium pt-3 border-t border-[#1C1A16]">
        <span>Total Settled</span>
        <span className="text-[#C9A84C]">
         ₹
         {Number(order.total).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
         })}
        </span>
       </div>
      </div>

      <div className="bg-[#0A0A0A] p-4 rounded-sm border border-[#1C1A16] space-y-2">
       <div className="flex items-center justify-between">
        <span className="text-[#4A4640] text-[9px] uppercase tracking-widest font-ui">
         Status
        </span>
        {order.paymentStatus === "paid" ? (
         <span className="text-green-400 flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold">
          <CheckCircle size={12} weight="fill" /> Paid
         </span>
        ) : (
         <span className="text-yellow-400 text-[9px] uppercase tracking-widest font-bold">
          Pending
         </span>
        )}
       </div>
       <div className="flex items-center justify-between">
        <span className="text-[#4A4640] text-[9px] uppercase tracking-widest font-ui">
         Txn ID
        </span>
        <span className="text-[#9A9485] text-[10px] font-mono tracking-wider">
         {order.paymentId || "N/A"}
        </span>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
