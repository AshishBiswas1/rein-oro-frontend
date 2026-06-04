"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { CurrencyInr, ShoppingBag, ChartBar, Package } from "phosphor-react";

export default function AdminDashboard() {
 const [metrics, setMetrics] = useState({
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  activeProductsCount: 0,
 });
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  async function fetchDashboardMetrics() {
   try {
    // 1. Fetch Orders to compute processing data
    const ordersSnapshot = await getDocs(collection(db, "orders"));
    const ordersList = ordersSnapshot.docs.map((doc) => doc.data());

    // Calculate Revenue from your explicit matching fields
    const revenue = ordersList.reduce(
     (acc, order) => acc + (order.total || 0),
     0,
    );
    const orderCount = ordersList.length;
    const aov = orderCount > 0 ? revenue / orderCount : 0;

    // 2. Fetch total active catalog parameters
    const productsSnapshot = await getDocs(collection(db, "products"));
    const productCount = productsSnapshot.size;

    setMetrics({
     totalRevenue: revenue,
     totalOrders: orderCount,
     averageOrderValue: aov,
     activeProductsCount: productCount,
    });
   } catch (error) {
    console.error("Failed to compile dashboard intelligence matrices:", error);
   } finally {
    setLoading(false);
   }
  }

  fetchDashboardMetrics();
 }, []);

 if (loading) {
  return (
   <div className="w-full h-[60vh] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse">
     Compiling Vault Matrices...
    </div>
   </div>
  );
 }

 const kpiList = [
  {
   title: "Total Revenue",
   value: `₹${metrics.totalRevenue.toLocaleString("en-IN")}`,
   subtitle: "Gross settled acquisitions",
   icon: <CurrencyInr size={20} className="text-[#C9A84C]" />,
  },
  {
   title: "Total Orders",
   value: metrics.totalOrders,
   subtitle: "Dispatched & pending vaults",
   icon: <ShoppingBag size={20} className="text-[#C9A84C]" />,
  },
  {
   title: "Average Order Value",
   value: `₹${Math.round(metrics.averageOrderValue).toLocaleString("en-IN")}`,
   subtitle: "Mean customer basket yield",
   icon: <ChartBar size={20} className="text-[#C9A84C]" />,
  },
  {
   title: "Active Products",
   value: metrics.activeProductsCount,
   subtitle: "Live catalog allocations",
   icon: <Package size={20} className="text-[#C9A84C]" />,
  },
 ];

 return (
  <div className="space-y-10">
   {/* Dashboard Section Title */}
   <div>
    <span className="text-[#C9A84C] tracking-[0.4em] uppercase text-[10px] mb-2 block font-medium">
     Real-time Intelligence
    </span>
    <h1 className="text-4xl text-[#F5EDD6] font-display italic">
     Store Overview
    </h1>
   </div>

   {/* Responsive 4-Column KPI Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {kpiList.map((kpi, idx) => (
     <div
      key={idx}
      className="bg-[#111111] border border-[#1C1A16] p-6 rounded-sm relative group hover:border-[#C9A84C]/30 transition-all duration-300"
     >
      {/* Ambient Corner Glow accent */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-[#C9A84C]/5 to-transparent rounded-tr-sm pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
       <p className="text-[#9A9485] uppercase text-[10px] tracking-[0.2em] font-medium">
        {kpi.title}
       </p>
       <div className="p-2 bg-[#1C1A16] rounded-sm group-hover:bg-[#C9A84C]/10 transition-colors">
        {kpi.icon}
       </div>
      </div>

      <h3 className="text-3xl text-[#F5EDD6] font-display tracking-tight mb-1">
       {kpi.value}
      </h3>
      <p className="text-[#4A4640] text-[11px] tracking-wide font-ui">
       {kpi.subtitle}
      </p>
     </div>
    ))}
   </div>

   {/* Decorative Brand Spacer Block */}
   <div className="w-full h-[150px] border border-dashed border-[#1C1A16] flex items-center justify-center rounded-sm">
    <p className="text-[#4A4640] font-ui text-xs uppercase tracking-[0.3em]">
     Ready for system expansions (Graphs & Log Stream Counters)
    </p>
   </div>
  </div>
 );
}
