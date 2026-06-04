"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
 collection,
 getDocs,
 updateDoc,
 doc,
 query,
 orderBy,
} from "firebase/firestore";
import { Receipt, Eye, CaretDown, Package, CheckCircle } from "phosphor-react";

export default function OrdersPage() {
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [updatingId, setUpdatingId] = useState(null);

 // Fetch Orders from Firestore
 const fetchOrders = async () => {
  try {
   const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
   const querySnapshot = await getDocs(q);
   const orderList = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
   }));
   setOrders(orderList);
  } catch (error) {
   console.error("Failed to fetch orders:", error);
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchOrders();
 }, []);

 // Handle Order Status Update (Matches the db 'orderStatus' field)
 const handleStatusChange = async (orderId, newStatus) => {
  setUpdatingId(orderId);
  try {
   const orderRef = doc(db, "orders", orderId);
   await updateDoc(orderRef, {
    orderStatus: newStatus,
   });

   setOrders((prevOrders) =>
    prevOrders.map((order) =>
     order.id === orderId ? { ...order, orderStatus: newStatus } : order,
    ),
   );
  } catch (error) {
   console.error("Error updating order status:", error);
   alert("Failed to update status. Check console.");
  } finally {
   setUpdatingId(null);
  }
 };

 // Status badge coloring
 const getStatusBadge = (status) => {
  const baseClasses =
   "inline-block px-3 py-1 text-[9px] uppercase tracking-widest border rounded-sm font-medium";
  switch (status?.toLowerCase()) {
   case "delivered":
    return `${baseClasses} bg-green-500/10 text-green-400 border-green-500/20`;
   case "shipped":
    return `${baseClasses} bg-blue-500/10 text-blue-400 border-blue-500/20`;
   case "processing":
    return `${baseClasses} bg-yellow-500/10 text-yellow-400 border-yellow-500/20`;
   case "cancelled":
    return `${baseClasses} bg-red-500/10 text-red-400 border-red-500/20`;
   default: // "pending"
    return `${baseClasses} bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20`;
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
     Accessing Order Ledger...
    </div>
   </div>
  );
 }

 return (
  <div className="space-y-8 animate-in fade-in duration-300">
   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-[#1C1A16]">
    <div>
     <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-2 block font-medium">
      Fulfillment
     </span>
     <h1 className="text-3xl text-[#F5EDD6] font-display italic">
      Order Ledger
     </h1>
    </div>
    <div className="text-[#9A9485] font-ui text-[11px] uppercase tracking-[0.2em] bg-[#111111] px-4 py-2 border border-[#1C1A16] rounded-sm">
     Total Orders: {orders.length}
    </div>
   </div>

   <div className="bg-[#111111] border border-[#1C1A16] rounded-sm overflow-hidden shadow-2xl">
    <div className="overflow-x-auto">
     <table className="w-full text-left border-collapse">
      <thead>
       <tr className="bg-[#0A0A0A] border-b border-[#1C1A16]">
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Order Details
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Customer
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Total Amount
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6">
         Fulfillment Status
        </th>
        <th className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] font-medium p-6 text-right">
         Actions
        </th>
       </tr>
      </thead>
      <tbody className="divide-y divide-[#1C1A16]">
       {orders.length === 0 ? (
        <tr>
         <td colSpan="5" className="p-16 text-center">
          <Receipt size={32} className="text-[#4A4640] mx-auto mb-4" />
          <p className="text-[#9A9485] font-ui text-sm uppercase tracking-widest">
           No orders recorded yet.
          </p>
         </td>
        </tr>
       ) : (
        orders.map((order) => (
         <tr
          key={order.id}
          className={`hover:bg-[#141414] transition-colors group ${
           updatingId === order.id ? "opacity-50 pointer-events-none" : ""
          }`}
         >
          {/* Order Details Column */}
          <td className="p-6">
           <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0A0A0A] border border-[#1C1A16] rounded-sm flex items-center justify-center shrink-0 text-[#4A4640]">
             <Package size={18} />
            </div>
            <div>
             <p className="text-[#F5EDD6] font-display text-lg tracking-wide uppercase">
              {order.orderNumber || `#${order.id.slice(-6)}`}
             </p>
             <p className="text-[#9A9485] font-ui text-[9px] uppercase tracking-widest mt-1">
              {formatDate(order.createdAt)}
             </p>
            </div>
           </div>
          </td>

          {/* Customer Column (Mapped to 'address' object) */}
          <td className="p-6">
           <p className="text-[#F5EDD6] font-ui text-sm">
            {order.address?.firstName} {order.address?.lastName}
           </p>
           <p
            className="text-[#9A9485] font-ui text-[10px] mt-1 truncate max-w-[150px]"
            title={order.address?.email}
           >
            {order.address?.email || "No email provided"}
           </p>
          </td>

          {/* Amount Column (Mapped to 'total' and 'paymentStatus') */}
          <td className="p-6 font-ui">
           <div className="flex items-center gap-2">
            <span className="text-[#E8C97A] text-md">
             ₹
             {Number(order.total || 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
             })}
            </span>
            {order.paymentStatus === "paid" && (
             <span className="text-green-400 bg-green-500/10 border border-green-500/20 text-[8px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1">
              <CheckCircle size={10} /> Paid
             </span>
            )}
           </div>
           <span className="block text-[#4A4640] text-[9px] uppercase tracking-widest mt-1">
            {order.items?.length || 0} Items
           </span>
          </td>

          {/* Status Column (Mapped to 'orderStatus') */}
          <td className="p-6">
           <div className="relative inline-block w-36">
            <select
             value={order.orderStatus?.toLowerCase() || "pending"}
             onChange={(e) => handleStatusChange(order.id, e.target.value)}
             className={`appearance-none w-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C9A84C] transition-all ${getStatusBadge(
              order.orderStatus || "pending",
             )}`}
            >
             <option value="pending" className="bg-[#111111] text-[#C9A84C]">
              Pending
             </option>
             <option
              value="processing"
              className="bg-[#111111] text-yellow-400"
             >
              Processing
             </option>
             <option value="shipped" className="bg-[#111111] text-blue-400">
              Shipped
             </option>
             <option value="delivered" className="bg-[#111111] text-green-400">
              Delivered
             </option>
             <option value="cancelled" className="bg-[#111111] text-red-400">
              Cancelled
             </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-current opacity-70">
             <CaretDown size={10} weight="bold" />
            </div>
           </div>
          </td>

          {/* Actions Column */}
          <td className="p-6 text-right">
           <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
             href={`/admin/orders/${order.id}`}
             className="p-2 text-[#9A9485] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-sm transition-all border border-transparent hover:border-[#C9A84C]/20"
             title="View Full Order Details"
            >
             <Eye size={18} />
            </Link>
           </div>
          </td>
         </tr>
        ))
       )}
      </tbody>
     </table>
    </div>
   </div>
  </div>
 );
}
