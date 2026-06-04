"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function AdminLayout({ children }) {
 const router = useRouter();
 const pathname = usePathname();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async (user) => {
   if (!user) {
    router.push("/admin");
    return;
   }
   try {
    const docRef = doc(db, "customers", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().role === "admin") {
     setIsAuthenticated(true);
    } else {
     router.push("/");
    }
   } catch (error) {
    console.error(error);
    router.push("/admin");
   } finally {
    setLoading(false);
   }
  });

  return () => unsubscribe();
 }, [router]);

 const handleAdminSignOut = async () => {
  await auth.signOut();
  router.push("/admin");
 };

 if (loading) {
  return (
   <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <div className="text-[#C9A84C] tracking-[0.4em] text-[11px] uppercase animate-pulse">
     Verifying Security Clearances...
    </div>
   </main>
  );
 }

 if (!isAuthenticated) return null;

 // Exact admin navigation layout manifest
 const links = [
  { name: "Overview", path: "/admin/dashboard" },
  { name: "Products", path: "/admin/products" },
  { name: "Orders", path: "/admin/orders" },
  { name: "Customers", path: "/admin/customers" },
  { name: "Analytics", path: "/admin/analytics" },
  { name: "Settings", path: "/admin/settings" },
 ];

 return (
  <div className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] flex flex-col">
   {/* Admin Header Bar */}
   <header className="w-full bg-[#111111] border-b border-[#1C1A16] px-8 py-4 flex items-center justify-between sticky top-0 z-30">
    <Link
     href="/admin/dashboard"
     className="font-display text-xl font-bold tracking-tight text-white"
    >
     REIN ORO{" "}
     <span className="text-xs text-[#C9A84C] tracking-widest uppercase ml-2 font-ui">
      Vault Admin
     </span>
    </Link>
    <button
     onClick={handleAdminSignOut}
     className="text-xs font-ui uppercase tracking-widest text-red-500/80 hover:text-red-500 transition-colors"
    >
     Secure Exit
    </button>
   </header>

   <div className="flex flex-1">
    {/* Navigation Sidebar */}
    <aside className="w-64 bg-[#0E0E0E] border-r border-[#1C1A16] hidden md:block pt-8 px-4 shrink-0">
     <nav className="space-y-2 font-ui text-[12px] uppercase tracking-widest">
      {links.map((link) => {
       const isActive = pathname.startsWith(link.path);
       return (
        <Link
         key={link.path}
         href={link.path}
         className={`flex items-center px-4 py-3 rounded-sm transition-all duration-200 ${
          isActive
           ? "bg-[#1C1A16] text-[#C9A84C] border-l-2 border-[#C9A84C] font-semibold"
           : "text-[#9A9485] hover:text-[#F5EDD6] hover:bg-[#111]"
         }`}
        >
         {link.name}
        </Link>
       );
      })}
      <div className="pt-6 mt-6 border-t border-[#1C1A16]">
       <Link
        href="/"
        target="_blank"
        className="flex items-center px-4 py-2 text-[11px] text-[#4A4640] hover:text-[#C9A84C] transition-colors"
       >
        View Live Storefront ↗
       </Link>
      </div>
     </nav>
    </aside>

    {/* Dynamic View Viewport */}
    <main className="flex-grow p-8 overflow-x-hidden animate-in fade-in duration-300">
     {children}
    </main>
   </div>
  </div>
 );
}
