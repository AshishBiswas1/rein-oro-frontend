"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ChartLineUp, Users, Receipt, Package } from "phosphor-react";

export default function AnalyticsPage() {
 const [stats, setStats] = useState({
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  statusCounts: { pending: 0, processing: 0, shipped: 0, delivered: 0 },
 });
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchData = async () => {
   try {
    const ordersSnap = await getDocs(collection(db, "orders"));

    // 1. ADDED: Query to filter customers by role
    const q = query(
     collection(db, "customers"),
     where("role", "==", "customer"),
    );
    const customersSnap = await getDocs(q);

    let revenue = 0;
    let counts = { pending: 0, processing: 0, shipped: 0, delivered: 0 };

    ordersSnap.forEach((doc) => {
     const data = doc.data();
     revenue += Number(data.total || 0);
     const status = (data.orderStatus || "pending").toLowerCase();
     if (counts.hasOwnProperty(status)) counts[status]++;
    });

    setStats({
     totalRevenue: revenue,
     totalOrders: ordersSnap.size,
     totalCustomers: customersSnap.size, // This will now accurately count only customers
     statusCounts: counts,
    });
   } catch (error) {
    console.error("Failed to load analytics:", error);
   } finally {
    setLoading(false);
   }
  };

  fetchData();
 }, []);

 if (loading) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse font-ui">
     Synthesizing Vault Analytics...
    </div>
   </div>
  );
 }

 const cards = [
  {
   label: "Gross Revenue",
   value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
   icon: ChartLineUp,
  },
  { label: "Total Orders", value: stats.totalOrders, icon: Receipt },
  { label: "Active Patrons", value: stats.totalCustomers, icon: Users },
 ];

 return (
  <div className="space-y-8 animate-in fade-in duration-300">
   {/* Header */}
   <div className="pb-6 border-b border-[#1C1A16]">
    <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-2 block font-medium">
     Business Intelligence
    </span>
    <h1 className="text-3xl text-[#F5EDD6] font-display italic">
     Vault Analytics
    </h1>
   </div>

   {/* Stats Grid */}
   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {cards.map((card, idx) => (
     <div
      key={idx}
      className="bg-[#111111] border border-[#1C1A16] p-8 rounded-sm shadow-xl"
     >
      <div className="flex items-center justify-between mb-4">
       <span className="text-[#9A9485] font-ui text-[10px] uppercase tracking-[0.2em]">
        {card.label}
       </span>
       <card.icon size={20} className="text-[#C9A84C]" />
      </div>
      <p className="text-3xl text-[#F5EDD6] font-display">{card.value}</p>
     </div>
    ))}
   </div>

   {/* Fulfillment Distribution */}
   <div className="bg-[#111111] border border-[#1C1A16] p-8 rounded-sm">
    <h2 className="font-ui text-[#9A9485] text-[10px] uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
     <Package size={16} /> Fulfillment Distribution
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
     {Object.entries(stats.statusCounts).map(([status, count]) => (
      <div
       key={status}
       className="bg-[#0A0A0A] p-6 border border-[#1C1A16] rounded-sm text-center"
      >
       <p className="text-[#C9A84C] font-display text-2xl mb-1">{count}</p>
       <p className="text-[#4A4640] font-ui text-[9px] uppercase tracking-widest">
        {status}
       </p>
      </div>
     ))}
    </div>
   </div>
  </div>
 );
}
